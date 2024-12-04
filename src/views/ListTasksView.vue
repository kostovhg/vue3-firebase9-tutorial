<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, onUnmounted, inject, reactive } from "vue";
import { Task } from "@/mappings/mappings";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { getTasks } from "@/firebase";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import TaskCard from "@/components/TaskCard.vue";

const route = useRoute();
const operationId = ref();
const toast = useToast;
const opName = ref("");
const operationTasks = ref([]);
const ops = ref([]);

const state = reactive({
  isLoading: true,
});

onMounted(async () => {
  ops.value = await inject("operationsData");
  operationId.value = route.params.oId;

  // Debugging print:
  // console.log("Thats are the operationsData injected", ops.value);
  // console.log("and thad is route.params.oId", route.params.oId);
  const foundedOp = ops.value.find((item) => item.id === operationId.value);
  if (foundedOp) {
    opName.value = foundedOp.name;
  } else {
    opName.value = "None";
  }

  try {
    const response = await getTasks(operationId);
    // Debug print:
    console.log(response);
    operationTasks.value = response;
  } catch (e) {
    console.log("Something wrong with getting tasks", e);
  } finally {
    state.isLoading = false;
    // console.log("Finally task async finished");
  }
});
</script>

<template>
  <div class="panel">
    <h1 class="panel-heading">List Tasks for {{ opName }}</h1>
  </div>
  <!-- Show loading spinner while loading is true -->
  <div v-if="state.isLoading">
    <PulseLoader />
  </div>

  <!-- Show list of tasks when done loading -->
  <div v-else class="container">
    <!-- <li v-for="task in operationTasks" :key="task.id">
      {{ task.name }}
    </li> -->
    <TaskCard v-for="task in operationTasks" :key="task.id" :task="task" />
  </div>
</template>
