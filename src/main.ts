import './common/assets/main.css'
import * as bootstrap from 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { initializeApp } from 'firebase/app'
import { VueFire } from 'vuefire'

import App from './App.vue'
import router from './common/router'

const firebaseConfig = {
    apiKey: "AIzaSyD_hj26e-UAANcpsXnGK_ln1oKjURtZa78",
    authDomain: "v-lv-b8871.firebaseapp.com",
    projectId: "v-lv-b8871",
    storageBucket: "v-lv-b8871.appspot.com",
    messagingSenderId: "847778143571",
    appId: "1:847778143571:web:42fb61503766c39540d5a6"
  }

const app = createApp(App)

const firebaseApp = initializeApp(firebaseConfig)

app.use(createPinia())
app.use(router)
app.use(VueFire, { firebaseApp })

app.mount('#app')
