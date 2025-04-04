<template class="q-pa-md q-gutter-sm">
  <q-toolbar
    class="bg-secondary text-white shadow-2"
    inset
  >
    <q-select
      filled
      stack-label
      dense
      options-dense
      emit-value
      map-options
      v-model="currentUrl"
      :options="getVersionList"
      label="Choose a api to view"
      style="min-width: 250px; max-width: 300px"
    >
      <!-- <template v-slot:prepend>
        <q-icon name="travel_explore" />
      </template> -->
      <template v-slot:option=" scope ">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-icon name="link" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
            <q-item-label caption>{{ scope.opt.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>Current Data Api:</q-item-label>
          <q-item-label caption>
            <a
              class="text-overline"
              :href="currentUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ currentUrl }}</a>
          </q-item-label>
        </q-item-section>

        <q-item-section
          side
          top
        >
          <div class="text-primary text-caption q-pl-xl">
            Latest: <q-badge color="accent">v{{ apiVersion }}.0.0+</q-badge>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-space />

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
import { onMounted, watch, ref, computed } from 'vue'
const bar = ref(null)
const thoughtStore = useThoughtStore()
const { error, loading, currentUrl, thoughts, urls, apiVersion } = storeToRefs( thoughtStore )


const refresh = ( url ) => {
  const barRef = bar.value
  barRef.start()
  thoughtStore.getThoughts( url )
  barRef.stop()
}

const getVersionList = computed( () => {
  const versions = urls.value.map( ( url, idx ) => {
    let obj = {}
    obj['label'] = `v${idx + 1}`
    obj['value'] = url
    return obj
  } )
  console.dir( versions )
  return versions
} )

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
