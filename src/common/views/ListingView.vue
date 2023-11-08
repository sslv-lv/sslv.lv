<template>
  <div class="ad-creation">
    <fieldset>
      <div v-if="listing">
        <h1>{{ listing.title }}</h1>

        <div v-if="listing.images.length > 0" class="image-preview">
          <img :src="currentImageUrl" alt="Selected image">
          <div class="image-viewer">
            <button v-if="listing.images.length > 1" @click="showPreviousImage"
              :disabled="currentImageIndex === 0">Iepriekšējā</button>
            <button v-if="listing.images.length > 1" @click="showNextImage"
              :disabled="currentImageIndex === listing.images.length - 1">Nākamā</button>
          </div>
        </div>

        <p class="price">Cena: {{ listing.price }}</p>

        <p class="description">{{ listing.description }}</p>

        <div class="email-button">
          <button @click="emailListingAuthor">Rakstīt sludinājuma autoram!</button>
        </div>
      </div>
      <div v-else>
        Loading...
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
  font-size: 2em;
  margin-bottom: 20px;
}

fieldset {
  border: none;
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

.image-viewer button:disabled {
  color: gray;
}

.price {
  font-size: 1.2em;
  margin-top: 20px;
  margin-bottom: 10px;
}

.description {
  font-weight: semi-bold;
  margin-top: 20px;
  font-size: 1.3em;
}

button {
  background-color: #5a9bcf;
  color: white;
  cursor: pointer;
  border: 2px solid #5a9bcf;
}

.email-button {
  width: 600px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>


<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useFirestore } from 'vuefire';
import { doc, getDoc } from 'firebase/firestore';
import type { Listing } from '@/common/models/listingModels';

export default {
  setup() {
    const route = useRoute();
    const db = useFirestore();
    const listing = ref<Listing | null>(null);
    const currentImageIndex = ref(0);

    const currentImageUrl = computed(() => {
      if (listing.value) {
        return listing.value.images[currentImageIndex.value];
      }
      return '';
    });

    function showNextImage() {
      if (listing.value && currentImageIndex.value < listing.value.images.length - 1) {
        currentImageIndex.value++;
      }
    }

    function showPreviousImage() {
      if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
      }
    }

    function emailListingAuthor() {
      if (listing.value) {
        const subject = encodeURIComponent(`Inquiry about ${listing.value.title}`);
        window.location.href = `mailto:${listing.value.user}?subject=${subject}`;
      }
    }

    onMounted(async () => {
      const id = route.params.id;
      const mainCategory = route.params.mainCategory;
      const subCategory = route.params.subCategory;

      try {
        const listingRef = doc(db, `listings/${id}`);
        const listingDoc = await getDoc(listingRef);
        if (listingDoc.exists()) {
          listing.value = {
            id: listingDoc.id,
            ...listingDoc.data(),
          } as Listing;
        } else {
          console.error('No such listing!');
        }
      } catch (error) {
        console.error('Error getting listing:', error);
      }
    });

    return {
      listing,
      currentImageUrl,
      showNextImage,
      showPreviousImage,
      currentImageIndex,
      emailListingAuthor
    };
  }
}
</script>
