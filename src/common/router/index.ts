import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/common/views/HomeView.vue'
import ListingView from '@/adverisements/views/ListingView.vue'
import CommonList from "@/adverisements/views/CommonList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/category/:name',
      name: 'category',
      component: CommonList
    },
    {
      path: '/listing/:id',
      name: 'listing',
      component: ListingView
    },
    {
      // Catch-all redirect for 404, this has to stay last in array
      path: "/:pathMatch(.*)*",
      name: 'not-found',
      redirect: 'home',
    }
  ]
})

export default router
