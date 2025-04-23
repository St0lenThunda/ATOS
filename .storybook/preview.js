/** @type { import('@storybook/vue3').Preview } */
// import '../src/css/app.scss';
// import '../src/css/quasar.variables.scss'
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    decorators: [
      // 👇 Defining the decorator in the preview file applies it to all stories
      ( _, { parameters } ) => {
        // 👇 Make it configurable by reading from parameters
        const { pageLayout } = parameters;
        switch ( pageLayout ) {
          case 'page':
            // Your page layout is probably a little more complex than this ;)
            return { template: '<div class="page-layout"><story/></div>' };
          case 'page-mobile':
            return { template: '<div class="page-mobile-layout"><story/></div>' };
          default:
            // In the default case, don't apply a layout
            return { template: '<story/>' };
        }
      },
    ],
  },
};

export default preview;
