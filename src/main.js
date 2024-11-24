import './../node_modules/bulma/css/bulma.min.css'

import { createApp } from 'vue'
import App from './App.vue'


const app = createApp(App)

app.use(router)

app.mount('#app')
