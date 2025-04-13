<template v-if="formData">
    <q-list>
      <NodeItem :formData="formData" />
    </q-list>
    <!-- <template v-for="key in Object.keys(formData)" :key='key'>
      <template v-if="fieldType(formData[key]) == 'string'">
        <template v-if="key == 'icon'">
          <q-icon class='col-6' :name="formData[key]"></q-icon>
        </template>
        <template v-else>
          <q-input class='col-6' v-model="formData[key]" :label="key" />
        </template>
      </template>
      <template v-else-if="fieldType(formData[key]) == 'object'">
        <NodeForm :formData=formData[key] />
      </template>
    </template>
    <div class="text-overline text-orange-9">
      {{ formData?.description?.para.join() }}
    </div> -->
</template>

<script setup>
import { toRefs} from 'vue'
import NodeItem from 'src/components/NodeItem.vue'
// const fieldType = ((field) => { return (field) ? typeof field : 'string'})
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
})

const { formData } = toRefs(props)
</script>
