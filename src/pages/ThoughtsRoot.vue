<template>

  <q-page
    padding
    class="row justify-center"
  >
    <q-tree
      class="col-6"
      :nodes="srcData"
      node-key="label"
      selected-color="primary"
      v-model:selected="selected"
      @update:selected="onNodeSelect"
      accordion
    />
    <q-card
      class="col-6"
      flat
      bordered
    >
      <q-card-section>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" />
          <q-breadcrumbs-el label="Components" />
          <q-breadcrumbs-el label="Breadcrumbs" />
        </q-breadcrumbs>
      </q-card-section>

      <q-card-actions>


        <q-space />

        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </q-card-actions>

      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section>
            <div>
              <strong>Selected Node :</strong>
              <q-icon
                name="folder"
                v-if=" currentNodeIsFolder "
              ></q-icon>
              <pre id="json-display"></pre>
            </div>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>

  </q-page>

</template>

<script setup>
import { ref, computed } from 'vue'
import data from 'src/data.json'

const crumbs = ref([])
const selectedNode = ref( null )
const selected = ref( 'Food' )
const srcData = ref( data )
const expanded = ref( false )
const currentNodeIsFolder = computed( () => {
  return selectedNode.value !== null && Object.prototype.hasOwnProperty.call( selectedNode.value, 'children' )
} )
const onNodeSelect = ( selected ) => {
  selectedNode.value = searchJSONforValueReturningNode( data[0], selected );
  traverse(selectedNode.value, [])
  let strSelectedNode = JSON.stringify( selectedNode.value, null, 2 )
  document.getElementById( 'json-display' ).textContent = strSelectedNode
  console.log( 'Selected Node:', selectedNode.value );
}
const searchJSONforValueReturningNode = ( obj, value ) => {
  if ( typeof obj !== 'object' || obj === null ) return null;

  for ( let key in obj ) {
    if ( obj[key] === value ) {
      return obj;
    }
    if ( typeof obj[key] === 'object' ) {
      let result = searchJSONforValueReturningNode( obj[key], value );
      if ( result ) return result;
    }
  }
  return null;
}
const traverse = (node, path) { 
    for (let key in node) { 
        let newPath = path.concat(key); 
        if (Object.keys(node[key]).length === 0) { 
            crumbs.value.push(newPath); 
        } else { 
            traverse(node[key], newPath); 
        } 
    } 
} 

</script>
<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
