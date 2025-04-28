<template>
  <div
    class="q-pa-md "
    dark
  >
    <div
      ref="form"
      class="row"
    >

      <!-- Header Section -->
      <div class="q-gutter-md col-12">
        <q-item-label class="text-h4 text-center">
          <slot name="header">{{ headerText }}</slot>
        </q-item-label>
      </div>

      <!-- Two-column layout for non-boolean inputs -->
      <div class="row q-gutter-md q-pa-xl text-capitalize items-center">
        <template
          v-for=" ( model, modelKey ) in NodeModel "
          :key="modelKey"
        >
          <!-- String Inputs -->
          <template v-if=" model.type === 'String' ">
            <div class="col-12 ">
              <q-input
                v-model="dataRefs[modelKey].value"
                :name="modelKey"
                :label="modelKey"
                :hint="model.description"
                dense
                standout="bg-secondary text-white"
                :rules="[val => !!val || `${modelKey} is required`]"
              >
                <template #append>
                  <template v-if=" modelKey === 'icon' || modelKey === 'avatar' ">
                    <q-icon
                      name="apps"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <IconPicker v-model="dataRefs[modelKey].value" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-else-if=" modelKey === 'iconColor' ">
                    <q-icon
                      name="colorize"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-color v-model="dataRefs.iconColor.value" />
                      </q-popup-proxy>
                    </q-icon>

                  </template>
                </template>
              </q-input>
            </div>
          </template>
        </template>
      </div>

      <!-- Three-column layout for boolean inputs -->
      <div class="row q-gutter-md q-pa-xl">
        <template
          v-for=" ( model, modelKey ) in NodeModel "
          :key="modelKey"
        >
          <!-- Boolean Toggles -->
          <template v-if=" model.type === 'Boolean' ">
            <div class="col-12 col-md-4 text-capitalize text-h6">
              <q-toggle
                v-model="dataRefs[modelKey].value"
                :label="modelKey"
                :name="modelKey"
                color='secondary'
                dense
              />
            </div>
          </template>
        </template>
      </div>

      <!-- Children Section -->
      <div
        v-if=" store.nodeHasChildren "
        class="col-12  q-pa-md text-center text-h6   shadow-8"
      >
        <span>Children</span>
        <q-tree
          :nodes="store.getNodeChildren"
          node-key="label"
          dense
          accordion
        />
      </div>

      <!-- Submit and Reset Buttons -->
      <div class="row col-12 q-mt-md justify-center">
        <q-btn
          label="Submit"
          @click="onSubmit"
          color="primary"
          v-close-popup
        />
        <q-btn
          outline
          label="Reset"
          type="reset"
          @click="resetForm"
          color="primary"
          class="q-ml-sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// TODO: assess the need for notification on page
// TODO: solidify form validation
import { useQuasar } from 'quasar'
import _ from 'lodash'
import { ref, onMounted } from 'vue'
import { useThoughtStore } from 'src/stores/thoughts'
import NodeModel from 'src/assets/treeNode.json'
import IconPicker from 'src/components/IconPicker.vue'
const $q = useQuasar()
const form = ref( null )
let dataRefs = {
  label: ref( '' ),
  icon: ref( '' ),
  iconColor: ref( '' ),
  img: ref( '' ),
  avatar: ref( '' ),
  children: ref( [] ),
  disabled: ref( false ),
  expandable: ref( false ),
  selectable: ref( true ),
  handler: ref( null ),
  tickable: ref( false ),
  noTick: ref( false ),
  tickStrategy: ref( '' ),
  lazy: ref( false ),
  header: ref( '' ),
  body: ref( '' ),
  isFav: ref( false ),
}
const { update, headerText } = defineProps( {
  update: {
    type: Boolean,
    default: false
  },
  headerText: {
    type: String,
    default: "Add New Node"
  },
} )
const emit = defineEmits( ['done'] )
const store = useThoughtStore()
const isLoading = ref( false );

const setDefaults = () => {
  if ( update ) {
    // Update mode: Set form values to the selected node
    Object.keys( dataRefs ).forEach( ( key ) => {
      if ( store.selectedNode[key] !== undefined ) {
        dataRefs[key].value = store.selectedNode[key];
      }
    } );
  } else {
    // Add mode: Set form values to defaults from NodeModel
    const treeNodeDefaults = getTreeNodeDefaults( NodeModel );
    Object.keys( dataRefs ).forEach( ( key ) => {
      dataRefs[key].value = treeNodeDefaults[key];
    } );
  }
};

/**
 * Extracts all keys from the treeNode JSON and maps them to their default values.
 * @param {Object} nodeSchema - The JSON schema for the tree node.
 * @returns {Object} - An object with keys as property names and values as their defaults.
 */
const getTreeNodeDefaults = ( nodeSchema ) => {
  // Use _.mapValues to iterate over the object and extract the "default" value for each key
  return _.mapValues( nodeSchema, ( value ) => _.get( value, 'default', null ) );
}

onMounted( () => {
  setDefaults()
} )


const onSubmit = async ( evt ) => {
  evt.preventDefault();
  if ( !dataRefs.label.value ) {
    $q.notify( { type: 'negative', message: 'Label is required' } );
    return;
  }
  isLoading.value = true;
  try {
    await store.addNode( refsToData() );
    resetForm();
    emit( 'done', true );
  } catch ( error ) {
    $q.notify( { type: 'negative', message: 'Failed to add node: ' + error.message } );
  } finally {
    isLoading.value = false;
  }
};

const refsToData = () => _.mapValues( dataRefs, ( ref ) => ref.value );

const resetForm = () => {
  Object.keys( dataRefs ).forEach( ( key ) => {
    dataRefs[key].value = '';
  } );
}
</script>

