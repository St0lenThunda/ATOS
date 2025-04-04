import { defineStore, acceptHMRUpdate } from 'pinia'
import jsonPath from 'jsonpath'

export const useThoughtStore = defineStore('thoughtStore', {
  state: () => ({
    loading: false,
    error: null,
    thoughts: {},
    currentUrl: '',
    nextId: 0,
    urls: ['http://localhost:3000/Purchases', 'http://localhost:3001/0'],
  }),
  getters: {
    lastId () {
      try {
        // get all ids
        var ids = jsonPath.query( this.thoughts, "$..id" );

        this.nextId = Math.max(...ids) + 1
      } catch ( err ) {
        console.log( err )
        this.nextId = err
      }
    }
  },
  actions: {
    // get data from api (default to first item in urls array)
    async getThoughts ( url ) {
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
