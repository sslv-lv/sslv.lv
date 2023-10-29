import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const toasts: Ref<{ title: string; content: string }[]> = ref([])

  const createToast = (title: string, content: string) => {
    toasts.value.push({ title, content  })
  }

  return { toasts, createToast }
})
