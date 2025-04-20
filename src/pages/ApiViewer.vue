<template class="q-pa-md q-gutter-sm">
  <q-toolbar
    class="bg-secondary text-white shadow-2"
    inset
  >
    <q-btn
      color="primary"
      label="Options"
      icon="settings"
      class="absolute right"
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
        <q-item clickable >
          <q-item-section avatar>
            <q-icon
              name="settings"
              color="accent"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-primary">
              Editor Settings
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
                    Show Editor
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model='showEditor' />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-primary ">
                    Editor Read-Only
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model='readOnlyEditor' />
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
        <q-item @click="getCached" clickable>
          <q-item-section avatar>
            <q-icon
              name="cached"
              color="accent"
            />
          </q-item-section>
          <q-item-section>
          <q-item-label class='text-primary'>Get Cache Data</q-item-label>
          </q-item-section>          
        </q-item>

        <q-separator />
        <q-item>
          <q-item-section
            avatar
          >
            <q-icon
              name="img:icons/json-icon.png"
              class='bg-accent'
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
            aria-label="Toggle Query Basics"
              icon="question_mark"
              @click="toggleQueryBasics"
            />
          </q-item-section>
        </q-item>
      </q-menu>
    </q-btn>
    <q-space />

    <q-toolbar-title v-if=" queryPath !== '' "><span class="text-weight-bold q-px-md  ">Current JSONPath:</span>
      {{ queryPath }}</q-toolbar-title>




  </q-toolbar>
  <div class="flex items-center">
    <div v-if=" loading ">Loading...</div>
    <div v-else-if=" error ">{{ error }}</div>
    <JSONEditor
      v-if=" showEditor "
      expand="true"
      :content="srcJSON"
      :readOnly="readOnlyEditor"
    />
      <!-- :onChange="onChange" -->
    <div v-if="!showEditor">
<q-toggle v-model="showEditor" label="Show Editor"  />
      <pre
        class="q-pa-lg"
        
      >{{ selectedNode.value }}</pre>
    </div>
  </div>
  <q-dialog v-model="queryBasics">
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
        <ul>
          <li>
            $ symbol refers to the root object or element.
          </li>
          <li>

            @ symbol refers to the current object or element.
          </li>
          <li>

            . operator is the dot-child operator, which you use to denote a child element of the current element.
          </li>
          <li>

            [ ] is the subscript operator, which you use to denote a child element of the current element (by name or
            index).
          </li>
          <li>

            * operator is a wildcard, returning all objects or elements regardless of their names.
          </li>
          <li>

            , operator is the union operator, which returns the union of the children or indexes indicated.
          </li>
          <li>

            : operator is the array slice operator, so you can slice collections using the syntax [start:end:step] to
            return a subcollection of a collection.
          </li>
          <li>

            ( ) operator lets you pass a script expression in the underlying implementation’s script language. It’s not
            supported by every implementation of JSONPath, however.
          </li>
          <li>

            ? ( ) to query all items that meet a certain criteria.
          </li>
        </ul>
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
import _ from 'lodash'
// import ApiMenu from 'src/components/ApiMenu.vue'
import JSONEditor from 'src/components/JSONEditor.vue';
import jsonPath from 'jsonpath'

import { useQuasar } from 'quasar'
import { useThoughtStore } from 'src/stores/thoughts.js'
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref, computed } from 'vue'
const bar = ref( null )
const queryBasics = ref( false )
const showEditor = ref( true )
const readOnlyEditor = ref( true )
const thoughtStore = useThoughtStore()
const $q = useQuasar()
const {
  error,
  loading,
  currentUrl,
  apiVersionList,
  currentApiVersion,
  selectedNode,
  queryPath
} = storeToRefs( thoughtStore )

const toggleQueryBasics = () => {
  queryBasics.value = !queryBasics.value;
};

const getApiData = async (url) => {
  const barRef = bar.value;
  barRef.start();
  try {
    await thoughtStore.getThoughts(url);
  } catch (err) {
    $q.notify(`Error fetching API data: ${err}`)
    console.error('Error fetching API data:', err);
    thoughtStore.error.value = 'Failed to fetch API data.';
  } finally {
    barRef.stop();
  }
};
const validateJSONPath = (path) => {
  try {
    // Example: Use a JSONPath library to validate
    jsonPath.parse(path);
    return true;
  } catch (e) {
    console.log('Error validating:', e)
    return false;
  }
};

const queryJSONPath = () => {
  try {
     if (validateJSONPath(queryPath.value))  thoughtStore.queryData();
    showEditor.value = false
     
  } catch (error) {
    console.error('Invalid JSONPath',error);
    $q.notify(`Invalid JSONPath: ${error}`)
  
}
};

const getCached = () => {
  try {
   const data =  $q.localStorage.getItem(thoughtStore.thoughts)
    JSONEditor.content = {json: data}
  } catch (error) {
    $q.notify(`Error reading cache: ${error}`)
  }
}

// TOOD: use global dialog for menu
// const openEditorOpts = () => {
//   $q.dialog( {
//     component: ApiMenu,
//     // props forwarded to your custom component
//     // componentProps: {
//     //   update: false,
//     //   headerText: 'Add New Leaf',
//     // },
//   } )
//     .onOk( () => {
//       console.log( 'OK' )
//     } )
//     .onCancel( () => {
//       console.log( 'Cancel' )
//     } )
//     .onDismiss( () => {
//       console.log( 'Called on OK or Cancel' )
//     } )
// }
// source data for json editor
const srcJSON = computed( () => ( {
  "json" : thoughtStore.thoughts
} ) )

const debouncedGetApiData = _.debounce((url) => getApiData(url), 300);

watch(
  () => thoughtStore.currentUrl,
  (url) => debouncedGetApiData(url)
);
watch(
  () => thoughtStore.currentUrl,
  ( url ) => getApiData( url )
)

onMounted( () => getApiData() )
</script>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  margin: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  max-height: 500px;
  overflow-y: auto;
}

.app {
  font-family: sans-serif;
}

.my-editor {
  width: 700px;
  max-width: 100%;
  height: 400px;
  display: flex;
}

pre.my-contents {
  width: 700px;
  max-width: 100%;
  overflow: auto;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  padding: 0.5em;
  box-sizing: border-box;
}
</style>

