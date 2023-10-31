<script setup lang="ts">
import { ref } from 'vue'
import { useFirestore } from 'vuefire'
import { collection, getDocs } from 'firebase/firestore'
import { Category } from '../common/models/categoryModels'

// FETCH ALL CATEGORIES AND SUBCATEGORIES
const categories = ref<Category[]>([]);

const db = useFirestore()
getDocs(collection(db, 'categories')).then((docs) => {
  docs.forEach((doc) => {
    categories.value.push({
      name: doc.data().name,
      iconUrl: doc.data().iconUrl,
      subCategories: doc.data().subcategories
    });
  });
});

</script>

<template>
  <div class="d-flex justify-content-center">
    <div class="container-lg m shadow p-5">
      <h1>SSLV</h1>
      <p>Tavs ceļš uz lieliskiem ātrajdiem un grandiozām pārdošanām!</p>

      <div class="row d-flex">
        <div class="col-md-4 d-flex flex-column" v-for="category in categories" :key="category.name">
          <div class="card mb-3 flex-grow-1 position-relative">
            <img :src="`../common/assets/icons/${category.iconUrl}`" alt="icon" class="card-img-top mx-auto mt-2">
            <div class="card-body">
              <h5 class="card-title">{{ category.name }}</h5>
            </div>
            <div class="submenu bg-light rounded shadow-sm position-absolute top-0 start-0 w-100 h-100">
              <ul class="list-unstyled mb-0 h-100 d-flex flex-column justify-content-center">
                <li v-for="subCategory in category.subCategories" :key="subCategory" class="p-2 border-bottom"
                  @mouseover="hover = true" @mouseleave="hover = false" :class="{ 'bg-secondary text-white': hover }">
                  {{ subCategory.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>


<style>
body {
  background-color: #1d2d44;
  font-family: 'Tahoma', sans-serif;
}
</style>



<style scoped>
.container-lg {
  min-width: 1024px;
  max-width: 1280px;
  margin-top: 100px;
  background: linear-gradient(to bottom, #f0ebd8, #1d2d44);

  border-radius: 15px;
  clear: both;
}

.card {
  border-radius: 12px;
  position: relative;
  transition: filter 0.3s ease;
}

h1 {
  font-weight: bold;
  font-style: italic;
  color: #0d1321;
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
  color: #0d1321;
}

.card .submenu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  z-index: 1;
}

.card:hover .submenu {
  display: block;
  opacity: 0;
  transition: opacity 0.3s;
  opacity: 1;
  filter: none;

}

.card:hover {
  transform: scale(1.05);
  filter: brightness(0.9);
  z-index: 1;
}

.submenu {
  z-index: 2;
  display: none;
}

.submenu li:hover {
  background-color: inherit;
  color: inherit;
}
</style>
