<template>
  <div class="q-pa-md bg-grey-6 text-white">
    <div
      ref="form"
      class="row"
    >
      <div class="q-gutter-md col-12 ">
        <q-item-label class="text-h4 text-center">
          <slot name="header">{{ headerText }}</slot>
        </q-item-label>
      </div>

      <!-- Two-column layout for inputs -->
      <q-row class="text-capitalize q-pa-xl">
        <template
          v-for=" ( model, modelKey ) in NodeModel "
          :key="modelKey"
        >
          <!-- String Inputs -->
          <template v-if=" model.type === 'String' ">
            <q-col cols="6">
              <q-input
                v-if=" 'label' === modelKey "
                v-model="dataRefs.label.value"
                :name="modelKey"
                :label="modelKey"
                :hint="model.description"
              />
              <q-input
                v-if=" 'icon' === modelKey "
                v-model="dataRefs.icon.value"
                :name="modelKey"
                :label="modelKey"
                :hint="model.description"
              >
                <template #append>
                  <q-icon name="apps" />
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <IconPicker v-model="dataRefs.icon.value" />
                  </q-popup-proxy>
                </template>
              </q-input>
              <q-input
                v-if=" 'iconColor' === modelKey "
                v-model="dataRefs.iconColor.value"
                :name="modelKey"
                :label="modelKey"
                :hint="model.description"
              >
                <template #append>
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
              </q-input>
              <q-input
                v-if=" 'img' === modelKey "
                v-model="dataRefs.img.value"
                :name="modelKey"
                :label="modelKey"
                :hint="model.description"
              />
              <q-input
                v-if=" 'avatar' === modelKey "
                v-model="dataRefs.avatar.value"
                :name="modelKey"
                :label="modelKey"
                :hint="model.description"
              >
                <template #append>
                  <q-icon
                    name="apps"
                    class="cursor-pointer"
                  >
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <IconPicker v-model="dataRefs.avatar.value" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-col>
          </template>

          <!-- Boolean Toggles -->
          <template v-if=" model.type === 'Boolean' ">
            <q-col cols="6">
              <q-toggle
                v-if=" 'expandable' === modelKey "
                v-model="dataRefs.expandable.value"
                label="Is Folder?"
                :name="modelKey"
              />
              <q-toggle
                v-if=" 'selectable' === modelKey "
                v-model="dataRefs.selectable.value"
                :label="modelKey"
                :name="modelKey"
              />
              <q-toggle
                v-if=" 'tickable' === modelKey "
                v-model="dataRefs.tickable.value"
                :label="modelKey"
                :name="modelKey"
              />
              <q-toggle
                v-if=" 'noTick' === modelKey "
                v-model="dataRefs.noTick.value"
                :label="modelKey"
                :name="modelKey"
              />
              <q-toggle
                v-if=" 'isFav' === modelKey "
                v-model="dataRefs.isFav.value"
                :label="modelKey"
                :name="modelKey"
              />
              <q-toggle
                v-if=" 'disabled' === modelKey "
                v-model="dataRefs.disabled.value"
                :label="modelKey"
                :name="modelKey"
              />
            </q-col>
          </template>
        </template>
      </q-row>

      <!-- Children Section -->
      <div
        class="col"
        v-if=" store.nodeHasChildren "
      >
        <span class="text-center text-orange text-subtitle1 text-weight-bolder q-pa-md">Children</span>
        <q-tree
          :nodes="store.getNodeChildren"
          node-key="label"
          dense
          accordion
        />
      </div>

      <!-- Submit and Reset Buttons -->
      <div>
        <q-btn
          label="Submit"
          @click="onSubmit"
          color="primary"
          v-close-popup
        />
        <q-btn
          bordered
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

const setDefaults = () => {

  if ( update ) {
    // if updating set the form to the selected node
    dataRefs = Object.assign( dataRefs, store.selectedNode );
  } else {
    // we need to set the dataRefs to the NodeModel defaults
    const treeNodeDefaults = getTreeNodeDefaults(NodeModel)
 Object.keys(dataRefs).forEach(key => {
  dataRefs[key] = ref(treeNodeDefaults[key])
 });
  }

}
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

// const closeDialog = () => {

// }

const onSubmit = ( evt ) => {
  evt.preventDefault()
  if ( !dataRefs.label.value ) {
    $q.notify( { type: 'negative', message: 'Label is required' } );
    return;
  }
  store.addNode( refsToData() )
  resetForm()
  emit( 'done', true )
}

const refsToData = () => {
  // consolidate the data into a non-reactive js object
  var data = {}
  for ( const [key, val] of Object.entries( dataRefs ) ) {
    data[key] = val.value
  }
  return data
}

const resetForm = () => {
  setDefaults()
}
</script>

<style scoped>
.flex-break {
  flex: 1 0 100% !important;
}

.row flex-break {
  height: 0 !important;
}

.column flex-break {
  width: 0 !important;
}
</style>
