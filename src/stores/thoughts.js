import { defineStore, acceptHMRUpdate } from 'pinia'
import jsonPath from 'jsonpath'

export const useThoughtStore = defineStore( 'thoughtStore', {
  state: () => ( {
    loading: false,
    error: null,
    thoughts: {},
    currentUrl: '',
    selectedNode: {},
    queryPath: '',
    nextId: 0,
    urls: ['http://localhost:3002/Purchases', 'http://localhost:3000/Purchases', 'http://localhost:3001/0'],
  } ),
  getters: {
    selectedKeys () {
      var keys = []
      if ( this.isNodeSelected ) {
        keys = Object.keys( this.selectedNode?.value?.nodeValue )
        keys = keys.filter( v => !['id', 'text', 'icon', 'children', 'title'].includes( v ) )
      }
      return keys
    },
    currentApiVersion () {
      return this.urls.length
    },
    apiVersionList () {
      // add api endpoint version numbers based on a FIFO array of urls
      // reverse url array to align the indexes and create version array of
      // key/value: key = v[#], value = url
      var versions = this.urls?.slice( 0 ).reverse().map( ( url, idx ) => {
        let obj = {}
        obj['label'] = `v${idx + 1}`
        obj['value'] = url
        return obj
      } )
      console.dir( versions )

      return versions
    },
    isNodeSelected () {
      return ( typeof this.selectedNode.value === 'undefined' ) ? false : JSON.stringify( this.selectedNode.value ) !== '{}'
    },
    lastId () {
      try {
        // get all ids
        var ids = jsonPath.query( this.thoughts, "$..id" );
        // get the max id in the object and increment
        this.nextId = Math.max( ...ids ) + 1
      } catch ( err ) {
        console.log( err )
        this.nextId = err
      }
      return this.nextId
    }
  },
  actions: {
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
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThoughtStore, import.meta.hot))
}
