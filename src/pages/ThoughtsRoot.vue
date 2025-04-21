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
    <q-toggle
      icon='dark_mode'
      label="Dark Mode"
      v-model="$q.dark.isActive"
    />
  </q-toolbar>
  <q-splitter
    v-model="splitterModel"
    style="height: 85vh "
  >
    <template v-slot:before>
      <q-tree
        ref="treeRef"
        q-if="thoughts"
        :nodes="[thoughts]"
        node-key="label"
        v-model:selected="selectedText"
        @update:selected="onNodeSelect"
        selected-color="purple-4"
                accordion
        dense
      >
        <template v-slot:default-header=" prop ">
          <q-item class='text-primary' dense>
            <q-item-section avatar>
              <q-icon
                color="primary"
                text-color="white"
                :name="prop.node.icon || 'eco'"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
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
            v-model="isNodeSelected"
            @ShowEdit="showEditor = !showEditor"
          />
        </template>
      </q-tree>
    </template>
    <template
      v-slot:separator
      v-if="showEditor && isNodeSelected"
    >
      <q-avatar
        color="primary"
        text-color="white"
        size="40px"
        icon="drag_indicator"
        v-if="showEditor && isNodeSelected"
      />
    </template>
    <template
      v-slot:after
      v-if="isNodeSelected"
    >
      <div class="col-6 q-pa-md">
       <!-- <q-list dense>
           <q-expansion-item
            expand-separator
            :icon="selectedNode.icon || 'help'"
            :label="selectedNode.label"
            :caption="selectedNode.text"
            expand-icon="edit"
            expanded-icon="close"
          > -->
            <q-card
              class="shadow-8"
              
            >
              <q-card-section>
                <NodeModelEditor dark>
                  <template #header>
                    Update Node
                  </template>
                </NodeModelEditor>
                <NodeForm />
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
import { ref, onMounted } from 'vue'
import NodeForm from 'src/components/NodeForm.vue'
import { useThoughtStore } from 'src/stores/thoughts'
import { storeToRefs } from 'pinia'
import  NodeModelEditor  from "src/components/NodeModelEditor.vue";
import NodeMenu from 'src/components/NodeMenu.vue'

const store = useThoughtStore()
const { crumbs, strSelectedNode, thoughts, selectedText, isNodeSelected } =
  storeToRefs( store )
const bar = ref( null )
const srcData = []
const apiV1 = 'http://localhost:3001/0'
const treeRef = ref( null )
const expanded = ref( true )
const splitterModel = ref( 95 )
const showEditor = ref(false)
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

  splitterModel.value = key ? 30 : 95
}

onMounted(() => refresh())
</script>

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
</style>
