import jsonPath from 'jsonpath'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { LocalStorage, Notify } from 'quasar'
import NodeSchema from 'src/assets/treeNode.json'
import _ from 'lodash'

export const useThoughtStore = defineStore('thoughtStore', {
  state: () => ({
    loading: false,
    error: null,
    thoughts: {},
    currentUrl: '',
    selectedNode: {},
    tempNode: {},
    selectedText: '',
    crumbs: [],
    queryPath: '',
    nextId: 0,
    dirty: false,
    editing: false,
    urls: [
      'http://localhost:3001/0',
      'http://localhost:3002/Purchases',
      'http://localhost:3000/icons',
      'http://localhost:3000/sets',
      'http://localhost:3000/groups',
      'https://jsonplaceholder.typicode.com/todos',
    ],
    requiredNodeFields: ['label'],
    NodeSchema: NodeSchema,
  }),
  getters: {
    /**
     * Extracts all keys from the treeNode JSON and maps them to their default values.
     * @returns {Object} - An object with keys as property names and values as their defaults.
     */
    getTreeNodeDefaults: () => {
      // Use _.mapValues to iterate over the object and extract the "default" value for each key
      return _.mapValues(NodeSchema, (value) => _.get(value, 'default', null))
    },
    hasCrumbs() {
      return this.crumbs.length > 0
    },
    crumbTrail() {
      return _.join(this.crumbs, ' > ')
    },
    /**
     * Determines if the given node has children.
     *
     * @param {Object} params - The parameters object.
     * @param {Object} params.selectedNode - The node to check for children.
     * @param {Array|undefined} params.selectedNode.children - The children of the node, if any.
     * @returns {boolean} Returns `true` if the node has children, otherwise `false`.
     */
    nodeHasChildren({ selectedNode }) {
      return !_.isEmpty(selectedNode?.children)
    },
    getNodeChildren({ selectedNode }) {
      return selectedNode?.children && selectedNode?.children.length > 0
        ? selectedNode?.children
        : []
    },
    getFilteredNodeKeys() {
      var keys = []
      if (this.isNodeSelected) {
        // keys = Object.keys(selectedNode?.value?.nodeValue)
        // keys = keys.filter((v) => !['id', 'text', 'icon', 'children', 'title'].includes(v))
      }
      return keys
    },
    getNodeKeys({ selectedNode }) {
      return Object.keys(selectedNode)
    },
    currentApiVersion({ urls }) {
      return urls.length
    },
    apiVersionList({ urls }) {
      // add api endpoint version numbers based on a FIFO array of urls
      // reverse url array to align the indexes and create version array of
      // key/value: key = v[#], value = url
      var versions = urls
        ?.slice(0)
        .reverse()
        .map((url, idx) => {
          let obj = {}
          obj['label'] = `v${idx + 1}`
          obj['value'] = url
          return obj
        })
      console.dir(versions)

      return versions
    },
    isNodeSelected() {
      return ![null, ''].includes(this.selectedText)
    },
    nextID({ thoughts }) {
      if (!thoughts || _.isEmpty(thoughts)) return 1

      const findMaxId = (node) => {
        let maxId = node.id || 0
        if (node.children && node.children.length > 0) {
          for (const child of node.children) {
            maxId = Math.max(maxId, findMaxId(child))
          }
        }
        return maxId
      }

      return findMaxId(thoughts) + 1
    },
    strSelectedNode() {
      return this.isNodeSelected ? JSON.stringify(this.selectedNode, null, 2) : '{}'
    },
    strThoughts() {
      return this.isEmptyObject(this.thoughts) ? '{}' : JSON.stringify(this.thoughts, null, 2)
    },
    getFormNode({ editing }) {
      return editing ? this.selectedNode : this.tempNode
    },
  },
  actions: {
    isKeyRequired: (key) => key in this.requiredNodeFields,
    /**
     * Adds a new node to the current selection or updates the selected node.
     * 
     * @param {Object} node - The node object to be added or used to update the selected node.
     * 
     * @description
     * - If `editing` mode is active:
     *   - Ensures the node has children if it is expandable.
     *   - Sets the `parent_id` of the new node to the ID of the currently selected node.
     *   - Initializes the `children` array of the selected node if it doesn't exist.
     *   - Adds the new node to the `children` array of the selected node.
     * - If `editing` mode is not active:
     *   - Synchronizes the properties of the selected node with the new node.
     * 
     * Updates the node by its ID, saves the updated thoughts to local storage, 
     * and displays a notification indicating successful storage.
     */
    addNode(node) {
      if ( this.editing ) {
        node = this.selectedNode
        
        // if node is leaf create child container
        if ( !this.selectedNode.children && this.selectedNode.expandable ) this.selectedNode.children = []

      } else {
        // due diligence for the tempNode
        // create children if expandable
        if ( node.expandable ) node.children = []
        node.parent_id = this.selectedNode.id
        this.selectedNode.children.push( node )
        let success = `adding node ${node.label} to ${this.selectedNode.label}`
        Notify.create( {
          type: 'positive',
          message: success,
        } )
        console.info( success )
      }
      this.updateNodeById(this.selectedNode.id)
      // long term storage
      LocalStorage.setItem('thoughts', this.thoughts)
      Notify.create({
        type: 'positive',
        message: 'Saved to long term storage',
      })
    },
    setSelected(key, node) {
      this.selectedText = key

      if (!_.isNull(key)) {
        this.crumbs = this.getLabelPath([this.thoughts], this.selectedText)
        this.selectedNode = node
      } else {
        this.crumbs = []
        this.selectedNode = key
        this.editing = false
      }
    },
    getLabelPath(tree, targetLabel) {
      const stack = tree.map((node) => ({ node, path: [node.label] }))

      while (stack.length > 0) {
        const { node, path } = stack.pop()

        if (node.label === targetLabel) {
          return path // Return the path when the target is found
        }

        if (node.children && node.children.length > 0) {
          for (const child of node.children) {
            stack.push({ node: child, path: [...path, child.label] })
          }
        }
      }

      return [] // Return an empty array if the target label is not found
    },
    isEmptyObject(obj) {
      return JSON.stringify(obj) === '{}'
    },
    queryData() {
      //query data using jsonpath
      try {
        this.selectedNode.value = jsonPath.query(this.thoughts, this.queryPath)
      } catch (e) {
        this.error = e
        this.selectedNode.value = {}
      }
      return this.selectedNode.value
    },
    async getThoughts ( url, useCache = true ) {
      // check localstorage for data first
      if ( useCache ) {
        let data = LocalStorage.getItem( 'thoughts' )
        if ( data && data !== 'undefined' ) {
          this.thoughts = {}
          this.thoughts = typeof data === 'object' ? data : JSON.parse( data )
          Notify.create( 'Data from cache' )
          return
        }
      }
      // get data from api (default to first item in urls array)
      if ( !url ) url = this.urls[0]
      this.loading = true
      this.currentUrl = url
      try {
        const res = await fetch( url )
        const data = await res.json()
        this.thoughts = data
        Notify.create( `Data loaded from src: ${url} ` )
        LocalStorage.setItem( 'thoughts', this.thoughts )
        Notify.create( `Data saved locally ` )
      } catch ( err ) {
        this.error = err
      }
      this.loading = false
    },
    updateNodeById ( idToUpdate, newData = this.selectedNode, tree = [this.thoughts] ) {
      const findAndUpdateNode = ( nodes ) => {
        for ( const node of nodes ) {
          debugger
          // Check if the current node matches the ID to update
          if ( node.id === idToUpdate ) {
            Object.assign( node, newData ) // Update the node in place
            return true // Node found and updated
          }
          if ( node.children && node.children.length > 0 ) {
            if ( findAndUpdateNode( node.children ) ) {
              return true // Node found in children
            }
          }
        }
        return false // Node not found
      }
      let foundInTree = findAndUpdateNode( tree )
      if ( foundInTree ) {
        // Save updates to LocalStorage
        LocalStorage.setItem( 'thoughts', this.thoughts )

        // Notify the user
        Notify.create( {
          type: 'positive',
          message: 'Node saved to local storage successfully!',
        } )
        console.dir( 'Node updated:', this.selectedNode )
        let response = this.saveToDB()
        console.info(`Saved to DB: ${response}`)
      } else {
        // Notify the user if the node was not found
        Notify.create( {
          type: 'negative',
          message: 'Node not found!',
        } )
      }
    },
    removeNodeById(idToRemove) {
      // Recursive function to traverse and filter the tree
      function traverse(nodes) {
        return _.chain(nodes) // Start a Lodash chain for better readability and performance
          .filter((node) => node.id !== idToRemove) // Filter out the node with the specified ID
          .map((node) => {
            // Check if the node has children
            if (!_.isEmpty(node.children)) {
              // Recursively process the children using the traverse function
              node.children = traverse(node.children)
            }
            return node // Return the updated node
          })
          .value() // End the chain and return the processed array
      }

      this.thoughts = traverse([this.thoughts])[0] // Update the thoughts with the filtered tree
      this.selectedNode = {} // Clear the selected node
      this.selectedText = '' // Clear the selected text
      this.crumbs = [] // Clear the crumbs
      this.dirty = true // Mark the store as dirty

      // Save the updated thoughts to local storage
      LocalStorage.setItem('thoughts', this.thoughts) // Save the updated thoughts to local storage
      // Notify the user about the successful removal
      Notify.create({
        type: 'positive',
        message: 'Node removed successfully',
      })
      console.info(this.thoughts)
    },
    setNodeDefaults(update = false) {
      const _defaults = this.getTreeNodeDefaults
      this.editing = update

      if ( this.editing ) {
        Object.keys( _defaults ).forEach( ( key ) => {
          // if updating...sync selectedNode with defaults
          this.selectedNode[key] = this.selectedNode[key]
            ? this.selectedNode[key]
            : _defaults[key]
        } )

        this.selectedNode.expandable = this.selectedNode.children ? true : false
      } else {
        // if not updating...sync tempNode with defaults
        this.tempNode = {}
        this.tempNode.id = this.nextID
        // Add mode (overwrite values):...sync tempNode with defaults
        Object.keys( _defaults ).forEach( ( key ) => {
          this.tempNode[key] = _defaults[key]
        } )
      }
    },
    async refresh () {
      this.getThoughts()
    },
    async saveToDB ( apiUrl = this.currentUrl ) {
      // Check if the API URL is provided
      try {
        // Notify the user that the save operation has started
        Notify.create( {
          type: 'info',
          message: 'Saving data to the database...',
        } );

        // Perform the POST request to upload the "thoughts" object
        const response = await fetch( apiUrl, {
          method: 'POST', // HTTP method for creating new resources
          headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
          },
          body: JSON.stringify( this.thoughts ), // Convert the "thoughts" object to a JSON string
        } );

        // Check if the response status indicates success (status code 200-299)
        if ( !response.ok ) {
          throw new Error( `Failed to save data. Server responded with status: ${response.status}` );
        }

        // Parse the JSON response from the server
        const result = await response.json();

        // Notify the user of the successful save operation
        Notify.create( {
          type: 'positive',
          message: 'Data saved to the database successfully!',
        } );

        console.info( 'Save result:', result ); // Log the server response for debugging
        return result
      } catch ( error ) {
        // Handle any errors that occur during the fetch operation
        console.error( 'Error saving data to the database:', error );

        // Notify the user of the failure
        Notify.create( {
          type: 'negative',
          message: `${this.currentUrl} Failed to save data: ${error.message}`,
        } );
      }
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThoughtStore, import.meta.hot))
}
