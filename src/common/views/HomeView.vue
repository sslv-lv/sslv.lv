<script setup lang="ts">

</script>

<template>
  <main>
    <div class="row">
      <div class="col-12">
        <h1>Šeit rādās visas kategorijas</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <RouterLink :to="{ name: 'category', params: { name: 'cars' } }">
          <div class="btn btn-secondary">Atvērt kategorijas sludinājumu sarakstu</div>
        </RouterLink>
      </div>
    </div>
  </main>
</template>
