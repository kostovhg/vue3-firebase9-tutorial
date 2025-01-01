<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, onUnmounted, inject, reactive, watch } from "vue";
import Task from "@/mappings/Task";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import TaskCard from "@/components/TaskCard.vue";
import TaskSnapshot from "@/mappings/TaskSnapshot";
import { useOpsStore } from "@/stores/useOpsStore";
import { useTaskSnapStore } from "@/stores/useTaskSnapStore";

const operationsStore = useOpsStore();
const taskStore = useTaskSnapStore();
const route = useRoute();
const operationId = ref();
const toast = useToast();
const opName = ref("");
const operationTasks = reactive([]);
const ops = ref([]);
const tasks = ref([]);

const state = reactive({
  isLoading: true,
});

const toggleWorking = (t) => {
  if (!t.data.isStarted) {
    t.startOperation(operationId.value, new Date());
  } else {
    t.pauseOperation(operationId.value, new Date());
  }
};

const toggleFinished = (t) => {
  t.finishOperation(operationId.value);
  operationTasks.splice(operationTasks.indexOf(t), 1);
  toast.success(`Operation ${t.cOp} finished`);
};

onMounted(() => {
  operationId.value = route.params.oId;
  ops.value = operationsStore.operations;

  const foundedOp = ops.value.find((item) => item.id === operationId.value);
  if (foundedOp) {
    opName.value = foundedOp.name;
  }

  // Watch for changes in taskStore.isLoading
  watch(() => taskStore.isLoading, (newVal) => {
    if (!newVal) {
      tasks.value = taskStore.getTaskByOperation(operationId.value);
      state.isLoading = false;
      console.log('Tasks loaded:', tasks.value);
    }
  });

  // Fetch tasks if not already fetched
  if (!taskStore.tasks.length) {
    taskStore.fetchTasks();
  } else {
    tasks.value = taskStore.getTaskByOperation(operationId.value);
    state.isLoading = false;
  }
});
</script>

<template>
  <section class="section">
    <div class="navbar is-dark is-fixed-top is">
      <div class="panel">
        <h1 class="panel-heading">List Tasks for {{ opName }}</h1>
      </div>
    </div>
  </section>
  
  <section class="section">
    <div v-if="state.isLoading">
      <!-- Show loading spinner while loading is true -->
      <PulseLoader />
    </div>
    
    <div v-else class="is-multiline">
      <!-- Show list of tasks when done loading -->
      <TaskCard
        v-for="task in tasks"
        :key="task.number"
        :task="task"
        :operationId="task.cOp"
        @start-work="toggleWorking(task)"
        @finish-task="toggleFinished(task)"
        @pause-work="toggleWorking(task)"
      />
    </div>
  </section>
</template>

<style scoped>
/* .panel {
  position: fixed;
  z-index: 9999;
  position: absolute;
  left: 0px;
*/
</style>