import { defineStore, acceptHMRUpdate } from 'pinia'
import jsonPath from 'jsonpath'
import _ from "lodash";

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
    urls: ['http://localhost:3002/Purchases', 'http://localhost:3000/Purchases', 'http://localhost:3001/0', 'https://jsonplaceholder.typicode.com/todos'],
  } ),
  getters: {
    crumbTrail () { return _.join( this.crumbs, ' / ' ) },//this.crumbs.join( ' / ' ) || '' },

    selectedKeys ( { isNodeSelected, selectedNode } ) {
      var keys = []
      if ( isNodeSelected ) {
        keys = Object.keys( selectedNode?.value?.nodeValue )
        keys = keys.filter( v => !['id', 'text', 'icon', 'children', 'title'].includes( v ) )
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
      var versions = urls?.slice( 0 ).reverse().map( ( url, idx ) => {
        let obj = {}
        obj['label'] = `v${idx + 1}`
        obj['value'] = url
        return obj
      } )
      console.dir( versions )

      return versions
    },
    isNodeSelected () {
      return ( this.selectedNode !== null && !this.isEmptyObject( this.selectedNode ) ) 
    },

    lastId ( { thoughts, nextId } ) {
      try {
        // get all ids
        var ids = jsonPath.query( thoughts, "$..id" );
        // get the max id in the object and increment
        nextId = Math.max( ...ids ) + 1
      } catch ( err ) {
        console.log( err )
        nextId = err
      }
      return nextId
    },
    strSelectedNode () {
      return ( this.isNodeSelected ) ? JSON.stringify( this.selectedNode, null, 2 ) : '{}'
    }
  },
  actions: {
    findBreadcrumbPath ( obj = this.selectedNode, targetId, path = [] ) {
      debugger
      if ( !this.selectedNode ) return null        
    
      for ( const key in obj ) {
        if ( typeof obj[key] === 'object' && obj[key] !== null ) {
          // If it's a matching node
          if ( obj[key].id === targetId ) {
            return [...path, key]; // Return the path including this node
          }
          // Search recursively
          const result = this.findBreadcrumbPath( obj[key], targetId, [...path, key] );
          if ( result ) return result;
        }
      }
      return null; // Node not found
    },
    buildTrailFromSelected ( obj, targetLabel, trail = [] ) {
      debugger
      // Add current object's label to the trail trail
      trail.push( obj?.label || targetLabel )

      // Check if the current object's label matches the target
      if ( obj.label === targetLabel || Object.keys( obj ).includes( targetLabel ) ) {
        return trail
      }

      // If the object has children, traverse them
      if ( obj.children && Array.isArray( obj.children ) ) {
        for ( let child of obj.children ) {
          const result = this.buildTrailFromSelected( child, targetLabel, [...trail] )
          if ( result ) {
            return result // Return the trail trail
          }
        }
      }

      // Remove current object's label if no match is found
      trail.pop()
      return trail
    },
    isEmptyObject ( obj ) {
      return JSON.stringify( obj ) === '{}';
    },
    getCurrentNode ( obj ) {
      // if no node sent find node by selected text in tree
      if ( !obj?.nodeValue ) {
        this.setSelectedNode( this.selectedText )
      }
      // set state of selectedText and node if available
      if ( obj.nodeKey && obj.nodeKey != this.selectedText ) {
        this.selectedText = obj.nodeKey
      }
      if ( obj.nodeValue ) this.selectedNode = obj.nodeValue
      this.setCrumbString( this.selectedNode?.id )
    },
    queryData (  ) {
      //query data using jsonpath
      try {
        this.selectedNode.value = jsonPath.query( this.thoughts, this.queryPath );

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
      this.crumbs = this.findBreadcrumbPath( this.thoughts, selected, [] )
      console.log( `Current Crumbs: ${this.crumbs}` )
    },
    setSelectedNode () {
      if ( this.selectedText ) this.selectedNode = this.getNodeFromLabel( this.thoughts, this.selectedText )
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
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThoughtStore, import.meta.hot))
}
