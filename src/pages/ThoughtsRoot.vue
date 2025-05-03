<template >
  <q-toolbar
    q-if="store.hasCrumbs"
    inset

  >


    <q-breadcrumbs
      active-color="grey"
      style="font-size: 16px"
      class="text-body text-primary text-weight-bolder text-uppercase"
      separator=" > "
    >
      <q-breadcrumbs-el
        v-for=" crumb in crumbs "
        :key="crumb"
        :label="crumb"
        class="cursor-pointer"
        @click="pickLeaf( crumb )"
      />
    </q-breadcrumbs>
    <q-space />

  </q-toolbar>
  <q-splitter
    v-model="splitterModel"
    class="q-pa-md"
    style="height: 85vh "
  >
    <template v-slot:before>
      <div class="col-12 col-sm-6 q-gutter-sm">
      <q-tree
        class="q-mx-lg"
        ref="treeRef"
        q-if="thoughts"
        :nodes="[thoughts]"
        node-key="label"
        v-model:selected="selectedText"
        v-model:ticked="ticked"
        v-model:expanded="expandedNodes"
        @update:selected="onNodeSelect"
        @update:ticked="onNodeTick"
        selected-color="secondary"
        tick-strategy="strict"
        accordion
        dense
        dark
      >
        <template v-slot:default-header=" prop ">
          <q-item dense>
            <q-item-section thumbnail>
              <q-icon
                :color="prop.node.iconColor || 'primary'"
                text-color="primary"
                :name="prop.node.icon || 'eco'"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class='text-primary'>
                {{ prop.node.label }}
              </q-item-label>

            </q-item-section>
            <q-item-section
              top
              side
            >
              <q-icon
                v-if="prop.node.isFav"
                name="favorite"
                color='red'
              />
            </q-item-section>
          </q-item>
          <NodeMenu
            v-if="isNodeSelected"
            @ShowEdit="store.editing = !store.editing"
          />
        </template>
      </q-tree>
      </div>
      <div class="col-6 q-gutter-sm">
      <div class="text-h6">Selected</div>
      <div>{{ selected }}</div>

      <q-separator spaced />

      <div class="text-h6">Ticked</div>
      <div>
        <div v-for="tick in ticked" :key="`ticked-${tick}`">
          {{ tick }}
        </div>
      </div>

      <q-separator spaced />

      <div class="text-h6">Expanded</div>
      <div>
        <div v-for="expand in expandedNodes" :key="`expanded-${expand}`">
          {{ expand }}
        </div>
      </div>
    </div>
    </template>
    <template
      v-slot:separator
      v-if="store.editing"
    >
      <q-avatar
        color="primary"
        text-color="white"
        size="40px"
        icon="drag_indicator"
      />
    </template>
    <template
      v-slot:after
      v-if="store.editing"
    >
      <div class="col-6 q-pa-md">

            <q-card
              class="shadow-8"
            >
              <q-card-section>
                <NodeModelEditor update="true"
                headerText="Update" />
                <!-- <NodeForm /> -->
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
                  <QMarkdown >
                    <pre id="json-display"> {{ strSelectedNode }}</pre>
                  </QMarkdown>

                  </q-card-section>
                </div>
              </q-slide-transition>
            </q-card>
      </div>
    </template>
  </q-splitter>
  <q-ajax-bar
    ref="bar"
    position="bottom"
    color="secondary"
    size="10px"
    skip-hijack
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
// import NodeForm from 'src/components/NodeForm.vue'
import { useThoughtStore } from 'src/stores/thoughts'
import { storeToRefs } from 'pinia'
import  NodeModelEditor  from "src/components/NodeModelEditor.vue";
import NodeMenu from 'src/components/NodeMenu.vue'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'


const store = useThoughtStore()
const { crumbs, strSelectedNode, thoughts, selectedText, isNodeSelected } =
  storeToRefs( store )
const bar = ref( null )
const srcData = []
const apiV1 = 'http://localhost:3001/0'
const treeRef = ref( null )
const expanded = ref( true )
const expandedNodes = ref([])
const ticked = ref([])
const splitterModel = ref( 95 )

watch(() => store.editing, (newValue, oldValue) => {
  console.log(`Store Editing state changed from ${oldValue} to ${newValue}`);
  splitterModel.value = store.editing ? 30 : 95
}, { immediate: true });

const pickLeaf = (leaf) => {
  onNodeSelect( leaf)
}
const refresh = async () => {
  const barRef = bar.value
  barRef.start()
  srcData.value = await store.getThoughts(apiV1)
  barRef.stop()
}

const onNodeSelect = (key) => {
  store.setSelected(key, treeRef?.value.getNodeByKey(key))
  const elements = document.querySelectorAll('.q-router-link--active');

  treeRef?.value.setTicked([key], true)
  for (const element of elements) {
    element.classList.add('bg-grey');
  }
  treeRef?.value.setExpanded(key, true)
}

const onNodeTick = (ticked) => {
  if (ticked.length > 1) pruneTicks(ticked)
  if (ticked[0] === null) ticked.splice(0, ticked.length)
}

const pruneTicks = (ticked) => {
  // leave only the last ticked in the queue
  ticked.splice(0, ticked.length -1 )
}
onMounted(() => refresh())
</script>
<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>

<!--
  /*
  <style >
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow-y: auto;
}
.q-dark pre {
  background-color: #1b1313;
  padding: 10px;
  border: 1px solid #100d0d;
  border-radius: 5px;
  color: #f4f4f4;
  overflow-y: auto;
}
  */
</style>
-->
