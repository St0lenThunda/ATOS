<template>
  <q-toolbar q-if="store.hasCrumbs">
    <q-btn-dropdown
      split
      rounded
      @click="refresh"
      icon="refresh"
      class="q-mr-xl q-ml-md"
      color="primary"
    >
      <q-list>
        <q-item clickable v-close-popup @click="refresh(false)">
          <q-item-section>
            <q-item-label>Load from source</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-breadcrumbs
      active-color="grey"
      style="font-size: 16px"
      class="text-body text-primary text-weight-bolder text-uppercase"
      separator=" > "
    >
      <q-breadcrumbs-el
        v-for="crumb in crumbs"
        :key="crumb"
        :label="crumb"
        class="cursor-pointer"
        @click="onNodeSelect(crumb)"
      />
    </q-breadcrumbs>
    <q-space />
  </q-toolbar>
  <q-splitter v-model="splitterModel" class="q-px-md" style="height: 85vh">
    <template v-slot:before>
      <div class="col-12 col-sm-6 q-gutter-xs">
        <q-tree
          class="q-mx-lg"
          ref="treeRef"
          q-if="thoughts"
          :nodes="[thoughts]"
          node-key="label"
          v-model:selected="selectedText"
          v-model:expanded="expandedNodes"
          @update:selected="onNodeSelect"
          @after-show="highLightSelected"
          accordion
          dense
        >
          <template v-slot:default-header="prop">
            <q-item dense>
              <q-item-section thumbnail>
                <q-icon
                  :color="prop.node.iconColor || 'primary'"
                  text-color="primary"
                  :name="prop.node.icon || 'eco'"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-primary">
                  {{ prop.node.label }}
                </q-item-label>
              </q-item-section>
              <q-item-section top side>
                <q-icon v-if="prop.node.isFav" name="favorite" color="red" />
              </q-item-section>
            </q-item>
            <NodeMenu v-if="isNodeSelected" @ShowEdit="store.editing = !store.editing" />
          </template>
        </q-tree>
      </div>
      <div class="col-6 q-gutter-sm">
        <div class="text-h6">Selected</div>
        <div>{{ selected }}</div>

        <q-separator spaced />

        <div class="text-h6">Expanded</div>
        <div>
          <div v-for="expand in expandedNodes" :key="`expanded-${expand}`">
            {{ expand }}
          </div>
        </div>
      </div>
    </template>
    <template v-slot:separator v-if="store.editing">
      <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />
    </template>
    <template v-slot:after v-if="store.editing">
      <div class="col-6 q-pa-md">
        <q-card class="shadow-8">
          <q-card-section>
            <NodeModelEditor :update="true" headerText="Update" />
          </q-card-section>
          <q-card-actions>
            <q-space />

            <q-btn
              color="grey"
              round
              flat
              dense
              :label="expanded ? 'Hide JSON' : 'Show JSON'"
              :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="expanded = !expanded"
            />
          </q-card-actions>
          <q-slide-transition>
            <div v-show="expanded">
              <q-separator />
              <q-card-section class="text-subtitle2">
                <QMarkdown>
                  <pre id="json-display"> {{ strSelectedNode }}</pre>
                </QMarkdown>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
    </template>
  </q-splitter>
  <q-ajax-bar ref="bar" position="bottom" color="secondary" size="10px" skip-hijack />
</template>

<script setup>
  import { ref, onMounted, watch } from "vue";
  import { useThoughtStore } from "src/stores/thoughts";
  import { storeToRefs } from "pinia";
  import NodeModelEditor from "src/components/NodeModelEditor.vue";
  import NodeMenu from "src/components/NodeMenu.vue";
  import { QMarkdown } from "@quasar/quasar-ui-qmarkdown";

  const store = useThoughtStore();
  const { crumbs, strSelectedNode, thoughts, selectedText, isNodeSelected } = storeToRefs(
    store
  );
  const bar = ref(null);
  const apiV1 = "http://localhost:3001/0";
  const treeRef = ref(null);
  const expanded = ref(true);
  const expandedNodes = ref([]);
  const selected = ref('')
  const splitterModel = ref(95);

  watch(
    () => store.editing,
    (newValue, oldValue) => {
      console.debug(`Store Editing state changed from ${oldValue} to ${newValue}`);
      splitterModel.value = store.editing ? 30 : 95;
    },
    { immediate: true }
  );

  const refresh = async (useCache) => {
    useCache = useCache ? true : false;
    const barRef = bar.value;
    barRef.start();
    await store?.getThoughts(apiV1, useCache);
    barRef.stop();
  };

  const highLightSelected = () => {
    const elements = document.querySelectorAll(".q-tree__node--selected ");
    if (elements.length) {
      elements[0]?.classList.add("bg-accent");
    }
  };

  const onNodeSelect = (key) => {
    store.setSelected(key, treeRef?.value.getNodeByKey(key));
    if (key === null) return;

    treeRef?.value.setExpanded(key, true);
    highLightSelected();
  };

  onMounted(() => refresh());
</script>
<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>
