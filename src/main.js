import './../node_modules/bulma/css/bulma.min.css'

import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import { fetchOperations } from './firebase';
import ganttastic from '@infectoone/vue-ganttastic'
import 'primeicons/primeicons.css';

const app = createApp(App)

app.use(router)
app.use(ganttastic)

fetchOperations().then(data => {
    app.provide('operationsData', data);
}).finally(() => {
    app.mount('#app')
})



