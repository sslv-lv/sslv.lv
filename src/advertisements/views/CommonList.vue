<script lang="ts" setup>
import { ref, onMounted, computed, onUnmounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { collection, query, where, getDocs, orderBy, startAfter, limit } from 'firebase/firestore'
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { useUserStore } from '@/common/stores/userStore'

interface Advertisement {
  id?: string
  title: string
  category: string
  subcategory: string
  images: string[]
  description: string
  price: number
  visitors: number
  created: number
}

interface Field {
  name: string
  type: string
}

interface Subcategory {
  name: string
  fields: Field[]
}
interface Category {
  name: string
  subcategories: Subcategory[]
}

const advertisements = ref<Advertisement[]>([])
const fields = ref<Field[]>([])
const db = useFirestore()
const route = useRoute()
const userStore = useUserStore()
const selectedSort = ref('newest') // Default sort
const lastVisible = ref<QueryDocumentSnapshot<DocumentData> | null>(null)
const allAdsLoaded = ref(false)
const listingsRef = collection(db, 'listings')
const filters = ref<Record<string, string>>({})

const fetchFieldsForCurrentSubcategory = async (categoryName: string, subcategoryName: string) => {
  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, where('name', '==', categoryName));

  try {
    const querySnapshot = await getDocs(q);
    const categoryData = querySnapshot.docs
      .map((doc) => doc.data() as Category)
      .find((cat) => cat.name === categoryName);

    const subcategoryData = categoryData?.subcategories.find((sub) => sub.name === subcategoryName);
    if (subcategoryData && subcategoryData.fields) {
      fields.value = subcategoryData.fields;

      subcategoryData.fields.forEach(field => {
        filters.value[field.name] = '';
      });
    }
  } catch (error) {
    console.error('Error fetching subcategory fields: ', error);
  }
};


const fetchAdvertisements = async (subcategoryName: string) => {
  let q

  if (lastVisible.value) {
    q = query(
      listingsRef,
      where('subcategory', '==', subcategoryName),
      orderBy('created'),
      startAfter(lastVisible.value),
      limit(50)
    )
  } else {
    q = query(
      listingsRef,
      where('subcategory', '==', subcategoryName),
      orderBy('created'),
      limit(50)
    )
  }

  try {
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1]
      advertisements.value.push(
        ...querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Advertisement)
        }))
      )
    } else {
      allAdsLoaded.value = true
    }
  } catch (error) {
    console.error('Error fetching advertisements:', error)
  }
}

const loadMoreAdvertisements = () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
    !allAdsLoaded.value
  ) {
    fetchAdvertisements('subcategoryName')
  }
}

const sortedAndFilteredAdvertisements = computed(() => {
  // First, filter the advertisements
  const filtered = advertisements.value.filter((ad) => {
    return Object.entries(filters.value).every(([key, value]) => {
      // If the filter is empty, do not filter by this property.
      if (value === '') return true;

      // Check if the advertisement has the property and if it includes the filter value.
      return ad[key] !== undefined && ad[key].toString().toLowerCase().includes(value.toLowerCase());
    });
  });

  // Then, sort the filtered advertisements
  switch (selectedSort.value) {
    case 'mostVisitors':
      return filtered.sort((a, b) => b.visitors - a.visitors);
    case 'newest':
      return filtered.sort((a, b) => b.created - a.created);
    case 'cheapest':
      return filtered.sort((a, b) => a.price - b.price);
    default:
      return filtered;
  }
});

const isSidebarVisible = ref(true)

function toggleSidebar() {
  isSidebarVisible.value = !isSidebarVisible.value
}
window.addEventListener('scroll', loadMoreAdvertisements)

onMounted(async () => {
  const subcategoryName = route.params.subCategory as string
  const categoryName = route.params.mainCategory as string

  //FETCH EXTRA FIELDS (Filters)
  await fetchFieldsForCurrentSubcategory(categoryName, subcategoryName)
  await fetchAdvertisements(subcategoryName)
})

