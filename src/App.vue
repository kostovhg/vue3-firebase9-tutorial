<script setup>
/*
    imports
*/
import { inject, provide } from "vue";
import { RouterView } from "vue-router";

const operationsData = inject("operationsData");
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>
