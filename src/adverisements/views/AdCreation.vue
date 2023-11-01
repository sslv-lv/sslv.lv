<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFirestore } from 'vuefire';
import { Category } from '@/common/models/categoryModels';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, getStorage, ref as firebaseRef } from 'firebase/storage';

const db = useFirestore();
const storage = getStorage();

const categories = ref<Category[]>([]);
const selectedCategory = ref<string | null>(null);
const selectedSubcategory = ref<string | null>(null);
const title = ref('');
const description = ref('');
const price = ref<number | null>(null);
const images = ref<File[]>([]);
const currentImageIndex = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);

async function fetchCategories() {
  try {
    const categoryEntries = await getDocs(collection(db, 'categories'));
    categories.value = categoryEntries.docs.map((doc) => new Category(doc.data()));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
}

fetchCategories();

const subcategories = computed(() => {
  const category = categories.value.find((cat) => cat.name === selectedCategory.value);
  return category?.subcategories.map((sub) => sub.name) || [];
});

const currentImageUrl = computed(() => {
  const image = images.value[currentImageIndex.value];
  return image ? URL.createObjectURL(image) : '';
});

const hasMultipleImages = computed(() => images.value.length > 1);

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    images.value = [...images.value, ...Array.from(target.files)];
    target.value = '';
  }
}

function deleteImage(index: number) {
  images.value.splice(index, 1);
  if (currentImageIndex.value >= images.value.length && images.value.length > 0) {
    currentImageIndex.value--;
  }
}

function showNextImage() {
  if (currentImageIndex.value < images.value.length - 1) currentImageIndex.value++;
}

function showPreviousImage() {
  if (currentImageIndex.value > 0) currentImageIndex.value--;
}

function triggerFileInput() {
  fileInput.value?.click();
}

async function uploadImage(file: File) {
  const uniqueName = new Date().getTime() + '_' + file.name;  // Adding a timestamp to ensure uniqueness
  const storageReference = firebaseRef(storage, `images/${uniqueName}`);
  await uploadBytes(storageReference, file);
  return getDownloadURL(storageReference);
}

async function submitForm() {
  try {
    const imageUrlPromises = images.value.map(img => uploadImage(img));
    const uploadedImageUrls = await Promise.all(imageUrlPromises);

    const listingData = {
      category: selectedCategory.value,
      created: Timestamp.fromDate(new Date()),  // changed from new Date().toISOString()
      description: description.value,
      images: uploadedImageUrls,
      last_edit: Timestamp.fromDate(new Date()),  // changed from new Date().toISOString()
      price: price.value,
      status: "active",
      subcategory: selectedSubcategory.value,
      title: title.value,
      user: "1" // TODO: Replace with the real userID once you have authentication in place
    };

    await addDoc(collection(db, 'listings'), listingData);
    console.log("Listing added successfully");
  } catch (error) {
    console.error("Error adding listing:", error);
  }
}
</script>

<template>
  <div class="ad-creation">
    <h1>Sludinājuma informācija</h1>
    <fieldset>
      <div class="form-group">
        <label for="categories">Galvenā kategorija:</label>
        <select v-model="selectedCategory" id="categories">
          <option disabled value="" selected>Lūdzu izvēlieties vienu</option>
          <option v-for="category in categories" :key="category.name" :value="category.name">{{ category.name }}</option>
        </select>
      </div>
      <div v-if="subcategories.length > 0" class="form-group">
        <label for="subcategories">Apakškategorija:</label>
        <select v-model="selectedSubcategory" id="subcategories">
          <option disabled value="" selected>Lūdzu izvēlieties vienu</option>
          <option v-for="subcategory in subcategories" :key="subcategory" :value="subcategory">{{ subcategory }}</option>
        </select>
      </div>
      <div v-if="selectedSubcategory">
        <div class="form-group">
          <label for="title">Apraksts īsumā:</label>
          <input type="text" id="title" v-model="title" required>
        </div>
        <div class="form-group">
          <label for="images">Bildes:</label>
          <button @click="triggerFileInput">Pievienot bildes</button>
          <input ref="fileInput" type="file" id="images" @change="onFileChange" multiple accept="image/jpeg, image/png"
            hidden>
        </div>
        <div v-if="images.length > 0" class="image-preview">
          <img :src="currentImageUrl" alt="Selected image">
          <div class="image-viewer">
            <button v-if="images.length > 1" @click="showPreviousImage"
              :disabled="currentImageIndex === 0">Iepriekšējā</button>
            <button v-if="images.length > 1" @click="showNextImage"
              :disabled="currentImageIndex === images.length - 1">Nākamā</button>
          </div>
          <div class="selected-images">
            <div v-for="(image, index) in images" :key="index" class="selected-image">
              <span>{{ image.name }}</span>
              <button @click="deleteImage(index)" class="delete-button">Noņemt</button>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="price">Cena:</label>
          <input type="number" id="price" v-model="price" required>
        </div>
        <div class="form-group">
          <label for="description">Apraksts garumā:</label>
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
  color: #5a9bcf;
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
  border-bottom: 2px solid #5a9bcf;
  background-color: transparent;
  color: #5a9bcf;
}

button {
  background-color: #5a9bcf;
  color: white;
  cursor: pointer;
  border: 2px solid #5a9bcf;
}

button.submit-button {
  border: 2px solid #5a9bcf;
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
