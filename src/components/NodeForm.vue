<template>
  <q-form v-if="formData">
    <q-field>

      <pre>
        {{ formData }}
      </pre>
    </q-field>
    <!-- <q-input
      filled
      v-model="formData.description.title"
      label="Selected Node"
    />
    <div class="text-overline text-orange-9">
      {{ formData?.description?.para.join() }}
    </div> -->

  </q-form>
</template>

<script setup>
import { toRefs } from 'vue';

const props = defineProps( {
  formData: {
    type: Object,
    required: true
  }
} );

const { formData } = toRefs( props );
</script>
