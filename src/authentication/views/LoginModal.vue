<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/common/stores/userStore'
import { User } from '@/common/models/userModels'
import { useToastStore } from '../../common/stores/toastStore'
import { CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter } from '@coreui/bootstrap-vue'
import { getUser } from '@/authentication/services/userService'

let email = ref('')
let password = ref('')
const userStore = useUserStore()
const toastStore = useToastStore()

async function checkCredentials() {
  if (!email.value || !password.value) {
    toastStore.createToast(
      'Autentifikācija neveiksmīga!',
      'Lūdzu ievadi visus nepieciešamos datus!',
      'danger'
    )

    return;
  }

  //Yeah this approach is insecure as fuck, but I couldn't be bothered to setup a proper backend
  const userSnapshot = await getUser(email.value, password.value)

  if (userSnapshot.empty) {
    toastStore.createToast(
      'Autentifikācija neveiksmīga!',
      'Pārbaudi ievadītos datus un mēģini velreiz!',
      'danger'
    )
  } else {
    const user = userSnapshot.docs[0].data()

    userStore.setUser(new User(user))
    userStore.loginModalVisible = false
  }
}

function switchToRegistration() {
  userStore.loginModalVisible = false
  userStore.registrationModalVisible = true
}
</script>

<template>
  <CModal
    alignment="center"
    :visible="userStore.loginModalVisible"
    @close="userStore.loginModalVisible = false"
  >
    <CModalHeader>
      <CModalTitle> Ienāc SSLV.LV </CModalTitle>
    </CModalHeader>

    <CModalBody>
      <label class="fw-bold">E-pasts</label>
      <input
        class="form-control my-1"
        v-model="email"
        type="email"
        placeholder="Ievadi savu e-pastu"
      />

      <label class="fw-bold">Parole</label>
      <input
        class="form-control mt-1"
        v-model="password"
        type="password"
        placeholder="Ievadi savu paroli"
      />
    </CModalBody>

    <CModalFooter>
      <div class="d-grid gap-2 w-100">
        <button class="btn btn-block btn-login" @click="checkCredentials()">Ienākt</button>
        <button class="btn btn-block btn-login" @click="switchToRegistration()">
          Reģistrēties
        </button>
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

  .btn-login {
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
