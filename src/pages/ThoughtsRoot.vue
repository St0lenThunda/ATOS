<template>
  <q-toolbar q-if="store.hasCrumbs" inset>
    <q-breadcrumbs
      active-color="grey"
      style="font-size: 16px"
      class="text-body text-primary text-weight-bolder text-uppercase"
      separator=" > "
    >
      <q-breadcrumbs-el
        v-for="crumb in crumbs"
        :key="crumb"
        :label="crumb"
        class="cursor-pointer"
        @click="pickLeaf(crumb)"
      />
    </q-breadcrumbs>
  </q-toolbar>
  <div class="q-pa-xl row">
    <q-tree
      ref="treeRef"
      q-if="thoughts"
      class="col-4 q-pa-md"
      :nodes="[thoughts]"
      node-key="label"
      selected-color="primary"
      v-model:selected="selectedText"
      @update:selected="onNodeSelect"
      accordion
    />
    <div class="col-8" v-show="isNodeSelected">
      <q-list dense>
        <q-expansion-item
          expand-separator
          :icon="selectedNode.icon || 'help'"
          :label="selectedNode.label"
          :caption="selectedNode.text"
          expand-icon="edit"
          expanded-icon="close"
        >
          <q-card class="shadow-8" bordered>
            <q-card-section class="column">
              <node-form :formData="selectedNode"></node-form>
            </q-card-section>
            <q-card-actions>
              <q-space />

              <q-btn
                color="grey"
                round
                flat
                dense
                :label="expanded ? 'Hide JSON' : 'Show JSON'"
                :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                @click="expanded = !expanded"
              />
            </q-card-actions>
            <q-slide-transition>
              <div v-show="expanded">
                <q-separator />
                <q-card-section class="text-subtitle2">
                  <pre id="json-display"> {{ strSelectedNode }}</pre>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>

    <q-ajax-bar ref="bar" position="bottom" color="secondary" size="10px" skip-hijack />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NodeForm from 'src/components/NodeForm.vue'
import { useThoughtStore } from 'src/stores/thoughts'
import { storeToRefs } from 'pinia'

const store = useThoughtStore()
const { crumbs, selectedNode, strSelectedNode, thoughts, selectedText, isNodeSelected } =
  storeToRefs(store)
const bar = ref(null)
const srcData = []
const apiV1 = 'http://localhost:3001/0'
const treeRef = ref(null)
const expanded = ref(false)

const pickLeaf = (leaf) => {
  treeRef.value?.collapseAll()
  store.setSelected(treeRef, leaf)
}
const refresh = async () => {
  const barRef = bar.value
  barRef.start()
  srcData.value = await store.getThoughts(apiV1)
  barRef.stop()
}

const onNodeSelect = (key) => {
  store.setSelected(treeRef, key)
}

onMounted(() => refresh())
</script>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
