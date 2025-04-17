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
    hasCrumbs () {
      return this.crumbs.length > 0
    },
    crumbTrail ( ) {
      return _.join( this.crumbs, ' > ' )
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
      return ( ![null, ''].includes( this.selectedText ) )   
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
    setSelected ( refTree, key ) {
      this.selectedText = key
      this.crumbs = this.getLabelPath( [this.thoughts], this.selectedText )
      this.selectedNode = refTree.value?.getNodeByKey( key )
      refTree.value?.setExpanded(key, true)
    },
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
    isEmptyObject ( obj ) {
      return JSON.stringify( obj ) === '{}'
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
