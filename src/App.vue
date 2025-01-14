<script setup>
/*
    imports
*/
// import { inject, provide } from "vue";
import { RouterView } from "vue-router";
import { useTaskSnapStore } from "./stores/useTaskSnapStore";
import NavBar from "@/components/NavBar.vue";

// const operationsData = inject("operationsData");
// const tasksData = inject("tasksData");
const taskStore = useTaskSnapStore();
// console.log('Call fetchTasks from app.vue')
taskStore.fetchTasks();
</script>

<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
