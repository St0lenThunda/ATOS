import { defineBoot } from '#q-app/wrappers'
import VuePlugin from '@quasar/quasar-ui-qmarkdown'
import '@quasar/quasar-ui-qmarkdown/dist/index.css'


// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(({ app} ) => {
  app.use(VuePlugin)
})
