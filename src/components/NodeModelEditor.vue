<template>
  <div class="q-pa-md" dark>
    <div ref="form" class="row">
      <!-- Header Section -->
      <div class="q-gutter-md col-12">
        <q-item-label class="text-h4 text-center">
          <slot name="header"
            >{{ headerText }}:
            <p class="text-h6 text-capitalize text-primary">
              {{ formValues["label"] }}
            </p></slot
          >
        </q-item-label>
      </div>

      <!-- Two-column layout for non-boolean inputs -->
      <div class="row q-gutter-md q-pa-xl text-capitalize items-center">
        <template v-for="(model, modelKey) in store.NodeSchema" :key="modelKey">
          <!-- String Inputs -->
          <template v-if="model.type === 'String'">
            <div class="col-12">
              <q-input
                v-model="formValues[modelKey]"
                :name="modelKey"
                :label="modelKey"
                :hint="model.description"
                dense
                standout="bg-secondary text-white"
                :rules="
                  store.isKeyRequired
                    ? [(val) => !!val || `${modelKey} is required`]
                    : null
                "
              >
                <template #append>
                  <template v-if="modelKey === 'icon' || modelKey === 'avatar'">
                    <q-icon name="apps" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <IconPicker v-model="formValues[modelKey]" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-else-if="modelKey === 'iconColor'">
                    <q-icon name="colorize" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-scroll-area style="width: 400px; height: 400px">
                          <div class="row justify-evenly items-center content-stretch">
                            <p class="col-12 text-h6 text-center">Brand Colors</p>
                            <div v-for="(color, idx) in brandColors" :key="idx">
                              <q-btn
                                :label="color"
                                :color="color"
                                @click="formValues.iconColor = color"
                              />
                            </div>
                            <q-separator />
                            <p class="col-12 text-h6 text-center q-pt-lg">
                              Others w/ Gradients
                            </p>
                            <div
                              class="q-gutter-md q-col-gutter-md col-grow"
                              v-for="(color, index) in quasarColors"
                              :key="index"
                            >
                              <q-btn-dropdown
                                split
                                :color="color"
                                :label="color"
                                @click="formValues.iconColor = color"
                              >
                                <q-list bordered>
                                  <template v-for="n in 14" :key="n">
                                    <q-item
                                      :class="backGroundify(color, n)"
                                      @click="
                                        formValues.iconColor = colorGradient(color, n)
                                      "
                                      clickable
                                      v-close-popup
                                    >
                                      <q-item-section>{{
                                        colorGradient(color, n)
                                      }}</q-item-section>
                                    </q-item>
                                  </template>
                                </q-list>
                              </q-btn-dropdown>
                            </div>
                          </div>
                        </q-scroll-area>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </template>
              </q-input>
            </div>
          </template>
        </template>
      </div>

      <!-- Three-column layout for boolean inputs -->
      <div class="row q-gutter-md q-pa-xl">
        <template v-for="(model, modelKey) in store.NodeSchema" :key="modelKey">
          <!-- Boolean Toggles -->
          <template v-if="model.type === 'Boolean'">
            <div class="col-12 col-md-4 text-capitalize text-h6">
              <q-toggle
                v-model="formValues[modelKey]"
                :label="modelKey"
                :name="modelKey"
                color="secondary"
                dense
              />
            </div>
          </template>
        </template>
      </div>

      <!-- Children Section -->
      <div
        v-show="store.nodeHasChildren"
        class="col-12 q-pa-md text-center text-h6 shadow-8"
      >
        <span>Children</span>
        <q-tree :nodes="store.getNodeChildren" node-key="label" dense accordion />
      </div>

      <!-- Submit and Reset Buttons -->
      <div class="row col-12 q-mt-md justify-center">
        <q-btn label="Submit" @click="onSubmit" color="primary" v-close-popup />
        <q-btn
          outline
          label="Reset"
          type="reset"
          @click="resetForm"
          color="primary"
          class="q-ml-sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  // TODO: assess the need for notification on page
  // TODO: solidify form validation
  import { useQuasar } from "quasar";
  import { ref, onMounted, computed } from "vue";
  import { useThoughtStore } from "src/stores/thoughts";
  import IconPicker from "src/components/IconPicker.vue";
  const brandColors = [
    "primary",
    "secondary",
    "accent",
    "dark",
    "positive",
    "negative",
    "info",
    "warning",
  ];
  const quasarColors = [
    "red",
    "pink",
    "purple",
    "deep-purple",
    "indigo",
    "blue",
    "light-blue",
    "cyan",
    "teal",
    "green",
    "light-green",
    "lime",
    "yellow",
    "amber",
    "orange",
    "deep-orange",
    "brown",
    "grey",
    "blue-grey",
  ];

  const $q = useQuasar();
  const form = ref(null);
  const { update, headerText } = defineProps({
    update: {
      type: Boolean,
      default: false,
    },
    headerText: {
      type: String,
      default: "Add New Node",
    },
  });
  const emit = defineEmits(["done"]);
  const store = useThoughtStore();
  const isLoading = ref(false);
  const formValues = computed(() => {
    if (update) return store.selectedNode;
    return store.tempNode;
  });

  const backGroundify = (color, n) => {
    return `bg-${colorGradient(color, n)}`;
  };
  const colorGradient = (color, idx) => {
    return `${color}-${idx}`;
  };
  onMounted(() => {
    store.setNodeDefaults(update);
  });

  const onSubmit = async (evt) => {
    evt.preventDefault();
    if (!formValues.value?.label) {
      $q.notify({ type: "negative", message: "Label is required" });
      return;
    }
    isLoading.value = true;
    try {
      await store.addNode(store.tempNode);
      resetForm();
      emit("done", true);
    } catch (error) {
      $q.notify({ type: "negative", message: "Failed to add node: " + error.message });
    } finally {
      isLoading.value = false;
    }
  };

  const resetForm = () => {
    store.setNodeDefaults();
  };
</script>
