<template>
  <q-dialog
    v-model="menu"
    transition-show="scale"
    transition-hide="scale"
    anchor="bottom left"
    self="top left"
  >
    <q-card>
      <q-card-section class="q-pa-sm">
        <q-input
          dense
          outlined
          v-model="search"
          placeholder="Search icons..."
          class="q-mb-sm"
          clearable
          debounce="200"
        />

        <div class="row q-gutter-sm justify-center">
          
          <template
            v-for=" icon in filteredIcons "
            :key="icon"
          >

            <q-btn
              round
              flat
              size="md"
              align="evenly"
              :icon="icon"
              @click="selectIcon( icon )"
              :color="modelValue === icon ? 'primary' : 'grey-7'"
            >
              <q-tooltip class="text-capitalize text-body2 shadow-4"> {{ icon.split('_').join(' ') }}</q-tooltip>
            </q-btn>
          </template>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <slot name='btn'>
  <q-btn
    color="primary"
    :label="modelValue"
    :icon="modelValue || 'apps'"
    @click="menu = true"
    flat
  />
  </slot>
</template>

<script setup>
import { ref, computed } from 'vue'
// import iconsObj from 'src/assets/material-icons.json'

defineProps( {
  modelValue: String
} )
const emit = defineEmits( ['update:modelValue'] )

const menu = ref( false )
const search = ref( '' )

const icons = [
  'home', 'person', 'shopping_cart', 'star', 'favorite',
  'settings', 'delete', 'info', 'help', 'lock'
]
// const icons = iconsObj.icons.map(item=>item.name)

const filteredIcons = computed( () => {
  if ( !search.value ) return icons
  return icons.filter( icon => icon.toLowerCase().includes( search.value.toLowerCase() ) )
} )

function selectIcon ( icon ) {
  emit( 'update:modelValue', icon )
  menu.value = false
}
</script>

<style scoped>
.q-btn {
  width: 60px;
  height: 60px;
}
</style>
