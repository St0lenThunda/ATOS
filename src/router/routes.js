const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'thoughts', name: 'thoughts', component: () => import('src/pages/ThoughtsRoot.vue') },
      { path: 'beta', name: 'beta', component: () => import('src/pages/BetaComponent.vue') },
      { path: 'beta2', name: 'beta2', component: () => import('src/pages/JsonTreeViewer.vue') },
      { path: 'beta3', name: 'beta3', component: () => import('src/pages/JsonTreeViewer.vue') },
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
