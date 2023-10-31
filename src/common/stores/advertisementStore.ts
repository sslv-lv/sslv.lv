import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { User } from '../models/advertisementModels'

export const useUserStore = defineStore('user', () => {
  const currentAdvertisement = ref({})
  const isLoggedIn = computed(() => currentAdvertisement.value instanceof Advertisement)

  const setUser = (user: User) => {
    currentAdvertisement.value = user
  }

  return { currentUser, isLoggedIn, setUser }
})
