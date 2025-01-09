import './../node_modules/bulma/css/bulma.min.css'
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import ganttastic from '@infectoone/vue-ganttastic'
import 'primeicons/primeicons.css';
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(router)
app.use(ganttastic)
app.use(pinia)

app.mount('#app')
