import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const toasts: Ref<{ title: string; content: string; type: string }[]> = ref([])

  const createToast = (title: string, content: string, type: string = 'info') => {
    toasts.value.push({ title, content, type })
  }

  return { toasts, createToast }
})
