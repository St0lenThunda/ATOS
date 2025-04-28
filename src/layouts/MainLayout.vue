<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> ATOS <span class="text-subtitle1">- a thought organization system</span> </q-toolbar-title>

        <q-space />
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
      <q-toolbar
        class="bg-info"
        inset
        v-if=" leftDrawerOpen "
      >
        <q-icon name="folder_data" />
        <q-toolbar-title>
          Current path:

          <strong> {{ $route.fullPath }}</strong>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="drawer-container"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header> Essential Links </q-item-label>
        <EssentialLink
          color="primary"
          v-for=" link in linksList "
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <div class="theme-switcher-container">
        <ThemeSwitcher />
      </div>
    </q-drawer>
    <q-page-container>
      <q-ajax-bar
        ref="bar"
        position="bottom"
        color="accent"
        size="10px"
        skip-hijack
      />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import ThemeSwitcher from "components/ThemeSwitcher.vue";

const bar = ref( null );
const linksList = [
  {
    title: "Home",
    caption: "About ATOS",
    icon: "home",
    link: "/",
  },
  {
    title: "API Viewer",
    caption: "Raw JSON Data Viewer",
    icon: "data_object",
    link: "api",
  },
  {
    title: "Thoughts",
    caption: "Root of Thoughts",
    icon: "psychology",
    link: "thoughts",
  },
  {
    title: "Glossary",
    caption: "Concepts and definitions",
    icon: "book",
    link: "glossary",
  },
];

const leftDrawerOpen = ref( false );

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
.drawer-container {
  position: relative;
  /* Ensure the drawer is a positioned ancestor */
  height: 100%;
  /* Full height of the drawer */
  display: flex;
  flex-direction: column;
  /* Stack children vertically */
}

.theme-switcher-container {
  margin-top: auto;
  /* Push the ThemeSwitcher to the bottom */
  padding: 16px;
  /* Add some padding for spacing */
  background-color: var(--q-dark-page);
  /* Match the drawer's background */
}
</style>
