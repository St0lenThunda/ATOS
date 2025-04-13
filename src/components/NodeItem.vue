<template v-show="formData">
  
  <q-item >
         <q-item>
           <q-item-section avatar top>
          <q-badge color="accent" :label="formData.id" v-if='formData.id'></q-badge>
          <q-avatar v-if="formData.children" icon='account_tree' />
          <q-avatar :icon="formData.icon || 'account_tree'" color='primary' text-color='white'>
          </q-avatar>
        </q-item-section>

        <q-item-section v-if="formData.description" top>
          <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
            <span class="cursor-pointer">{{ formData.label }}</span>
          </q-item-label>
          <q-item-label :lines="formData.description.title" v-if="formData.description.title">
            <span class="text-weight-medium">{{ formData.description.title}}</span>
          </q-item-label>
          <q-item-label caption :lines="formData.description.para.length" v-if="formData.description.para">{{ formData.description.para.join('<br />')}}
          </q-item-label>
        </q-item-section>
        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
            <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
            <q-btn size="12px" flat dense round icon="more_vert" />
          </div>
        </q-item-section>
      </q-item>
  </q-item>
</template>

<script setup>
import { toRefs} from 'vue'
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
})

const { formData } = toRefs(props)
</script>
