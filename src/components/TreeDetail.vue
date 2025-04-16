<template v-show="formData">

  <q-item>
    <q-item>
      <q-item-section
        avatar
        top
      >

        <q-avatar
          :icon="formData.icon || 'account_tree'"
          color='primary'
          text-color='white'
        >
        </q-avatar>
      </q-item-section>
      <q-item-section
        v-if=" hasChildren() "
        side
        top
      >
        <q-avatar icon='account_tree' />

      </q-item-section>

      <q-item-section top>
        <q-item-label>
          <q-badge
            color="accent"
            :label="formData.id"
            v-if=' formData.id '
          />
          {{ crumbTrail }}
        </q-item-label>
        <q-item-label
          v-if=" formData.title "
          lines="1"
          class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
        >
          <span class="cursor-pointer">{{ formData.title }}</span>
        </q-item-label>
        <q-item-label
          v-else
          lines="1"
          class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
        >
          <span class="cursor-pointer">{{ selectedText }}</span>
        </q-item-label>
        <q-item-label
          caption
          lines="2"
          v-if=" formData.text "
        >{{ formData.text }}
        </q-item-label>
      </q-item-section>
      <q-item-section
        top
        side
      >
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            v-if="!hasChildren"
            class="gt-xs"
            size="12px"
            flat
            dense
            round
            icon="delete"
          />
          <q-btn
            v-if="hasChildren"
            class="gt-xs"
            size="12px"
            flat
            dense
            round
            icon="edit"
          />
          
          <q-btn
            class="gt-xs"
            size="12px"
            flat
            dense
            round
            icon="save"
            disabled
          />
          <q-btn
            size="12px"
            flat
            dense
            round
            icon="more_vert"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-item>
</template>

<script setup>
import { toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash'
import { useThoughtStore } from 'stores/thoughts'

const store = useThoughtStore()
const { selectedText, crumbTrail } = storeToRefs( store )
const props = defineProps( {
  formData: {
    type: Object,
    required: true,
  }
} )

const { formData } = toRefs( props )
const hasChildren = function () {
  return _.difference( Object.keys( this?.formData ), ['id', 'text', 'icon', 'title'] ).length > 0
}
</script>
