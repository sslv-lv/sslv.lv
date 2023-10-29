<script setup lang="ts">
import { RouterLink } from 'vue-router'
function alert(a: string) {
  window.alert(a)
}
</script>

<template>
  <header class="navbar fixed-top navbar-expand-lg bg-secondary-subtle">
    <div class="container-fluid">
      <div class="navbar-brand">
        <RouterLink to="/"> <span>SSLV.LV</span> </RouterLink>
      </div>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/">
              <a class="nav-link active" aria-current="page" href="#"> Sākums </a>
            </RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="modal" data-bs-target="#loginModal" href="#">
              Ienākt
            </a>
          </li>
        </ul>
      </div>
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Meklēt" aria-label="Meklēt" />
        <button class="btn btn-outline-success" type="submit" @click="alert('Meklējam kaut ko')">
          Meklēt
        </button>
      </form>
    </div>
  </header>
</template>

<style lang="scss" scoped>
</style>
