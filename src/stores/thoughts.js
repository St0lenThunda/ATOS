import { defineStore, acceptHMRUpdate } from 'pinia'
import jsonPath from 'jsonpath'
import _ from 'lodash'

export const useThoughtStore = defineStore( 'thoughtStore', {
  state: () => ( {
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
      'http://localhost:3000/Purchases',
      'https://jsonplaceholder.typicode.com/todos',
    ],
  } ),
  getters: {
    crumbTrail ( { selectedNode, selectedText, crumbs } ) {
      if ( selectedNode && selectedText ) {
        crumbs = this.getLabelPath([this.thoughts],this.selectedText)
      }
      return _.join( crumbs, ' > ' )
    },
    selectedKeys ( { isNodeSelected, selectedNode } ) {
      var keys = []
      if ( isNodeSelected ) {
        keys = Object.keys( selectedNode?.value?.nodeValue )
        keys = keys.filter( ( v ) => !['id', 'text', 'icon', 'children', 'title'].includes( v ) )
      }
      return keys
    },
    currentApiVersion ( { urls } ) {
      return urls.length
    },
    apiVersionList ( { urls } ) {
      // add api endpoint version numbers based on a FIFO array of urls
      // reverse url array to align the indexes and create version array of
      // key/value: key = v[#], value = url
      var versions = urls
        ?.slice( 0 )
        .reverse()
        .map( ( url, idx ) => {
          let obj = {}
          obj['label'] = `v${idx + 1}`
          obj['value'] = url
          return obj
        } )
      console.dir( versions )

      return versions
    },
    isNodeSelected () {
      return ( ![null, ''].includes( this.selectedText ) )     // return this.selectedNode !== null && !this.isEmptyObject( this.selectedNode )
    },

    lastId ( { thoughts, nextId } ) {
      try {
        // get all ids
        var ids = jsonPath.query( thoughts, '$..id' )
        // get the max id in the object and increment
        nextId = Math.max( ...ids ) + 1
      } catch ( err ) {
        console.log( err )
        nextId = err
      }
      return nextId
    },
    strSelectedNode () {
      return this.isNodeSelected ? JSON.stringify( this.selectedNode, null, 2 ) : '{}'
    },
  },
  actions: {
    getLabelPath ( tree, targetLabel ) {
      let result = []

      function traverse ( nodes, path ) {
        return _.some( nodes, node => {
          const newPath = [...path, node.label]
          if ( node.label === targetLabel ) {
            result = newPath
            return true
          }
          return node.children && traverse( node.children, newPath )
        } )
      }

      traverse( tree, [] )
      return result
    },
    getBreadcrumbTrail ( tree = [this.thoughts], targetLabel = this.selectedText ) {
      let trail = [];

      const found = _.transform( tree, ( result, node ) => {
        if ( result.found ) return; // Stop if found

        // if ( node === targetLabel ) node = tree
        // Add current node to trail
        trail.push( node.label );

        // Check if this node is the target
        if ( node.label === targetLabel ) {
          result.found = true;
          return;
        }

        // Recurse into children
        if ( _.isArray( node.children ) ) {
          const subTrail = this.getBreadcrumbTrail( node.children, targetLabel );
          if ( !_.isEmpty( subTrail ) ) {
            trail = [...trail.slice( 0, trail.length - 1 ), ...subTrail];
            result.found = true;
          }
        }

        // Not found here, backtrack
        if ( !result.found ) trail.pop();
      }, { found: false } );

      return found.found ? trail : [];
    },
    getBreadcrumbPath ( tree = this.thoughts, targetLabel = this.selectedText, path = [] ) {
      if ( !tree || !targetLabel ) return
      for ( let node in tree ) {
        if ( node == 'label' ) node = tree
        const newPath = [...path, node.label]

        if ( node.label === targetLabel ) {
          return newPath
        }

        if ( _.has( node, 'children' ) ) {
          const result = this.getBreadcrumbPath( node.children, targetLabel, newPath )
          if ( result ) return result
        }
      }
    },
    findBreadcrumbPath ( obj = this.selectedNode, targetId, path = [] ) {
      debugger
      if ( !this.selectedNode ) return null

      for ( const key in obj ) {
        if ( typeof obj[key] === 'object' && obj[key] !== null ) {
          // If it's a matching node
          if ( obj[key].id === targetId ) {
            return [...path, key] // Return the path including this node
          }
          // Search recursively
          const result = this.findBreadcrumbPath( obj[key], targetId, [...path, key] )
          if ( result ) return result
        }
      }
      return null // Node not found
    },
    isEmptyObject ( obj ) {
      return JSON.stringify( obj ) === '{}'
    },
    getCurrentNode ( obj ) {
      // if no node sent find node by selected text in tree
      if ( !obj?.nodeValue ) {
        this.setSelectedNode( this.selectedText )
      }
      // set state of selectedText and node if available
      if ( obj?.nodeKey && obj?.nodeKey != this.selectedText ) {
        this.selectedText = obj.nodeKey
      }
      if ( obj?.nodeValue ) this.selectedNode = obj.nodeValue
    },
    queryData () {
      //query data using jsonpath
      try {
        this.selectedNode.value = jsonPath.query( this.thoughts, this.queryPath )
      } catch ( e ) {
        this.error = e
        this.selectedNode.value = {}
      }
      return this.selectedNode.value
    },
    async getThoughts ( url ) {
      // get data from api (default to first item in urls array)
      if ( !url ) url = this.urls[0]
      this.loading = true
      this.currentUrl = url
      try {
        const res = await fetch(url)
        const data = await res.json()
        this.thoughts = data
      } catch (err) {
        this.error = err
      }
      this.loading = false
    },
    setCrumbString ( selected ) {
      // use currently selected label to create crumb trail
      this.crumbs = this.getBreadcrumbPath( this.thoughts, selected, [] )
      console.log( `Current Crumbs: ${this.crumbs}` )
    },
    setSelectedNode () {
      if ( this.selectedText )
        this.selectedNode = this.getNodeFromLabel( this.thoughts, this.selectedText )
    },
    getNodeFromLabel ( obj, value ) {
      if ( typeof obj !== 'object' || obj === null ) return null
      for ( let key in obj ) {
        if ( obj[key] === value ) {
          return obj
        }
        if ( typeof obj[key] === 'object' ) {
          let result = this.getNodeFromLabel( obj[key], value )
          if ( result ) return result
        }
      }
      return null
    },
    updateNodeById ( idToUpdate = this.selectedNode?.id, tree = this.thoughts, newData = this.selectedNode ) {
      for ( const node of tree ) {
        if ( node.id === idToUpdate ) {
          Object.assign( node, newData )
          this.dirty = true
          return true// updated
        }

        if ( node.children ) {
          const updated = this.updateNodeById( node.children, idToUpdate, newData )
          if ( updated ) {
            this.dirty = true
            return true
          }
        }
      }

      return this.dirty // not found
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThoughtStore, import.meta.hot))
}
