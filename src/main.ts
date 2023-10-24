import './common/assets/main.css'
import * as bootstrap from 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { initializeApp } from 'firebase/app'
import { VueFire } from 'vuefire'

import App from './App.vue'
import router from './common/router'

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID
}

const app = createApp(App)

const firebaseApp = initializeApp(firebaseConfig)

app.use(createPinia())
app.use(router)
app.use(VueFire, { firebaseApp })

app.mount('#app')
