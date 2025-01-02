<script setup>
/*
    imports
*/
import { inject, provide } from "vue";
import { RouterView } from "vue-router";
import { useTaskSnapStore } from "./stores/useTaskSnapStore";

// const operationsData = inject("operationsData");
// const tasksData = inject("tasksData");
const taskStore = useTaskSnapStore();
console.log('Call fetchTasks from app.vue')
taskStore.fetchTasks();
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>
