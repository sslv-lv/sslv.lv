<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteHeader from '@/common/components/SiteHeader.vue'
import LoginModal from '@/authentication/views/LoginModal.vue';
import ToastProvider from '@/common/components/ToastProvider.vue';
import RegistrationModal from '@/authentication/views/RegistrationModal.vue';
</script>

<template>
  <SiteHeader />
  <RouterView />
  <LoginModal />
  <RegistrationModal />
  <ToastProvider />
</template>