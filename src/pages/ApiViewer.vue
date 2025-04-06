<template class="q-pa-md q-gutter-sm">
  <q-toolbar
    class="bg-secondary text-white shadow-2"
    inset
  >
    <q-btn
      color="primary"
      label="Options"
      icon="settings"
    >
      <q-menu>
        <q-item clickable>
          <q-item-section avatar>
            <q-icon
              name="info"
              color="accent"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-primary">
              Info
            </q-item-label>
          </q-item-section>
          <q-menu
            anchor="top end"
            self="top start"
          >
            <q-list style="min-width: 100px">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-primary ">
                    Latest version:
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="accent">v{{ currentApiVersion }}+</q-badge>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section
                  top
                  avatar
                >
                  <q-btn
                    flat
                    color="primary"
                    text-color="white"
                    icon="link"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label> <q-item-label>Current Api Endpoint:</q-item-label>
                  </q-item-label>
                  <q-item-label
                    caption
                    lines="2"
                  ><a
                      class="text-overline"
                      :href="currentUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ currentUrl }}</a></q-item-label>
                </q-item-section>

              </q-item>
            </q-list>
          </q-menu>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section avatar>
            <q-icon
              name="api"
              color="accent"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-primary">Api Versions</q-item-label>
          </q-item-section>
          <q-menu
            anchor="top end"
            self="top start"
          >
            <q-list>
              <q-item>
                <q-item-section>
                  <q-select
                    filled
                    stack-label
                    dense
                    options-dense
                    emit-value
                    map-options
                    v-model="currentUrl"
                    :options="apiVersionList"
                    label="Choose a api to view"
                    style="min-width: 250px; max-width: 300px"
                  >
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
                </q-item-section>
              </q-item>

            </q-list>
          </q-menu>

        </q-item>
        <q-separator />
        <q-item>
          <q-item-section
            top
            avatar
          >
            <q-btn
              unelevated
              text-color="accent"
              label="{ $ }"
              round
              class="text-weight-bolder"
            />
          </q-item-section>
          <q-item-section>
            <q-input
              outlined
              clearable
              v-model="queryPath"
              type="search"
              label="JSONPath"
              hint="Input JsonPath (Ex. '$')"
              dense
            />
          </q-item-section>
          <q-item-section
            side
            top
          >
            <q-btn
              color="primary"
              icon="search"
              @click="queryJSONPath"
            />
            <q-btn
              icon="question_mark"
              @click="queryBasics = !queryBasics"
            />
          </q-item-section>
        </q-item>
      </q-menu>
    </q-btn>
    <q-space />

<q-toolbar-title v-if="queryPath !== ''"><span class="text-weight-bolder">Current JSONPath:</span>{{ queryPath }}</q-toolbar-title>




  </q-toolbar>
  <div class="flex items-center">
    <div v-if=" loading ">Loading...</div>
    <div v-else-if=" error ">{{ error }}</div>
    <pre
      class="q-pa-lg"
      v-else-if=" selectedNode "
    >{{ selectedNode.value }}</pre>
    <pre v-else class="q-pa-lg">
    {{ thoughts }}
    </pre>
  </div>
  <q-dialog v-show="queryBasics">
    <q-card>
      <q-toolbar>
        <q-avatar>
          <q-btn
            flat
            label="{ $ }"
            class="text-weight-bolder"
            round
          />
        </q-avatar>

        <q-toolbar-title><span class="text-weight-bold">JSONPath</span> Basics</q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
        />
      </q-toolbar>

      <q-card-section>
        The important JSONPath syntax rules are:

        $ symbol refers to the root object or element.
        @ symbol refers to the current object or element.
        . operator is the dot-child operator, which you use to denote a child element of the current element.
        [ ] is the subscript operator, which you use to denote a child element of the current element (by name or
        index).
        * operator is a wildcard, returning all objects or elements regardless of their names.
        , operator is the union operator, which returns the union of the children or indexes indicated.
        : operator is the array slice operator, so you can slice collections using the syntax [start:end:step] to return
        a subcollection of a collection.
        ( ) operator lets you pass a script expression in the underlying implementation’s script language. It’s not
        supported by every implementation of JSONPath, however.
        ? ( ) to query all items that meet a certain criteria.
      </q-card-section>
    </q-card>
  </q-dialog>
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
const bar = ref( null )
const queryBasics = false
const thoughtStore = useThoughtStore()
const {
  error,
  loading,
  currentUrl,
  thoughts,
  apiVersionList,
  currentApiVersion,
  selectedNode,
  queryPath
} = storeToRefs( thoughtStore )


const getApiData = ( url ) => {
  const barRef = bar.value
  barRef.start()
  thoughtStore.getThoughts( url )
  barRef.stop()
}


watch(
  () => thoughtStore.currentUrl,
  ( url ) => getApiData( url )
)

const queryJSONPath = () => thoughtStore.queryData()
onMounted( () => getApiData() )
</script>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
