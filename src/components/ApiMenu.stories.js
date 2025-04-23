import APIMenu from './ApiMenu.vue';
export default {
  component: ApiMenu,
  
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
// export const MenuApi = {
//   render: ( args ) => ( {
//     components: { ApiMenu },
//     setup () {
//       return { args };
//     },
//     template: '<ApiMenu v-bind="args" />',
//   } ),
//   args: {
//     show: true,
//     readOnly: true,
//   },
// };
