import { defineStore, acceptHMRUpdate } from 'pinia'

export const useThoughtStore = defineStore('thoughtStore', {
  state: () => ({
    loading: false,
    error: null,
    thoughts: {},
    url: 'http://localhost:3000/Purchases',
  }),
  getters: {},
  actions: {
    async getThoughts() {
      this.loading = true
      try {
        const res = await fetch(this.url)
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
