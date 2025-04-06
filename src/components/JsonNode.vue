<template class="row">
  <li class="col-6">

    <div @click="toggle( props )">
      <q-icon
        size="sm"
        :name="isExpanded ? 'arrow_drop_down' : 'arrow_right'"
        v-if=" isObject || isArray "
      />
      <q-icon
        :name="isObject || isArray ? 'folder' : 'eco'"
        :color="isObject || isArray ? 'secondary' : 'accent'"
        size='xs'
        class="q-pa-xs"
      />
      <span v-if=" isObject ">{{ nodeKey }}: </span>
      <span v-else-if=" isArray ">{{ nodeKey }}: </span>
      <span v-else>{{ nodeKey }}: {{ nodeValue }}</span>
    </div>
    <ul v-if=" isExpanded ">
      <template v-if=" isObject || isArray ">
        <JsonNode
          v-for=" ( value, key ) in nodeValue "
          :key="key"
          :nodeKey="key"
          :nodeValue="value"
        />
      </template>
    </ul>
  </li>

</template>

<script setup>
import { ref, computed } from 'vue';

import { useThoughtStore } from 'stores/thoughts'

const store = useThoughtStore()

const props = defineProps( {
  nodeKey: String,
  nodeValue: [Object, Array, String, Number, Boolean, null]
} );

const isExpanded = ref( false );
const isObject = computed( () => typeof props.nodeValue === 'object' && !Array.isArray( props.nodeValue ) );
const isArray = computed( () => Array.isArray( props.nodeValue ) );

const toggle = ( current ) => {
  if ( isObject.value || isArray.value ) {
    isExpanded.value = !isExpanded.value;
    current = ( !isExpanded.value ) ? {} : current
  }
  store.selectedNode.value = current
};

</script>

<style scoped>
li {
  list-style-type: none;
  cursor: pointer;
}
</style>


<style scoped>
ul {
  list-style-type: none;
  padding-left: 20px;
}

.icon-open::before {
  content: '▼';
}

.icon-closed::before {
  content: '▶';
}

.icon-node::before {
  content: '📁';
}
</style>
