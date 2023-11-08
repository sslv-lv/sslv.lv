<script setup lang="ts">
import { ref } from 'vue'
import { useFirestore } from 'vuefire'
import { collection, getDocs } from 'firebase/firestore'
import { Category } from '@/common/models/categoryModels'
import ChatModal from '@/chat/views/ChatModal.vue'; // Adjust the import path based on your project structure
//import { ChatMessage } from '@/chat/services/types.ts'
// FETCH ALL CATEGORIES AND SUBCATEGORIES
const categories = ref<Category[]>([])
const isChatVisible = ref(false);
//const messages = ref<ChatMessage[]>([]);

const db = useFirestore()
getDocs(collection(db, 'categories')).then((categoryEntries) => {
  categoryEntries.forEach((categoryEntry) => {
    categories.value.push(new Category(categoryEntry.data()))
  })
})

const isHoveringMap = ref<{ [key: string]: boolean }>({})

const toggleChat = () => {
  isChatVisible.value = !isChatVisible.value;
};

const closeChat = () => {
  isChatVisible.value = false;
};
</script>



<template>
  <div class="d-flex justify-content-center">
    <div class="container-lg m shadow p-5">
      <h1>SSLV.LV</h1>
      <p>Tavs ceļš uz ātrākajiem un grandiozākajiem pirkumiem!</p>
      <li class="p-2 border-bottom chat-button" @click="toggleChat">
        <i class="fas fa-comment"></i> Open Chat
      </li>

      <!-- Chat modal -->
      <ChatModal v-if="isChatVisible" @closeChat="closeChat" />

      <div class="row d-flex">
        <div class="col-md-4 d-flex flex-column" v-for="category in categories" :key="category.name">
          <div class="card mb-3 flex-grow-1 position-relative">
            <img :src="`/common/assets/icons/${category.iconUrl}`" alt="icon" class="card-img-top mx-auto mt-2" />
            <div class="card-body">
              <h5 class="card-title">{{ category.name }}</h5>
            </div>
            <div class="submenu bg-light rounded shadow-sm position-absolute top-0 start-0 w-100 h-100">
              <ul class="list-unstyled mb-0 h-100 d-flex flex-column justify-content-center">
                <li v-for="subcategory in category.subcategories" :key="subcategory.name" class="p-2 border-bottom"
                  @mouseover="isHoveringMap[subcategory.name] = true"
                  @mouseleave="isHoveringMap[subcategory.name] = false"
                  :class="{ 'bg-secondary text-white': isHoveringMap[subcategory.name] }">
                  {{ subcategory.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-button {
  cursor: pointer;
  /* Change cursor to pointer on hover */
  transition: background-color 0.3s ease;
  /* Smooth transition for background color change */
}

.chat-button:hover {
  background-color: #0d2335;
  /* Change background color on hover */
  color: white;
  /* Change text color on hover */
  border-color: #2d220b;
  /* Change border color on hover */
}

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
