<template>
  <q-menu context-menu>
    <q-list style="min-width: 100px">
      <q-item clickable v-close-popup @click="openAdd(true)">
        <q-item-section>Add Child</q-item-section>
      </q-item>
      <q-separator />
      <!-- <q-item clickable v-close-popup>
        <q-item-section>New incognito tab</q-item-section>
      </q-item> -->
    </q-list>
  </q-menu>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue'])
const openAdd = (val) => emit('update:modelValue', val)
</script>
