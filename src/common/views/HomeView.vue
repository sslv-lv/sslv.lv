<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFirestore } from 'vuefire'
import { collection, getDocs } from 'firebase/firestore'
import { Category } from '@/common/models/categoryModels'
// FETCH ALL CATEGORIES AND SUBCATEGORIES
const categories = ref<Category[]>([])
const db = useFirestore()

onMounted(() => {
  getDocs(collection(db, 'categories')).then((categoryEntries) => {
    categoryEntries.forEach((categoryEntry) => {
      categories.value.push(new Category(categoryEntry.data()))
    })
  })
})

const isHoveringMap = ref<{ [key: string]: boolean }>({})
</script>

<template>
  <div class="d-flex justify-content-center">
    <div class="container-lg m shadow p-5">
      <h1>SSLV.LV</h1>
      <p>Tavs ceļš uz ātrākajiem un grandiozākajiem pirkumiem!</p>
      <div class="row d-flex">
        <div
          class="col-md-4 d-flex flex-column"
          v-for="category in categories"
          :key="category.name"
        >
          <div class="card mb-3 flex-grow-1 position-relative">
            <img
              :src="`/common/assets/icons/${category.iconUrl}`"
              alt="icon"
              class="card-img-top mx-auto mt-2"
            />
            <div class="card-body">
              <h5 class="card-title">{{ category.name }}</h5>
            </div>
            <div
              class="submenu bg-light rounded shadow-sm position-absolute top-0 start-0 w-100 h-100"
            >
              <ul class="list-unstyled mb-0 h-100 d-flex flex-column justify-content-center">
                <RouterLink
                  v-for="subcategory in category.subcategories"
                  :key="subcategory.name"
                  :to="`/${category.name}/${subcategory.name}`"
                >
                  <li
                    class="p-2 border-bottom no-underline"
                    @mouseover="isHoveringMap[subcategory.name] = true"
                    @mouseleave="isHoveringMap[subcategory.name] = false"
                    :class="{ 'bg-secondary text-white': isHoveringMap[subcategory.name] }"
                  >
                    {{ subcategory.name }}
                  </li>
                </RouterLink>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container-lg {
  min-width: 1024px;
  max-width: 1280px;
  margin-top: 100px;
  background: linear-gradient(to bottom, var(--c-platinum), var(--color-background));

  border-radius: 15px;
  clear: both;
}

.card {
  border-radius: 12px;
  position: relative;
  transition: filter 0.3s ease;

  .submenu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: var(--c-white);
    border: 1px solid var(--c-white-mute);
    z-index: 1;
  }

  &:hover {
    transform: scale(1.05);
    filter: brightness(0.9);
    z-index: 1;

    .submenu {
      display: block;
      opacity: 0;
      transition: opacity 0.3s;
      opacity: 1;
      filter: none;
    }
  }
}

.no-underline {
  text-decoration: none;
  color: #0d1321;
}

h1 {
  font-weight: bold;
  font-style: italic;
  color: var(--c-text-light-1);
}

.card-img-top {
  width: 100px;
  height: 100px;
}

.container.shadow {
  box-shadow: 0 4px 8px #000;
}

.card-title {
  font-weight: bold;
  font-style: italic;
  color: var(--c-primary-blue-extra-dark);
}

.submenu {
  z-index: 2;
  display: none;

  li:hover {
    background-color: inherit;
    color: inherit;
  }
}
</style>
