<template>
  <li>
    <div @click="toggle">
      <q-icon :name="isObject || isArray ? 'folder' : 'eco'" class="q-pa-sm" />
      <span v-if=" isObject ">{{ nodeKey }}: {</span>
        <span v-else-if=" isArray ">{{ nodeKey }}: [</span>
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
    <div v-if=" isObject ">}</div>
    <div v-if=" isArray ">]</div>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps( {
  nodeKey: String,
  nodeValue: [Object, Array, String, Number, Boolean, null]
} );

const isExpanded = ref( false );
const isObject = computed( () => typeof props.nodeValue === 'object' && !Array.isArray( props.nodeValue ) );
const isArray = computed( () => Array.isArray( props.nodeValue ) );

const toggle = () => {
  if ( isObject.value || isArray.value ) {
    isExpanded.value = !isExpanded.value;
  }
};
// const hasChildren = computed( () => {
//   return (props.node?.children && props.node?.children.length > 0) || typeof props.nodeValue ==='object'
// } );

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
