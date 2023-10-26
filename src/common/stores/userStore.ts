import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { User } from '../models/userModels'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({})
  const isLoggedIn = computed(() => currentUser.value instanceof User)

  const setUser = (user: User) => {
    currentUser.value = user
  }

  return { currentUser, isLoggedIn, setUser }
})
