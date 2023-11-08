<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/common/stores/userStore'
import { User } from '@/common/models/userModels'
import { useToastStore } from '@/common/stores/toastStore'

const userStore = useUserStore()
const toastStore = useToastStore()

function alert(a: string) {
  toastStore.createToast(a, '', 'danger')
}
</script>

<template>
  <header class="navbar fixed-top navbar-expand-sm">
    <div class="container-fluid">
      <div class="navbar-brand">
        <RouterLink to="/"> <span>SSLV.LV</span> </RouterLink>
      </div>
      <ul class="navbar-nav flex-grow-1 d-flex">
        <li class="nav-item">
          <RouterLink to="/">
            <a class="nav-link active text-center" aria-current="page" href="#"> Sākums </a>
          </RouterLink>
        </li>
        <li v-if="userStore.isLoggedIn" class="nav-item">
          <RouterLink :to="{ name: 'AdCreation' }">
            <a class="nav-link active text-center" aria-current="page"> Ievietot sludinājumu </a>
          </RouterLink>
        </li>
        <li class="flex-grow-1"><!-- spacer --></li>
        <li v-if="!userStore.isLoggedIn" class="nav-item">
          <a class="nav-link text-center" @click="userStore.loginModalVisible = true"> Ienākt </a>
        </li>
        <template v-else>
          <li class="nav-item d-flex align-items-center">
            <div class="mb-0 me-3 fw-bold">Sveiks {{ userStore.currentUser.name }}!</div>
          </li>
          <li class="nav-item">
            <a class="nav-link text-center" @click="userStore.currentUser = new User()"> Iziet </a>
          </li>
        </template>
      </ul>
      <form class="d-flex ms-3" role="search" @submit.prevent="alert('Not yet implemented')">
        <input class="form-control me-2" type="search" placeholder="Meklēt" aria-label="Meklēt" />
        <button class="btn btn-outline-dark" type="submit">Meklēt</button>
      </form>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  background-color: var(--c-platinum);

  * {
    text-decoration: none;
  }

  .navbar-brand a {
    color: var(--color-heading) !important;
    font-style: italic;
  }
  .nav-item a {
    color: var(--color-heading) !important;
    transition: 0.4s;

    &:hover {
      background-color: color-mix(in srgb, var(--c-platinum), #000 15%);
    }
  }
}
</style>
