<template>

  <q-page
    padding
    class="row justify-center"
  >
    <q-tree
      class="col-6"
      :nodes="simple"
      node-key="label"
      selected-color="primary"
      v-model:selected="selected"
      @update:selected="onNodeSelect"
      accordion
    />
    <q-card class="col-6">
      <q-card-section>{{ selected }}</q-card-section>
      <q-card-section>
        <div v-if=" selectedNode ">
          <h3>Selected Node:</h3>
          <div id="json-display"></div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>

</template>

<script setup>
import { ref } from 'vue'
import data from 'src/data.json'

const selectedNode = ref( null )
const selected = ref( 'Food' )
const simple = ref( data )
const onNodeSelect = ( selected ) => {
  debugger
  selectedNode.value = searchJSON( data[0], selected );
  let strSelectedNode =JSON.stringify( selectedNode.value,null, 2 )
  document.getElementById( 'json-display' ).textContent = strSelectedNode
  console.log( 'Selected Node:', selectedNode.value );
}
const searchJSON = ( obj, value ) => {
  if ( typeof obj !== 'object' || obj === null ) return null;

  for ( let key in obj ) {
    if ( obj[key] === value ) {
      return obj;
    }
    if ( typeof obj[key] === 'object' ) {
      let result = searchJSON( obj[key], value );
      if ( result ) return result;
    }
  }
  return null;
}
</script>
<!-- <style scoped>
p {
  background-color: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style> -->
