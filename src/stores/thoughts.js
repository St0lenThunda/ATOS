import { defineStore, acceptHMRUpdate } from 'pinia'
import jsonPath from 'jsonpath'
import { LocalStorage, Notify } from 'quasar'
import _ from 'lodash'

export const useThoughtStore = defineStore('thoughtStore', {
  state: () => ({
    loading: false,
    error: null,
    thoughts: {},
    currentUrl: '',
    selectedNode: {},
    selectedText: '',
    crumbs: [],
    queryPath: '',
    nextId: 0,
    dirty: false,
    urls: [
      'http://localhost:3001/0',
      'http://localhost:3002/Purchases',
      'http://localhost:3000/icons',
      'http://localhost:3000/sets',
      'http://localhost:3000/groups',
      'https://jsonplaceholder.typicode.com/todos',
    ],
  }),
  getters: {
    hasCrumbs() {
      return this.crumbs.length > 0
    },
    crumbTrail() {
      return _.join(this.crumbs, ' > ')
    },
    nodeHasChildren ( { selectedNode } ) {
      return !_.isEmpty( selectedNode.children )
    },
    selectedKeys({ isNodeSelected, selectedNode }) {
      var keys = []
      if (isNodeSelected) {
        keys = Object.keys(selectedNode?.value?.nodeValue)
        keys = keys.filter((v) => !['id', 'text', 'icon', 'children', 'title'].includes(v))
      }
      return keys
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
    nextID ( { thoughts } ) {
      if ( !thoughts ) return 1;
      const ids = jsonPath.query( thoughts, '$..id' );
      return ids.length ? Math.max( ...ids ) + 1 : 1;
    },
    strSelectedNode() {
      return this.isNodeSelected ? JSON.stringify(this.selectedNode, null, 2) : '{}'
    },
    strThoughts () {  
      return this.isEmptyObject(this.thoughts) ? '{}' : JSON.stringify(this.thoughts, null, 2)
    }
  },
  actions: {
    addNode ( node ) {
      // create children if expandable
      if (node.expandable) node.children = []

      // if node is leaf create child container
      if ( !this.selectedNode.children ) this.selectedNode.children = []

      // add id to new node data
      node = Object.assign({id: this.nextID}, node)
      debugger
      // short term storage
     this.selectedNode.children.push(node)
      debugger
      this.updateNodeById(this.selectedNode.id)


      // long term storage
      LocalStorage.setItem( 'thoughts', this.thoughts )
      Notify.create({
        type: 'positive',
        message: 'Saved to long term storage',
      })
    },
    setSelected(refTree, key) {
      this.selectedText = key

      if (!_.isNull(key)) {
        this.crumbs = this.getLabelPath([this.thoughts], this.selectedText)
        this.selectedNode = refTree.value?.getNodeByKey(key)
        refTree.value?.setExpanded(key, true)
      } else {
        this.crumbs = []
        this.selectedNode = key
      }
    },
    getLabelPath(tree, targetLabel) {
      let result = []

      function traverse(nodes, path) {
        return _.some(nodes, (node) => {
          const newPath = [...path, node.label]
          if (node.label === targetLabel) {
            result = newPath
            return true
          }
          return node.children && traverse(node.children, newPath)
        })
      }

      traverse(tree, [])
      return result
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
    async getThoughts(url) {
      // check localstorage for data first
      let data = LocalStorage.getItem('thoughts')
      if ( data ) {
        this.thoughts.value = ( typeof data === 'object' ) ? data : JSON.parse( data )
        Notify.create('Data from cache')
      } else {
        // get data from api (default to first item in urls array)
        if (!url) url = this.urls[0]
        this.loading = true
        this.currentUrl = url
        try {
          const res = await fetch(url)
          const data = await res.json()
          this.thoughts = data
          Notify.create(`Data loaded from src: ${url} `)
        } catch (err) {
          this.error = err
        }

      }
      this.loading = false
    },
    updateNodeById(
      idToUpdate = this.selectedNode?.id,
      newData = this.selectedNode,
      tree = [this.thoughts],
    ) {
      
     
      for (const node of tree) {
        if ( node.id === idToUpdate ) {
          
          // create a new object with the updated data
          // and assign it to the node overwriting the id if one exists
          node.value = Object.assign( node, newData )
          this.selectedNode = node
          this.dirty = true
          Notify.create({
            type: 'positive',
            message: 'Node updated successfully',
          } )
          // Save the updated thoughts to local storage
          LocalStorage.setItem( 'thoughts', this.thoughts )   

          return true // updated
        }

        if (node.children) {
          const updated = this.updateNodeById(idToUpdate, node.children, newData)
          if (updated) {
            this.dirty = true
            return true
          }
        }
      }

      return this.dirty // not found
    },
    removeNodeById ( idToRemove ) {
      // Recursive function to traverse and filter the tree
      function traverse ( nodes ) {
        return _.chain( nodes ) // Start a Lodash chain for better readability and performance
          .filter( node => node.id !== idToRemove ) // Filter out the node with the specified ID
          .map( node => {
            // Check if the node has children
            if ( !_.isEmpty( node.children ) ) {
              // Recursively process the children using the traverse function
              node.children = traverse( node.children );
            }
            return node; // Return the updated node
          } )
          .value(); // End the chain and return the processed array
      }

      this.thoughts = traverse( [this.thoughts] ) // Update the thoughts with the filtered tree
      this.selectedNode = {} // Clear the selected node
      this.selectedText = '' // Clear the selected text
      this.crumbs = [] // Clear the crumbs
      this.dirty = true // Mark the store as dirty
      

      // Save the updated thoughts to local storage
      LocalStorage.setItem( 'thoughts', this.thoughts ) // Save the updated thoughts to local storage
      // Notify the user about the successful removal
      Notify.create({
        type: 'positive',
        message: 'Node removed successfully',
      })
      console.log( this.thoughts )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThoughtStore, import.meta.hot))
}
