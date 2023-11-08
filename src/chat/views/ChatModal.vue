<script setup lang="ts">
import { ref, onMounted, watch} from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import { useUserStore } from '@/common/stores/userStore'
import {
  collection,
  query,
  where,
  orderBy,
  type DocumentData,
  type Query,
  Timestamp,
  or,
  and,
} from 'firebase/firestore'
import { User } from '@/common/models/userModels'
import { getUser } from '@/authentication/services/userService'
import { useToastStore } from '../../common/stores/toastStore'
import { addDoc } from 'firebase/firestore'

interface ChatMessage {
  id?: string
  fromUser: string
  toUser: string
  content: string
  createdAt: Timestamp
}

const userStore = useUserStore()
const toastStore = useToastStore()

const isOpen = ref(false)
const hasLoadedMessages = ref(false)
const targetEmail = ref<string>('')
const targetUser = ref<User | null>(null)

const messageQuery = ref<Query<DocumentData, DocumentData> | null>(null)

const messages = useCollection(messageQuery)

const newMessage = ref<string>('')

const db = useFirestore()

const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    const newMessageData = {
      fromUser: userStore.currentUser.id,
      toUser: targetUser.value?.id,
      content: newMessage.value,
      createdAt: Timestamp.fromDate(new Date())
    } as ChatMessage

    await addDoc(collection(db, 'messages'), newMessageData)

    newMessage.value = ''
    scrollToBottom.value()
  }
}

const loadMessages = async () => {
  const targetUserSnapshot = await getUser(targetEmail.value)

  if (targetUserSnapshot.empty) {
    toastStore.createToast(
      'Lietotājs nav atrasts!',
      'Pārbaudi ievadītos datus un mēģini velreiz!',
      'danger'
    )

    return
  }

  targetUser.value = new User(targetUserSnapshot.docs[0].data())
  const categoriesRef = collection(db, 'messages')
  messageQuery.value = query(
    categoriesRef,
    or(
      and(
        where('toUser', '==', targetUser.value.id),
        where('fromUser', '==', userStore.currentUser.id)
      ),
      and(
        where('toUser', '==', userStore.currentUser.id),
        where('fromUser', '==', targetUser.value.id)
      )
    ),
    orderBy('createdAt')
  )

  hasLoadedMessages.value = true
}

const clearMessages = () => {
  hasLoadedMessages.value = false
  messageQuery.value = null
  targetUser.value = null
  targetEmail.value = ''
}

const chatContainer = ref<HTMLElement | null>(null)
let scrollToBottom = ref<CallableFunction>(() => {})
onMounted(() => {
  scrollToBottom.value = () => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }
})

watch(messages, () => scrollToBottom.value())
</script>

<template>
  <section class="chat-modal" :class="{ opened: isOpen, 'is-extended': hasLoadedMessages }">
    <div v-if="userStore.isLoggedIn" class="container">
      <div class="row d-flex justify-content-center">
        <div>
          <div class="card">
            <div
              @click="isOpen = !isOpen"
              class="card-header d-flex justify-content-between align-items-center p-3"
              style="border-top: 4px solid #ffa900"
            >
              <h5 class="mb-0">Čats</h5>
              <div class="d-flex flex-row align-items-center">
                <i v-if="isOpen" class="btn btn-close" />
                <i v-else>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    class="bi bi-chevron-up"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                    />
                  </svg>
                </i>
              </div>
            </div>
            <div
              class="card-footer text-muted p-3 border-top-0"
              :class="{ 'border-bottom': hasLoadedMessages }"
            >
              <div class="row">
                <div class="col-12">
                  <label v-if="hasLoadedMessages" class="fw-bold" for="recipient-input"
                    >Tu šobrīd čato ar</label
                  >
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="input-group mb-0 mt-1">
                    <input
                      id="recipient-input"
                      type="text"
                      class="form-control"
                      v-model="targetEmail"
                      :disabled="hasLoadedMessages"
                      placeholder="Ievadi saņēmēja e-pastu"
                      aria-label="Recipient's username"
                      aria-describedby="button-addon2"
                    />
                    <button
                      v-if="!hasLoadedMessages"
                      class="btn btn-warning"
                      type="button"
                      id="button-addon2"
                      style="padding-top: 0.55rem"
                      @click="loadMessages"
                    >
                      Sākt čatu
                    </button>
                    <button
                      v-else
                      class="btn btn-warning"
                      type="button"
                      id="button-addon2"
                      style="padding-top: 0.55rem"
                      @click="clearMessages"
                    >
                      Mainīt
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="hasLoadedMessages"
              class="card-body"
              ref="chatContainer"
              data-mdb-perfect-scrollbar="true"
              style="position: relative; height: 400px"
            >
              <!-- Chat messages display -->
              <div v-for="(message, index) in messages" :key="index" class="chat-message">
                <div class="message-sender">
                  {{ message.fromUser === userStore.currentUser.id ? 'Tu' : targetUser?.name }}
                </div>
                <div class="message-content">{{ message.content }}</div>
              </div>
            </div>
            <div class="card-footer text-muted p-3">
              <!-- Input field for typing messages -->
              <div class="input-group mt-1">
                <input
                  v-model="newMessage"
                  :disabled="!hasLoadedMessages"
                  type="text"
                  class="form-control"
                  placeholder="Raksti ziņu"
                />
                <button
                  @click="sendMessage"
                  :disabled="!hasLoadedMessages"
                  class="btn btn-warning"
                  type="button"
                >
                  Sūtīt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Styles for the chat modal */
.chat-modal {
  z-index: 10;
  position: fixed;
  right: 0;
  bottom: -153px;
  transition: bottom 0.2s ease-in-out;
}

.chat-modal.is-extended {
  bottom: -578px;
}

.chat-modal.opened {
  bottom: 16px !important;
}

.chat-message {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f6f7;
  border-radius: 8px;
}

.message-sender {
  font-weight: bold;
  margin-bottom: 5px;
}

.input-group {
  margin-top: 20px;
}

.card-body {
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
