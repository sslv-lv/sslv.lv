<script setup lang="ts">
import { Timestamp, doc, addDoc, collection } from 'firebase/firestore'
import { ref } from 'vue'
import { useFirestore } from 'vuefire'
import { useUserStore } from '@/common/stores/userStore'
import { User } from '@/common/models/userModels'
import { useToastStore } from '@/common/stores/toastStore'
import { CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter } from '@coreui/bootstrap-vue'
import { getUser } from '@/authentication/services/userService'
import { userConverter } from '@/common/models/userModels';

let user = ref(new User())

const db = useFirestore()
const userStore = useUserStore()
const toastStore = useToastStore()

async function register() {
  if (!user.value.email || !user.value.name || !user.value.password) {
    toastStore.createToast(
      'Lietotāja izveide neveiksmīga!',
      'Lūdzu ievadi visus nepieciešamos datus',
      'danger'
    )

    return;
  }

  const userSnapshot = await getUser(user.value.email)

  if (!userSnapshot.empty) {
    toastStore.createToast(
      'Lietotāja izveide neveiksmīga!',
      'Lietotājs ar šādu e-pastu jau eksistē',
      'danger'
    )
  } else {
    user.value.createdAt = Timestamp.fromDate(new Date())

    const userDoc = await addDoc(collection(db, 'users').withConverter(userConverter), user.value)

    user.value.id = userDoc.id
    userStore.setUser(user.value)
  
    userStore.registrationModalVisible = false
  }
}

function switchToLogin() {
  userStore.registrationModalVisible = false
  userStore.loginModalVisible = true
}
</script>

<template>
  <CModal
    alignment="center"
    :visible="userStore.registrationModalVisible"
    @close="switchToLogin()"
  >
    <CModalHeader>
      <CModalTitle> Ienāc SSLV.LV </CModalTitle>
    </CModalHeader>

    <CModalBody>
      <label class="fw-bold">Vārds</label>
      <input
        class="form-control my-1"
        v-model="user.name"
        type="email"
        placeholder="Ievadi savu vārdu"
      />

      <label class="fw-bold">E-pasts</label>
      <input
        class="form-control my-1"
        v-model="user.email"
        type="email"
        placeholder="Ievadi savu e-pastu"
      />

      <label class="fw-bold">Parole</label>
      <input
        class="form-control mt-1"
        v-model="user.password"
        type="password"
        placeholder="Ievadi savu paroli"
      />
    </CModalBody>

    <CModalFooter>
      <div class="d-grid gap-2 w-100">
        <button class="btn btn-block btn-register" @click="register()">Reģistrēties</button>
      </div>
    </CModalFooter>
  </CModal>
</template>

<style lang="scss">
.modal-content {
  background-color: var(--c-platinum);
  color: var(--c-oxford-blue);

  .form-contol {
    color: var(--c-orange-web);
  }

  .btn-register {
    background-color: var(--c-oxford-blue);
    color: var(--c-white);

    &:hover,
    &:active {
      background-color: color-mix(in srgb, var(--c-oxford-blue), #fff 15%);
      color: var(--c-white);
    }
  }
}
</style>