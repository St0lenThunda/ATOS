<template>
  <div>
    <ul>
      <JsonNode
        v-for=" ( value, key ) in thoughts "
        :key="key"
        :nodeKey="key"
        :nodeValue="value"
      />
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThoughtStore } from 'stores/thoughts'
import JsonNode from './JsonNode.vue';

const store = useThoughtStore()
const { thoughts } = storeToRefs( store )
const refreshData = () => store.getThoughts()
onMounted( () => refreshData() )

</script>
