<template>
  <q-card
    bordered
    dense
    padding
  >
    <q-card-section>
      Change Icon
    </q-card-section>
    <q-card-section
      top
      side
    >
      <icon-picker v-model="formData['icon']" />
    </q-card-section>
    <q-card-section
      v-for=" key in nodeKeys "
      :key="key"
    >

      <template v-if=" fieldType( formData[key] ) == 'string' ">
        <q-item-section inset=1>
          <q-input
            class="col-6 text-capitalize"
            v-model="formData[key]"
            :label="key"
          />

        </q-item-section>
      </template>
      <template v-else-if=" fieldType( formData[key] ) == 'object' ">
        <q-item-section>
          <span class="text-center text-orange text-subtitle1 text-weight-bolder q-pa-md">Children</span>
          <q-tree
            :nodes="formData[key]"
            node-key="label"
            dense
            accordion
          />
        </q-item-section>
      </template>
    </q-card-section>
    <q-separator
      spaced
      dark
    />
    <q-card-actions
      top
      side
    >
      <q-btn
        :color="store.dirty ? 'secondary' : 'accent'"
        icon="save"
        label="Save"
        @click="store.updateNodeById( formData['id'] )"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { toRefs } from 'vue'
import { useThoughtStore } from 'src/stores/thoughts'
import IconPicker from 'src/components/IconPicker.vue'

const store = useThoughtStore()

const fieldType = ( field ) => typeof field
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
})

const { formData } = toRefs( props )
const nodeKeys = Object.keys(formData)
</script>
