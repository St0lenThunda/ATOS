<template>

  <q-page
    q-pa-xl
    class="row justify-center"
  >
    <q-tree
      class="col-6 q-pa-md"
      :nodes="srcData"
      node-key="label"
      selected-color="primary"
      v-model:selected="selected"
      @update:selected="onNodeSelect"
      accordion
    />
    <q-card
    class="col-7"
    flat
    bordered
    >
    <q-card-section>
      <node-view class='col-6' v-model:formData="selectedNode"></node-view>
    </q-card-section>
    </q-card>
        <!--<q-banner rounded>
          <div id="breadcrumbs">
          </div>
        </q-banner>
      </q-card-section>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">{{ selectedNode?.description?.title }}</div>
        <div class="text-overline text-orange-9">
          {{ selectedNode?.description?.para.join() }}
        </div>
      </q-card-section>

      <q-card-section class="text-overline">
        Selected Node (details below)
        <q-chip :icon="currentNodeIsFolder ? 'folder' : 'energy_savings_leaf'">
          {{ currentNodeIsFolder ? 'Folder' : 'Leaf' }}
        </q-chip>
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
          <q-chip icon="event">Details</q-chip>
          <q-separator />
          <pre id="json-display"></pre>

        </div>
      </q-slide-transition>
    </q-card> -->

  </q-page>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from 'axios'
import NodeView from 'src/components/NodeForm.vue'

const crumbs = ref( ['Test2', 'Test3'] )
const selectedNode = ref( null )
const selected = ref( 'Food' )
const srcData = ref( [] )
const error = ref( null )
const loading = ref( false )
// const expanded = ref( false )
// const currentNodeIsFolder = computed( () => {
//   return selectedNode.value !== null && Object.prototype.hasOwnProperty.call( selectedNode.value, 'children' )
// } )

const refreshData = ( async () => {
  try {
    const response = await api.get( 'http://localhost:3000/api/data' ); // Use your Axios instance
    srcData.value = response.data;
  } catch ( err ) {
    error.value = 'Error fetching data';
    console.error( err );
  } finally {
    loading.value = false;
  }
} );

const onNodeSelect = ( selected ) => {
  selectedNode.value = searchJSONforValueReturningNode( srcData.value[0], selected );

  // let strSelectedNode = JSON.stringify( selectedNode.value, null, 2 )
  // document.getElementById( 'json-display' ).textContent = strSelectedNode
  console.log( 'Selected Node:', selectedNode.value );
  selectedNode.value = Object.assign( {}, selectedNode.value, { 'trail': getCrumbString() })

}

const getCrumbString = () => {
  // use currently selected label to create crumb trail
  crumbs.value = findLabelWithBreadcrumb( srcData.value[0], selected.value, [] );
  console.log( `Current Crumbs: ${crumbs.value}` );

//   // replace breadcrumb string
//   /document.getElementById( 'breadcrumbs' ).textContent = crumbs.value.join('  /  ')
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

const findLabelWithBreadcrumb = ( obj, targetLabel, breadcrumb = [] ) => {
  // Add current object's label to the breadcrumb trail
  breadcrumb.push( obj.label );

  // Check if the current object's label matches the target
  if ( obj.label === targetLabel ) {
    return breadcrumb;
  }

  // If the object has children, traverse them
  if ( obj.children && Array.isArray( obj.children ) ) {
    for ( let child of obj.children ) {
      const result = findLabelWithBreadcrumb( child, targetLabel, [...breadcrumb] );
      if ( result ) {
        return result; // Return the breadcrumb trail
      }
    }
  }

  // Remove current object's label if no match is found
  breadcrumb.pop();
  return null;
}

onMounted( () => refreshData() )

</script>
<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
