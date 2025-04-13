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
      q-if="thoughts"
      class="col-4 q-pa-md"
      :nodes="[thoughts]"
      node-key="label"
      selected-color="primary"
      v-model:selected="selectedText"
      @update:selected="onNodeSelect"
      accordion
    />

    <q-card
      class="col-8"
      flat
      bordered
      v-if=" selectedNode "
    >
      <q-card-section>
        <div id="breadcrumbs">{{ crumbTrail }}</div>

        <node-form
          class="col-6"
          :formData="selectedNode"
        ></node-form>

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
            <pre id="json-display"> {{  strSelectedNode }}</pre>
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
import NodeForm from 'src/components/NodeForm.vue'
import { useThoughtStore } from 'src/stores/thoughts'
import { storeToRefs } from 'pinia'
const store = useThoughtStore()
const {
  crumbTrail,
  selectedNode,
  strSelectedNode,
  thoughts,
  selectedText
} = storeToRefs( store )
const bar = ref( null )
const srcData = []
const apiV1 = 'http://localhost:3001/0'
const currentNode = ref({})
let expanded = true
const refresh = async () => {
  const barRef = bar.value
  barRef.start()
  srcData.value = await store.getThoughts( apiV1 )
  barRef.stop()
}

const onNodeSelect = () => {
  currentNode.value = store.getCurrentNode()
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
