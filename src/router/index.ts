import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainLayoutVue from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayoutVue,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeView
        }
      ]
    }
  ]
})

export default router
