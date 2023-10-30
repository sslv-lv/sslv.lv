<script setup lang="ts">
import { CToaster, CToast, CToastHeader, CToastBody } from '@coreui/bootstrap-vue'
import { useToastStore } from '@/common/stores/toastStore'

const toastStore = useToastStore()
</script>

<template>
  <CToaster placement="top-end">
    <CToast v-for="(toast, index) in toastStore.toasts" class="bg-white" :key="index">
      <CToastHeader closeButton class="bg-opacity-25" :class="`bg-${toast.type}`">
        <span class="me-auto lead text-body-emphasis">{{ toast.title }}</span>
      </CToastHeader>
      <CToastBody class="bg-opacity-10" :class="`bg-${toast.type}`">
        {{ toast.content }}
      </CToastBody>
    </CToast>
  </CToaster>
</template>
