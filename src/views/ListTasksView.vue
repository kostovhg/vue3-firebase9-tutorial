<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, reactive, watch } from "vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import TaskCard from "@/components/TaskCard.vue";
import { useOpsStore } from "@/stores/useOpsStore";
import { useTaskSnapStore } from "@/stores/useTaskSnapStore";

const operationsStore = useOpsStore();
const taskStore = useTaskSnapStore();
const route = useRoute();
const operationId = ref();
const toast = useToast();
const opName = ref("");
const tasks = ref([]);

const state = reactive({
  isLoading: true,
});

const togglePauseWorking = (t) => {
  t.pauseOperation(operationId.value, new Date());
};

const toggleStartWorking = (t) => {
  t.startOperation(operationId.value, new Date());
};

const toggleFinished = (t) => {
  console.log(t)
  t.finishOperation(operationId.value);
};

onMounted(() => {
  operationId.value = route.params.oId;
  const ops = operationsStore.operations;

  const foundedOp = ops.find((item) => item.id === operationId.value);
  if (foundedOp) {
    opName.value = foundedOp.name;
  }

  // Watch for changes in taskStore.isLoading
  watch(
    () => taskStore.isLoading,
    (newVal) => {
      if (!newVal) {
        tasks.value = taskStore.getTasksByOperation(operationId.value);
        state.isLoading = false;
        console.log("Tasks loaded:", tasks.value);
      } else {
        state.isLoading = false;
        console.log("Tasks loading...");
      }
    }
  );

  // Watch for changes in taskStore.tasks
  watch(
    () => taskStore.tasks,
    (newVal) => {
      tasks.value = taskStore.getTasksByOperation(operationId.value);
      console.log("Tasks updated:", tasks.value);
    },
    { deep: true }
  );

  // Initial load of tasks
  tasks.value = taskStore.getTasksByOperation(operationId.value);
  state.isLoading = false;
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
        @start-work="toggleStartWorking(task)"
        @finish-task="toggleFinished(task)"
        @pause-work="togglePauseWorking(task)"
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
