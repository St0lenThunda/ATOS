const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'thoughts', name: 'thoughts', component: () => import('src/pages/ThoughtsRoot.vue') },
      { path: 'api', name: 'apiViewer', component: () => import('src/pages/ApiViewer.vue') },
      { path: 'beta2', name: 'beta2', component: () => import('src/pages/JsonTreeViewer.vue') },
      { path: 'glossary', name: 'glossary', component: () => import('src/pages/GlossaryPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
