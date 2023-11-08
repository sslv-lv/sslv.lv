<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/common/stores/userStore'
import { User } from '../models/userModels'

const userStore = useUserStore()

function alert(a: string) {
  window.alert(a)
}
</script>

<template>
  <header class="navbar fixed-top navbar-expand-sm">
    <div class="container-fluid">
      <div class="navbar-brand">
        <RouterLink to="/"> <span>SSLV.LV</span> </RouterLink>
      </div>
      <ul class="navbar-nav flex-grow-1 justify-content-between">
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
        <li class="nav-item">
          <a v-if="!userStore.isLoggedIn" class="nav-link text-center" @click="userStore.loginModalVisible = true">
            Ienākt
          </a>
          <template v-else>
            <span>Sveiks {{ userStore.currentUser.name }}</span>
            <a class="nav-link text-center" @click="userStore.currentUser = new User()"> Iziet </a>
          </template>
        </li>
      </ul>
      <form class="d-flex ms-3" role="search">
        <input class="form-control me-2" type="search" placeholder="Meklēt" aria-label="Meklēt" />
        <button class="btn btn-outline-success" type="submit" @click="alert('Meklējam kaut ko')">
          Meklēt
        </button>
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
