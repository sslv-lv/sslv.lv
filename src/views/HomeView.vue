<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFirestore } from 'vuefire'
import { collection, getDocs } from 'firebase/firestore'

// FETCH ALL CATEGORIES AND SUBCATEGORIES
const categories = ref<Array<{ name: string, iconURL: string, subCategories: Array<{ name: string, properties: [] }> }>>([]);

const db = useFirestore()
getDocs(collection(db, 'categories')).then((docs) => {
  docs.forEach((doc) => {
    console.log(doc.data());
    categories.value.push({
      name: doc.data().name,
      iconURL: doc.data().icon_url,
      subCategories: doc.data().subcategories
    });
  });
});


function numberOfRows() {
  let total = categories.value.length;
  let rows = 0;
  while (total > 0) {
    rows++;
    total -= rows + 1; // because we start with 2 columns in the first row
  }
  return rows;
}

function getColumnClass(row: number) {
  return `col-${12 / (row + 2)}`;
}
function getCategory(row: number, col: number) {
  const index = (row * (row + 1)) / 2 + col;
  return categories.value[index];
}



</script>

<template>
  <div class="d-flex justify-content-center">
    <div class="container-lg m shadow p-5">
      <h1>SSLV</h1>
      <p>Tavs ceļš uz lieliskiem ātrajdiem un grandiozām pārdošanām!</p>

      <div class="row d-flex">
        <div class="col-md-4 d-flex flex-column" v-for="category in categories" :key="category.name">
          <div class="card mb-3 flex-grow-1 position-relative"> <!-- Add position-relative here -->
            <img :src="`../common/assets/icons/${category.iconURL}`" alt="icon" class="card-img-top mx-auto mt-2">
            <div class="card-body">
              <h5 class="card-title">{{ category.name }}</h5>
              <a href="#" class="card-link">Action</a>
              <a href="#" class="card-link">Another action</a>
            </div>
            <div class="submenu bg-light rounded shadow-sm position-absolute top-0 start-0 w-100 h-100">
              <!-- Adjusted position and dimensions here -->
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

.card .submenu {
  display: none;
  position: absolute;
  top: 100%;
  /* position it right below the card */
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  z-index: 1;
  /* to ensure it appears above other elements */
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
  /* Higher z-index to make it appear in front */
  display: none;
  /* Initially hide the submenu */
}

.submenu li:hover {
  background-color: inherit;
  color: inherit;
}
</style>
