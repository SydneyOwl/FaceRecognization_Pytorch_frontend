import { createRouter, createWebHistory } from 'vue-router'
import UploadVideo from '@/components/UploadVideo.vue'
import { apiTestAuth } from '../apis/login'
const routes = [
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    alias: '/workspace',
    component: () => import('../views/WorkSpace.vue'),
    children: [
      { path: 'upload', component: UploadVideo },
      {
        path: 'rtcam',
        component: () => import('../components/RealTimeVideo.vue'),
      },
      {
        path: 'history',
        component: () => import('../components/History.vue'),
      },
      {
        path: 'settings',
        component: () => import('../components/Settings.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  const res = await apiTestAuth()
  if (res.data.status == 300 && to.path != '/login') {
    return { path: '/login' }
  }
})
export { router }
