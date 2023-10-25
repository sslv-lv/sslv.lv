<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <span>Sākums</span>
    <span>Mani sludinājumi</span>
    <span>Par mums</span>
    <span>Cenas</span>
    <span>Ienākt</span>
    <span>Admin</span>
    <input type="text" placeholder="Meklēt" />
    <RouterLink to="/"><button>Meklēt</button></RouterLink>
  </header>
</template>

<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: black;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;

  span {
    margin-right: 20px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: gray;
    }
  }

  input {
    padding: 5px 10px;
    border: 1px solid #d1d1d1;
    border-radius: 4px;
  }

  button {
    padding: 5px 15px;
    background-color: blue;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: darkblue;
    }
  }
}
</style>
