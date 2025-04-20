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

        <q-toolbar-title> ATOS - a thought organization system </q-toolbar-title>

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

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for=" link in linksList "
          :key="link.title"
          v-bind="link"
        />
      </q-list>
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
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
const bar = ref(null)
const linksList = [
  {
    title: 'Home',
    caption: 'About ATOS',
    icon: 'home',
    link: '/',
  },
  {
    title: 'API Viewer',
    caption: 'Raw JSON Data Viewer',
    icon: 'data_object',
    link: 'api',
  },
  {
    title: 'Thoughts',
    caption: 'Root of Thoughts',
    icon: 'psychology',
    link: 'thoughts',
  },
  // {
  //   title: 'JsonTree Component',
  //   caption: 'Beta',
  //   icon: 'account_tree',
  //   link: 'beta2',
  // },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
