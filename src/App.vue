<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SiteHeader from './common/components/SiteHeader.vue'
import { useFirestore } from 'vuefire'
import { collection, getDocs } from 'firebase/firestore'
import Login from './authentication/views/Login.vue';

const db = useFirestore()
getDocs(collection(db, 'users')).then((docs) =>
  docs.forEach((doc) => {
    console.log(doc.id)
    console.table(doc.data())
  })
)
</script>

<template>
  <SiteHeader />
  <RouterView />
  <Login />
</template>