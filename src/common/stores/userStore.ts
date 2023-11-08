import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { User } from '@/common/models/userModels'

export const useUserStore = defineStore('user', () => {
  const localUser = localStorage.getItem('currentUser')

  const currentUser = ref(new User(localUser ? JSON.parse(localUser) : {}))
  const isLoggedIn = computed(() => Boolean(currentUser.value.id))

  const loginModalVisible = ref(false)
  const registrationModalVisible = ref(false)

  const setUser = (user: User) => {
    currentUser.value = user

    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
  }

  return { currentUser, isLoggedIn, setUser, loginModalVisible, registrationModalVisible }
})
