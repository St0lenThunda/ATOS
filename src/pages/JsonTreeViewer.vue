<template>
  <div id="app">
    <JsonTree />
  </div>
</template>

<script setup>
import JsonTree from 'src/components/JsonTree.vue'

</script>



<!-- <script setup>
import { storeToRefs } from 'pinia'
import { useThoughtStore } from 'stores/thoughts'

const store = useThoughtStore()
const { thoughts, error, loading, url } = storeToRefs(store)
</script> -->
<style scoped>
pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  overflow: auto;
}
</style>
