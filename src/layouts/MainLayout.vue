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

        <q-toolbar-title>
          ATOS - a thought organization system
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for=" link in linksList "
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>


        <q-list
          bordered
          v-if=" leftDrawerOpen "
        >
          <q-item>
            <q-item-section avatar>
              <q-icon name="folder_data" />
            </q-item-section>
            <q-item-section side>Current path:</q-item-section>
            <q-item-section> {{ $route.fullPath }}</q-item-section>
          </q-item>
        </q-list>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [

  {
    title: 'Home',
    caption: 'About ATOS',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Thoughts',
    caption: 'Root of Thoughts',
    icon: 'psychology',
    link: 'thoughts'
  },
  {
    title: 'Thoughts',
    caption: 'Experimental',
    icon: 'psychology_alt',
    link: 'thoughts2'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
