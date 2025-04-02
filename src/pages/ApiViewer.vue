<template class="q-pa-md q-gutter-sm">
  <q-toolbar
    class="bg-secondary text-white shadow-2"
    inset
  >

    <div class="q-pa-md q-gutter-sm">

      Current Data Api Url:
      <div class="text-h6">
        {{ currentUrl }}
      </div>
    </div>
    <q-space />
    <q-select
      filled
      dense
      v-model="currentUrl"
      :options="urls"
      label="Choose a api to view"
    >
      <template v-slot:prepend>
        <q-icon name="travel_explore" />
      </template>
    </q-select>
  </q-toolbar>
  <div class="flex items-center">
    <div v-if=" loading ">Loading...</div>
    <div v-else-if=" error ">{{ error }}</div>
    <pre
      class="q-pa-lg"
      v-else
    >
    {{ thoughts }}
    </pre>
  </div>
  <q-ajax-bar
      ref="bar"
      position="bottom"
      color="secondary"
      size="10px"
    />
</template>
<script setup>
import { useThoughtStore } from 'src/stores/thoughts.js'
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref } from 'vue'
const bar = ref(null)
const thoughtStore = useThoughtStore()
const { error, loading, currentUrl, thoughts, urls } = storeToRefs( thoughtStore )
const refresh = ( url ) => {
  const barRef = bar.value
  barRef.start()
  thoughtStore.getThoughts( url )
  barRef.stop()
}

watch(
  () => thoughtStore.currentUrl,
  ( url ) => refresh( url )
)

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
