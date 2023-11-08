import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/common/views/HomeView.vue';
import ListingView from '@/common/views/ListingView.vue';
import CommonList from "@/advertisements/views/CommonList.vue";
import AdCreation from '@/advertisements/views/AdCreation.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:mainCategory/:subCategory',
      name: 'category',
      component: CommonList
    },
    {
    path: '/advertisements/create',
    name: 'AdCreation',
    component: AdCreation,
    },
    {
      path: '/:mainCategory/:subCategory/:id',
      name: 'Listing',
      component: ListingView,
      props: true
    },
    {
      // Catch-all redirect for 404, this has to stay last in array
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ]
})

export default router
