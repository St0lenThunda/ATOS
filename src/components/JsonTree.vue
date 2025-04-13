<template>


  <q-splitter
    v-model="splitterModel"
    style="height: 80vh"
  >
    <template v-slot:before>
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
    </template>
    <template v-slot:separator>
      <q-avatar
        color="primary"
        text-color="white"
        size="40px"
        icon="drag_indicator"
      />
    </template>
    <template v-slot:after>
      <q-card v-show="isNodeSelected">
        <q-card-actions class="row items-center q-pb-none">
          <!-- <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          /> -->
        </q-card-actions>
        <q-card-section>
          <q-list bordered>
           <TreeDetail :formData="selectedNode"/>
          </q-list>
          <!-- {{ store.crumbTrail }}
        </q-card-section>
        <q-card-section class="text-h3">
          {{ store.selectedText }}
        </q-card-section>
        <q-card-section>
          <pre>{{ store.selectedNode }}</pre>-->
        </q-card-section> 
      </q-card>
    </template>
  </q-splitter>


 
</template>

<script setup>
import JsonNode from './JsonNode.vue';
import TreeDetail from './TreeDetail.vue';
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useThoughtStore } from 'stores/thoughts'

const splitterModel = ref( 50 )
const store = useThoughtStore()
const { thoughts, isNodeSelected, selectedNode } = storeToRefs( store )
const refreshData = () => store.getThoughts()
onMounted( () => refreshData() )

</script>
