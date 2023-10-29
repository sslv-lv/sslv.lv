import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { User } from '@/common/models/userModels'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(new User())
  const isLoggedIn = computed(() => Boolean(currentUser.value.id))

  const loginModalVisible = ref(false)
  const registrationModalVisible = ref(false)

  const setUser = (user: User) => {
    currentUser.value = user
  }

  return { currentUser, isLoggedIn, setUser, loginModalVisible, registrationModalVisible }
})
