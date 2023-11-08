<script setup lang="ts">

</script>

<template>
  <main>
    <div class="row">
      <div class="col-12">
        <h1>Šeit rādās kategorijas cars sludinājumi</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <RouterLink :to="{ name: 'listing', params: { id: 'someId' } }">
          <div class="btn btn-secondary">Atvērt vienu sludinājumu</div>
        </RouterLink>
      </div>
    </div>
  </main>
</template>