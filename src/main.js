import './../node_modules/bulma/css/bulma.min.css'
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import ganttastic from '@infectoone/vue-ganttastic'
import 'primeicons/primeicons.css';

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(ganttastic)
app.use(pinia)

// const fetchData = async () => {
//     try {
//         const [operationsData, tasksData] = await Promise.all([
//             // fetchOperations(),
//             getAllTasks()
//         ]);
//         // app.provide('operationsData', operationsData);
//         app.provide('tasksData', tasksData);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// const fetchData = async () => {
//     try {
//         const tasksData = await getAllTasks();
//         app.provide('tasksData', tasksData);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }


// fetchData()
//     .finally(() => {
//         app.mount('#app')
//     })


app.mount('#app')
