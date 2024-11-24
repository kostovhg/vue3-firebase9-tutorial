import { createRouter, createWebHistory } from 'vue-router';
import ListOperationsView from '@/views/ListOperationsView.vue';
import ListTasksView from '@/views/ListTasksView.vue';
import CreateTaskView from '@/views/CreateTaskView.vue';


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'list-tasks',
            component: ListTasksView,
        },
        {
            path: '/operations',
            name: 'operations',
            component: ListOperationsView,
        },
        {
            path: '/create',
            name: 'create',
            component: CreateTaskView,
        },
    ]
});

export default router;
