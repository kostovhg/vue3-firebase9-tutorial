<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, onUnmounted, inject } from "vue";
import { Task } from "@/mapings/mappings";
import { getTasks } from "@/firebase";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const operationId = useRoute().params.oId;
const opName = ref("");
const operationTasks = ref([]);
const ops = ref([]);

onMounted(async () => {
  ops.value = inject("operationsData");
  console.log("Thats are the operationsData ijected", ops.value);
  console.log(operationId);
  opName.value = ops.value.find((item) => item.id === operationId).name;
  console.log(opName.value);
  // operationTasks.value = fetchedTaksks;

  operationTasks.value = await getTasks(operationId);
});
</script>

<template>
  <h1>List Tasks for {{ opName }}</h1>

  <div class="container">
    <li v-for="task in operationTasks" :key="task.id">
      {{ task.name }}
    </li>
  </div>
</template>
