<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, onUnmounted, inject, defineComponent } from "vue";
import { Task } from "@/mapings/mappings";
import { getTasks } from "@/firebase";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const route = useRoute();
const operationId = ref();
const toast = useToast;
const opName = ref("");
const operationTasks = ref([]);
const ops = ref([]);

onMounted(async () => {
  ops.value = await inject("operationsData");
  operationId.value = route.params.oId;

  console.log("Thats are the operationsData ijected", ops.value);
  console.log('and thad is route.params.oId',  route.params.oId);
  const foundedOp = ops.value.find((item) => item.id === operationId.value);
  if (foundedOp) {
    opName.value = foundedOp.name;
  } else {
    opName.value = "None";
  }
  console.log(opName.value);


  try {
    const response = await getTasks(operationId).then((result) => result);
    console.log(response);
    operationTasks.value = response;
  } catch (e) {
    console.log('Soemthing wrong with getting tasks', e);
  } finally {
    console.log("Finally task async finished");
  }
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
