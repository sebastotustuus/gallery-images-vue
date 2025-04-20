import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import GalleryPage from '../features/gallery/components/pages/GalleryPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Gallery', component: GalleryPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
