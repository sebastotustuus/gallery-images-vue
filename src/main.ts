import { createApp } from 'vue'
import { router } from './app/router'
import PrimeVue from 'primevue/config'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(router)
app.use(PrimeVue)
app.component('Dialog', Dialog)
app.component('Button', Button)
app.use(VueQueryPlugin)
app.mount('#app')