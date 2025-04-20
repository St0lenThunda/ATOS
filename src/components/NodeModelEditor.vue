<template>
  <div
    class="bg-secondary text-white q-pa-md"
    style="max-width: 600px"
  >
    <div
      ref="form"
      class="text-white row q-gutter-md q-pa-md"
    >
      <span class="text-h4">
        <slot name="header">{{ headerText }} </slot>
      </span>

      <div class="row">
        <template
          v-for=" ( model, modelKey ) in NodeModel "
          :key="modelKey"
        >
          <template v-if=" model.type == 'String' ">
            <template v-if=" 'label' === modelKey ">
              <q-input
                class="col-6 q-pa-md"
                v-model="dataRefs.label.value"
                :name="modelKey"
                :label="modelKey"
                :hint="model.description"
              />
            </template>
            <template v-if=" 'icon' === modelKey ">
              <div class="row col-6 q-pa-md">
                <q-input
                  class="col-6"
                  :name="modelKey"
                  v-model="dataRefs.icon.value"
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
                      <IconPicker v-model="dataRefs.icon.value"> </IconPicker>
                    </q-popup-proxy>
                  </template>
                </q-input>
              </div>
            </template>
            <template v-if=" 'iconColor' === modelKey ">
              <div class="q-gutter-md row items-evenly">
                <q-input
                  :label="modelKey"
                  :name="modelKey"
                  :hint="model.description"
                  v-model="dataRefs.iconColor.value"
                >
                  <template v-slot:append>
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
              </div>
            </template>
            <template v-if=" 'img' === modelKey ">
              <q-input
                class="col-6 q-pa-md"
                v-model="dataRefs.img.value"
                :name="modelKey"
                :label="modelKey"
                :hint="model.description"
              />
            </template>
            <template v-if=" 'avatar' === modelKey ">
              <q-input
                class="col-6 q-pa-md"
                v-model="dataRefs.avatar.value"
                :name="modelKey"
                :label="modelKey"
                :hint="model.description"
              >
                <template v-slot:append>
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
            </template>
          </template>
          <div class="flex-break">
            <template v-if=" 'disabled' === modelKey ">
              <q-toggle
                v-model="dataRefs.disabled.value"
                :label="modelKey"
                :name="modelKey"
              ></q-toggle>
            </template>
            <template v-if=" 'expandable' === modelKey ">
              <q-toggle
                v-model="dataRefs.expandable.value"
                :label="modelKey"
                :name="modelKey"
              ></q-toggle>
            </template>
            <template v-if=" 'selectable' === modelKey ">
              <q-toggle
                v-model="dataRefs.selectable.value"
                :label="modelKey"
                :name="modelKey"
              ></q-toggle>
            </template>
            <template v-if=" 'tickable' === modelKey ">
              <q-toggle
                v-model="dataRefs.tickable.value"
                :label="modelKey"
                :name="modelKey"
              ></q-toggle>
            </template>
            <template v-if=" 'noTick' === modelKey ">
              <q-toggle
                v-model="dataRefs.noTick.value"
                :label="modelKey"
                :name="modelKey"
              ></q-toggle>
            </template>
            <template v-if=" 'isFav' === modelKey ">
              <q-toggle
                v-model="dataRefs.isFav.value"
                :label="modelKey"
                :name="modelKey"
              ></q-toggle>
            </template>
          </div>
        </template>
      </div>

      <div>
        <q-btn
          label="Submit"
          @click="onSubmit"
          color="primary"
        />
        <q-btn
          bordered
          flat
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

import { ref, onMounted } from 'vue'
import { useThoughtStore } from 'src/stores/thoughts'
import NodeModel from 'src/assets/treeNode.json'
import IconPicker from 'src/components/IconPicker.vue'
const $q = useQuasar()
const form = ref( null )
var dataRefs = {
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
  // we need to set the dataRefs to the selected node
  // and set the form to the selected node
  const source = ( update ) ? store.selectedNode : NodeModel
  dataRefs = Object.assign( dataRefs, source );
}

onMounted( () => {
  setDefaults()
} )

const closeDialog = () => {
  emit( 'done', true )
}

const onSubmit = ( evt ) => {
  evt.preventDefault()
  if ( !dataRefs.label.value ) {
    $q.notify( { type: 'negative', message: 'Label is required' } );
    return;
  }
  store.addNode( refsToData() )
  resetForm()
  closeDialog()
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
