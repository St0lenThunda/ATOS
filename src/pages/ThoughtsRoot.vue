<template>
  <q-page class="q-pa-xl row">
    <q-page-sticky
      position="bottom-left"
      :offset="[18, 18]"
    >
      <q-fab
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
      >
        <q-fab-action
          color="secondary"
          icon="restart_alt"
          label="Refresh Api"
          @click="refresh"
        />
        <q-fab-action
          :label="store.currentUrl"
          color="primary"
          flat
          icon="link"
        />

      </q-fab>
    </q-page-sticky>

    <q-tree
      q-if="store.thoughts"
      class="col-6 q-pa-md"
      :nodes="[store.thoughts]"
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
      v-if=" selectedNode "
    >
      <q-card-section>
        <div id="breadcrumbs"></div>

        <node-view
          class="col-6"
          :formData="selectedNode"
        ></node-view>

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
          <q-card-section class="text-subtitle2">
            <pre id="json-display"></pre>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="secondary"
      size="10px"
      skip-hijack
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NodeView from 'src/components/NodeForm.vue'
import { useThoughtStore } from 'src/stores/thoughts'
const store = useThoughtStore()
const bar = ref( null )
const crumbs = ref( [] )
const selectedNode = ref( {} )
const selected = ref( '' )
const srcData = []
const apiV1 = 'http://localhost:3001/0'
let expanded = true
const refresh = async () => {
  const barRef = bar.value
  barRef.start()
  srcData.value = await store.getThoughts( apiV1 )
  barRef.stop()
}

store.$subscribe( ( mutation, state ) => {
  console.log( mutation, state )
} )

const onNodeSelect = ( selected ) => {
  selectedNode.value = searchJSONforValueReturningNode( store.thoughts, selected )

  let strSelectedNode = JSON.stringify( selectedNode.value, null, 2 )
  document.getElementById( 'json-display' ).textContent = strSelectedNode
  console.log( 'Selected Node:', selectedNode.value )
  selectedNode.value = Object.assign( {}, selectedNode.value, { trail: getCrumbString() } )
}

const getCrumbString = () => {
  // use currently selected label to create crumb trail
  crumbs.value = findLabelWithBreadcrumb( store.thoughts, selected.value, [] )
  console.log( `Current Crumbs: ${crumbs.value}` )

  // replace breadcrumb string
  document.getElementById( 'breadcrumbs' ).textContent = crumbs.value.join( '  /  ' )
}

const searchJSONforValueReturningNode = ( obj, value ) => {
  if ( typeof obj !== 'object' || obj === null ) return null
  for ( let key in obj ) {
    if ( obj[key] === value ) {
      return obj
    }
    if ( typeof obj[key] === 'object' ) {
      let result = searchJSONforValueReturningNode( obj[key], value )
      if ( result ) return result
    }
  }
  return null
}

const findLabelWithBreadcrumb = ( obj, targetLabel, breadcrumb = [] ) => {
  // Add current object's label to the breadcrumb trail
  breadcrumb.push( obj.label )

  // Check if the current object's label matches the target
  if ( obj.label === targetLabel ) {
    return breadcrumb
  }

  // If the object has children, traverse them
  if ( obj.children && Array.isArray( obj.children ) ) {
    for ( let child of obj.children ) {
      const result = findLabelWithBreadcrumb( child, targetLabel, [...breadcrumb] )
      if ( result ) {
        return result // Return the breadcrumb trail
      }
    }
  }

  // Remove current object's label if no match is found
  breadcrumb.pop()
  return null
}

onMounted( () => refresh() )
</script>


<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
