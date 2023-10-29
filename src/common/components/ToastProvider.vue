<script setup lang="ts">
import { CToaster, CToast, CToastHeader, CToastBody } from '@coreui/bootstrap-vue'
import { useToastStore } from '@/common/stores/toastStore'

const toastStore = useToastStore()
</script>

<template>
  <CToaster placement="top-end">
    <CToast v-for="(toast, index) in toastStore.toasts" :key="index">
      <CToastHeader closeButton>
        <span class="me-auto fw-bold">{{ toast.title }}</span>
      </CToastHeader>
      <CToastBody>
        {{ toast.content }}
      </CToastBody>
    </CToast>
  </CToaster>
</template>