onUnmounted(() => {
  window.removeEventListener('scroll', loadMoreAdvertisements)
})


///=====================================FILTERING=======================================

</script>

<template>
  <div class="container-fluid d-flex flex-row h-100">
    <div class="row">
      <!-- Collapsible sidebar content -->
      <div class="sidebar sticky-top" :class="[isSidebarVisible ? 'show' : 'collapse']" id="filterSidebar">
        <div class="position-sticky pt-3 ps-3">
          <h5>Filtri</h5>
          <ul class="nav flex-column">
            <li class="nav-item" v-for="(field, index) in fields" :key="index">
              <label class="nav-link">
                {{ field.name }}
                <input type="text" class="form-control" v-model="filters[field.name]" />
              </label>
            </li>
          </ul>
        </div>
      </div>

    </div>
    <main class="flex-grow-1 listing-container">
      <h1 class="ps-4">Sludinājumi</h1>
      <div class="d-flex justify-content-end">
        <RouterLink :to="{ name: 'AdCreation' }">
          <button type="button" class="btn custom-btn">Ievietot sludinājumu</button>
        </RouterLink>
      </div>




      <div class="container mt-4">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: selectedSort === 'newest' }"
              @click.prevent="selectedSort = 'newest'">Jaunākie</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: selectedSort === 'mostVisitors' }"
              @click.prevent="selectedSort = 'mostVisitors'">Skatītākie</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: selectedSort === 'cheapest' }"
              @click.prevent="selectedSort = 'cheapest'">Lētākie</a>
          </li>
        </ul>
        <div v-if="sortedAndFilteredAdvertisements.length > 0">
          <div class="list-group rounded-bottom">
            <router-link v-for="ad in sortedAndFilteredAdvertisements" :key="ad.id"
              :to="`/${ad.category}/${ad.subcategory}/${ad.id}`"
              class="list-group-item list-group-item-action d-flex align-items-center">
              <img v-if="ad.images && ad.images.length > 0" :src="ad.images[0]" class="img-fluid rounded-start"
                alt="Advertisement image" style="width: 100px; height: auto" />
              <div class="ms-3 me-auto">
                <div class="fw-bold">{{ ad.title }}</div>
                <div class="description-wrapper">
                  <p class="ad-description">{{ ad.description }}</p>
                </div>
                <span class="badge my-custom-bg rounded-pill mx-3">{{ ad.price }}€</span>
                <span class="badge my-custom-bg rounded-pill">Rakstīt</span>
              </div>
            </router-link>
          </div>
        </div>
        <div v-else class="h3 fw-bold">Nav neviena sludinājuma</div>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
#app {
  margin: 0;
  padding: 0;
  max-width: initial;
  flex-grow: 1;
}

.listing-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-weight: bold;
  font-style: italic;
  color: var(--c-platinum);
}

.nav-link {
  color: var(--c-white);

  &:hover {
    background-color: var(--c-platinum);
    color: var(--color-background);
  }
}

.list-group-item {
  height: 120px;
  overflow: hidden;
  position: relative;
}

.description-wrapper {
  max-height: 50px;
  overflow: hidden;
  position: relative;
}

.description-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
}

.container-lg {
  min-width: 1024px;
  max-width: 1280px;
  margin-top: 50px;
  background: linear-gradient(to bottom, var(--c-platinum), var(--color-background));

  border-radius: 15px;
  clear: both;
}

main {
  padding-left: 15px;
}

.sidebar {
  padding-top: 70px;
  z-index: 100;
  transition: all 0.3s ease;
  background-color: var(--c-platinum);
}

.filter-toggle-button {
  position: absolute;
  top: 50%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  z-index: 1020;
  background-color: #748cab;
  border: none;
  transition: left 0.3s;
}

.custom-btn {
  background-color: #748cab;
  color: white;
}

.custom-btn:hover {
  background-color: #3e5c76;
  color: #fff;
}

.nav-link {
  color: #748cab;
}

.my-custom-bg {
  background-color: #1d2d44;
}

.filter-menu {
  background-color: #f8f9fa;
}
</style>
