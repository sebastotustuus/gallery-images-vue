import { createApp } from 'vue'
import { router } from './app/router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Divider from 'primevue/divider'
import Card from 'primevue/card'
import Aura from '@primeuix/themes/aura';
import App from './App.vue'
import 'primeicons/primeicons.css'                       
import './style.css'

const app = createApp(App)

app.use(PrimeVue, { 
  theme: Aura,
  ripple: true
})

app.use(router)
app.component('Dialog', Dialog)
app.component('Button', Button)
app.component('Avatar', Avatar)
app.component('Divider', Divider)
app.component('Card', Card)

app.use(VueQueryPlugin)
app.mount('#app')