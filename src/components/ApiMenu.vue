<template>
<v-dialog
  v-model="dialog"
  scrollable 
  fullscreen 
  persistent 
  max-width="500px"
  transition="dialog-transition"
 ref="dialogRef" 
 @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
       <q-list >
              <q-item>
                <q-item-section>
                  <q-item-label class="text-primary ">
                    Show Editor
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model='LocalShow' />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-primary ">
                    Editor Read-Only
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model='LocalReadOnly' />
                </q-item-section>
              </q-item>
            </q-list>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </v-dialog>
</template>
  
<script setup>
import {computed } from 'vue'

import { useDialogPluginComponent } from 'quasar'

const { show, readOnly} = defineProps({
  show: Boolean,
  readOnly: Boolean
})

const emit = defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,'update:readOnly','update:show',
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
const onOKClick = () => {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK()
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
const LocalShow = computed({
  get: () => show,
  set: (value) => emit('update:show', value),
});

const LocalReadOnly = computed({
  get: () => readOnly,
  set: (value) => emit('update:readOnly', value),
});

</script>