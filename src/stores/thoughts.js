import { defineStore, acceptHMRUpdate } from 'pinia'

export const useThoughtStore = defineStore('thoughtStore', {
  state: () => ({
    loading: false,
    error: null,
    thoughts: {},
    currentUrl: '',
    urls: ['http://localhost:3000/Purchases', 'http://localhost:3001/0'],
  }),
  getters: {},
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
