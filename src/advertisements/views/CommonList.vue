<script lang="ts" setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
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



const fetchFieldsForCurrentSubcategory = async (categoryName: string, subcategoryName: string) => {
  const categoriesRef = collection(db, 'categories')
  const q = query(categoriesRef, where('name', '==', categoryName))

  try {
    const querySnapshot = await getDocs(q)
    const categoryData = querySnapshot.docs
      .map((doc) => doc.data() as Category)
      .find((cat) => cat.name === categoryName)
    const subcategoryData = categoryData?.subcategories.find((sub) => sub.name === subcategoryName)
    fields.value = subcategoryData ? subcategoryData.fields : []
  } catch (error) {
    console.error('Error fetching subcategory fields: ', error)
  }
}

const applyFilter = (selectedField: Field) => {
  // TODO
}

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

const sortedAdvertisements = computed(() => {
  switch (selectedSort.value) {
    case 'mostVisitors':
      return [...advertisements.value].sort((a, b) => b.visitors - a.visitors)
    case 'newest':
      return [...advertisements.value].sort((a, b) => b.created - a.created)
    case 'cheapest':
      return [...advertisements.value].sort((a, b) => a.price - b.price)
    default:
      return advertisements.value
  }
})

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
</script>

<template>
  <div class="d-flex flex-row">
    <div>
      <!-- Collapsible sidebar content -->
      <div
        :class="['sidebar', 'sticky-top', isSidebarVisible ? 'show' : 'collapse']"
        id="filterSidebar"
      >
        <div class="position-sticky pt-3 ps-3">
          <h5>Filtri</h5>
          <ul class="nav flex-column">
            <li class="nav-item" v-for="(field, index) in fields" :key="index">
              <label class="nav-link">
                {{ field.name }}
                <input
                  type="text"
                  class="form-control"
                  v-model="field.value"
                  @input="applyFilter(field)"
                />
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <main class="flex-grow-1">
      <h1>Sludinājumi</h1>
      <div class="container mt-4">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: selectedSort === 'newest' }"
              @click.prevent="selectedSort = 'newest'"
              >Jaunākie</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: selectedSort === 'mostVisitors' }"
              @click.prevent="selectedSort = 'mostVisitors'"
              >Skatītākie</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: selectedSort === 'cheapest' }"
              @click.prevent="selectedSort = 'cheapest'"
              >Lētākie</a
            >
          </li>
        </ul>
        <div v-if="sortedAdvertisements.length > 0">
          <div class="list-group">
            <router-link
              v-for="ad in sortedAdvertisements"
              :key="ad.id"
              :to="`/${ad.category}/${ad.subcategory}/${ad.id}`"
              class="list-group-item list-group-item-action d-flex align-items-center"
            >
              <img
                v-if="ad.images && ad.images.length > 0"
                :src="ad.images[0]"
                class="img-fluid rounded-start"
                alt="Advertisement image"
                style="width: 100px; height: auto"
              />
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

<style>
h1 {
  font-weight: bold;
  font-style: italic;
  color: #0d1321;
}

.nav-link {
  color: #1d2d44;
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


.my-custom-bg {
  background-color: #1d2d44;
}

.filter-menu {
  background-color: #f8f9fa;
}
</style>
