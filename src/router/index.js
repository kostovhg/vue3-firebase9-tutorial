import { createRouter, createWebHistory } from 'vue-router';
import ListOperationsView from '@/views/ListOperationsView.vue';
import ListTasksView from '@/views/ListTasksView.vue';
import CreateTaskView from '@/views/CreateTaskView.vue';
import ListAllTasksView from '@/views/ListAllTasksView.vue';
import ManageTasksView from '@/views/ManageTasksView.vue';


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'choose-operation',
            component: ListOperationsView,
        },
        {
            path: '/tasks/:oId',
            name: 'operation-tasks',
            component: ListTasksView,
            // props: true
        },
        {
            path: '/tasks',
            name: 'tasks',
            component: ListAllTasksView,
        },
        {
            path: '/create',
            name: 'create',
            component: CreateTaskView,
        },
        {
            path: '/manage',
            name: 'manage-tasks',
            component: ManageTasksView,
        }
    ]
});

export default router;
