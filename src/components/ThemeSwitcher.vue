<template>
  <q-btn-dropdown
    dropdown-icon="change_history"
    label="Choose Theme"
    size="md"
    class="q-pa-sm q-ma-sm full-width"
    glossy
  >
    <q-list>
      <q-item
        v-for="(theme, idx) in store.getThemeNames"
        :key="idx"
        clickable
        @click="store.setTheme(theme)"
      >
        <q-item-section class="text-capitalize">{{
          splitCamelCase(theme)
        }}</q-item-section>
      </q-item>
      <q-item>
        <q-item-section top avatar>
          <q-avatar
            color="primary"
            text-color="white"
            :icon="$q.dark.isActive ? 'brightness_7' : 'mode_night'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>Dark Mode</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="$q.dark.isActive" color="secondary" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup>
  import { onMounted } from "vue";
  import { useSettings } from "src/stores/settings";

  const store = useSettings();
  const splitCamelCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2");
  };
  onMounted(() => {
    store.setTheme(store.getSavedTheme); // Apply the saved theme on page load
  });
</script>
