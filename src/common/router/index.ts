import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/common/views/HomeView.vue';
// adverisements is misspelled, should be advertisements
import ListingView from '@/common/views/ListingView.vue';
import CommonList from "@/adverisements/views/CommonList.vue";
import AdCreation from '@/adverisements/views/AdCreation.vue';

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
    },
    {
    path: '/advertisements/create',
    name: 'AdCreation',
    component: AdCreation,
    },
    {
      path: '/:mainCategory/:subCategory/:id',
      name: 'Listing',
      component: () => import('@/common/views/ListingView.vue'),
      props: true
    }
  ]
})

export default router
