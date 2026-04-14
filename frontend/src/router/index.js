import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/AgentAssistantPage.vue'),
    meta: { title: 'Pando' },
  },
  {
    path: '/agent-assistant',
    name: 'AgentAssistant',
    component: () => import('../views/AgentAssistantPage.vue'),
    meta: { title: '智能助手 - Pando' },
  },
  {
    path: '/settings',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
