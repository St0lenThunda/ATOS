

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],

  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
    "@storybook/addon-mdx-gfm"
  ],

  "framework": {
    "name": "@storybook/vue3-vite",
    "options": {
      "docgen": "vue-component-meta",
    }
  },
  "staticDirs": [
    "../public"
  ],
  "core": {
    "builder": "@storybook/builder-vite"
  },

  docs: {
    autodocs: true
  }
};
export default config;
