<template>
  <q-page-sticky
    position="bottom-left"
    :offset="[8,58]"
    expand
  >

    <q-fab
      color="primary"
      icon="add"
      direction="down"
      v-show="isNodeSelected"
    >
      <q-fab-action
        round
        glossy
        class="q-ma-md"
        icon="data_object"
        color="secondary"
        @click="dialog = true"
      />
    </q-fab>
  </q-page-sticky>
  <!-- <q-btn
    round
    glossy
    class="q-ma-md"
    v-show="!isEmpty(selectedNode)"
    icon="data_object"
    color="secondary"
    @click="dialog = true"
  /> -->
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
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-actions class="row items-center q-pb-none">
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-actions>
      <q-card-section class="text-h3">
        {{ selectedNode?.value?.nodeKey }}
      </q-card-section>
      <q-card-section>
        <pre>{{ selectedNode?.value?.nodeValue }}</pre>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import JsonNode from './JsonNode.vue';
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useThoughtStore } from 'stores/thoughts'


const dialog = ref( false )
const store = useThoughtStore()
const { thoughts, selectedNode, isNodeSelected } = storeToRefs( store )
const refreshData = () => store.getThoughts()
onMounted( () => refreshData() )

</script>
