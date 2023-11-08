<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFirestore } from 'vuefire'
import { useRouter } from 'vue-router'
import { Category } from '@/common/models/categoryModels'
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore'
import { uploadBytes, getDownloadURL, getStorage, ref as firebaseRef } from 'firebase/storage'
import { useUserStore } from '@/common/stores/userStore'

const db = useFirestore()
const storage = getStorage()
const userStore = useUserStore()
const router = useRouter()

const categories = ref<Category[]>([])
const selectedCategory = ref<string | null>(null)
const selectedSubcategory = ref<string | null>(null)
const title = ref('')
const description = ref('')
const price = ref<number | null>(null)
const images = ref<File[]>([])
const currentImageIndex = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)

getDocs(collection(db, 'categories'))
  .then((entries) => (categories.value = entries.docs.map((doc) => new Category(doc.data()))))
  .catch((e) => console.error('Failed to fetch categories:', e))

const subcategories = computed(() => {
  const category = categories.value.find((cat) => cat.name === selectedCategory.value)
  return category?.subcategories.map((sub) => sub.name) || []
})

const currentImageUrl = computed(() => {
  const image = images.value[currentImageIndex.value]
  return image ? URL.createObjectURL(image) : ''
})

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    images.value = [...images.value, ...Array.from(target.files)]
    target.value = ''
  }
}

function deleteImage(index: number) {
  images.value.splice(index, 1)
  if (currentImageIndex.value >= images.value.length && images.value.length > 0) {
    currentImageIndex.value--
  }
}

function showNextImage() {
  if (currentImageIndex.value < images.value.length - 1) currentImageIndex.value++
}

function showPreviousImage() {
  if (currentImageIndex.value > 0) currentImageIndex.value--
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function uploadImage(file: File) {
  const uniqueName = new Date().getTime() + '_' + file.name
  const storageReference = firebaseRef(storage, `images/${uniqueName}`)
  await uploadBytes(storageReference, file)
  return getDownloadURL(storageReference)
}

async function submitForm() {
  try {
    const imageUrlPromises = images.value.map((img) => uploadImage(img))
    const uploadedImageUrls = await Promise.all(imageUrlPromises)

    const listingData = {
      category: selectedCategory.value,
      created: Timestamp.fromDate(new Date()),
      description: description.value,
      images: uploadedImageUrls,
      last_edit: Timestamp.fromDate(new Date()),
      price: price.value,
      status: 'active',
      subcategory: selectedSubcategory.value,
      title: title.value,
      user: userStore.currentUser.email
    }

    const docRef = await addDoc(collection(db, 'listings'), listingData) // Capture the DocumentReference
    router.push(`/${listingData.category}/${listingData.subcategory}/${docRef.id}`) // Use router.push without this
  } catch (error) {
    console.error('Error adding listing:', error)
  }
}
</script>

<template>
  <div class="ad-creation">
    <h1 class="my-4">Sludinājuma informācija</h1>
    <fieldset>
      <div class="form-group">
        <label for="categories" class="h5">Galvenā kategorija:</label>
        <select v-model="selectedCategory" id="categories">
          <option disabled value="" hidden selected>Lūdzu izvēlieties vienu</option>
          <option v-for="category in categories" :key="category.name" :value="category.name">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div v-if="subcategories.length > 0" class="form-group">
        <label for="subcategories" class="h5">Apakškategorija:</label>
        <select v-model="selectedSubcategory" id="subcategories">
          <option disabled value="" hidden selected>Lūdzu izvēlieties vienu</option>
          <option v-for="subcategory in subcategories" :key="subcategory" :value="subcategory">
            {{ subcategory }}
          </option>
        </select>
      </div>
      <div v-if="selectedSubcategory">
        <div class="form-group">
          <label for="title" class="h5">Virsraksts:</label>
          <input type="text" id="title" v-model="title" required />
        </div>
        <div class="form-group">
          <label for="images" class="h5 mb-0">Bildes:</label>
          <button @click="triggerFileInput">Izvēlēties bildes</button>
          <input
            ref="fileInput"
            type="file"
            id="images"
            @change="onFileChange"
            multiple
            accept="image/jpeg, image/png"
            hidden
          />
        </div>
        <div v-if="images.length > 0" class="image-preview">
          <img :src="currentImageUrl" alt="Selected image" />
          <div class="image-viewer">
            <button
              v-if="images.length > 1"
              @click="showPreviousImage"
              :disabled="currentImageIndex === 0"
            >
              Iepriekšējā
            </button>
            <button
              v-if="images.length > 1"
              @click="showNextImage"
              :disabled="currentImageIndex === images.length - 1"
            >
              Nākamā
            </button>
          </div>
          <div class="selected-images">
            <div v-for="(image, index) in images" :key="index" class="selected-image">
              <span>{{ image.name }}</span>
              <button @click="deleteImage(index)" class="delete-button">Noņemt</button>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="price" class="h5">Cena:</label>
          <input type="number" id="price" v-model="price" required />
        </div>
        <div class="form-group">
          <label for="description" class="h5">Apraksts:</label>
          <textarea id="description" v-model="description" required></textarea>
        </div>
        <button type="button" @click="submitForm" class="submit-button">Publicēt</button>
      </div>
    </fieldset>
  </div>
</template>

<style scoped>
.ad-creation {
  width: 600px;
  margin: auto;
  color: var(--c-platinum);
  font-size: 1.25rem;
}

h1 {
  text-align: center;
}

fieldset {
  border: none;
}

.form-group {
  margin-bottom: 15px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}

label {
  color: var(--c-platinum);
}

select,
input,
textarea,
button {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
}

select,
input,
textarea {
  border: none;
  border-bottom: 2px solid var(--c-platinum);
  background-color: var(--color-background);
  color: var(--c-platinum);
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 5px;
  background-color: var(--color-background);


}

button {
  background-color: var(--c-platinum);
  color: var(--color-background);
  cursor: pointer;
  border: 2px solid var(--c-platinum);
}

button.submit-button {
  border: 2px solid var(--c-platinum);
}

.image-preview img {
  width: 100%;
  margin: 10px 0;
  display: block;
}

.image-viewer {
  text-align: center;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.image-viewer button {
  width: 100px;
}

.selected-images {
  margin-top: 20px;
}

.selected-image {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.delete-button {
  width: 80px;
  margin-left: 15px;
}

.image-viewer button:disabled {
  color: gray;
}
</style>
