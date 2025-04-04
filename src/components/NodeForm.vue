<template v-if="formData">
  <q-form >
    <q-field>
      <div class="q-pa-md q-gutter-sm">
        <q-tree :nodes="[formData]" node-key="label" />
      </div>
    </q-field>
    <q-input filled v-model="title" label="Selected Node" />
    <div class="text-overline text-orange-9">
      {{ formData?.description?.para.join() }}
    </div>
  </q-form>
</template>

<script setup>
import { toRefs, computed } from 'vue'
const title = computed( () => {
  return props?.description?.title || 'Title'
})
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
})

const { formData } = toRefs(props)
</script>
