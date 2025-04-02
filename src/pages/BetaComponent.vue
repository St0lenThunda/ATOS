<template>
  <div><h2>DATA API</h2></div>
  <div class="flex items-center">
    <h6>
      <small
        ><em>(url: {{ url }})</em></small
      >
    </h6>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <pre class="q-pa-lg" v-else>
    {{ thoughts }}
    </pre>
  </div>
</template>
<script setup>
import { useThoughtStore } from 'src/stores/thoughts.js'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
const thoughtStore = useThoughtStore()

const { error, loading, url, thoughts } = storeToRefs(thoughtStore)
onMounted(() => thoughtStore.getThoughts())
</script>
<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
