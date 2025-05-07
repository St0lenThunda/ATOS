<template>
  <q-list
  >
  
    <q-item
      v-for=" key in store.getNodeKeys "
      :key="key"
    >

      <template v-if=" fieldType( key ) == 'string' ">
        <q-item-section inset=1>
          <q-input
            class="col-6 text-capitalize"
            v-model="store.selectedNode[key]"
            :label="key"
          />

        </q-item-section>
      </template>
     </q-item>

        <q-item>
        <div q-if="store.nodeHasChildren">
        
          <span class="text-center text-orange text-subtitle1 text-weight-bolder q-pa-md">Children</span>
          <q-tree
            :nodes="store.getNodeChildren"
            node-key="label"
            dense
            accordion
          />
         </div>
        </q-item>
      </q-list>
  
    
</template>

<script setup>
import { useThoughtStore } from 'src/stores/thoughts'
const store = useThoughtStore()
const fieldType = ( key ) => {
  const field = store.selectedNode[key]
  const ft = typeof field
  // console.debug(key, ft, field)
  return ft
}
</script>
