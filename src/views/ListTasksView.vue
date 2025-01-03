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

// const togglePauseWorking = (t) => {
//   t.pauseOperation(operationId.value, new Date());
// };

// const toggleStartWorking = (t) => {
//   t.startOperation(operationId.value, new Date());
// };

// const toggleFinished = (t) => {
//   console.log(t)
//   t.finishOperation(operationId.value);
// };

onMounted(() => {
  state.isLoading = true;
  operationId.value = route.params.oId;
  const ops = operationsStore.operations;
  opName.value = ops[operationId.value].name;

  // Watch for changes in taskStore.isLoading
  // watch(
  //   () => taskStore.isLoading,
  //   (newVal) => {
  //     if (!newVal) {
  //       state.isLoading = true;
  //       tasks.value = taskStore.getTasksByOperation(operationId.value);
  //       console.log("Tasks loaded:", tasks.value);
  //       state.isLoading = false;
  //     } else {
  //       state.isLoading = false;
  //       console.log("Tasks loading...");
  //     }
  //   }
  // );

  // Watch for changes in taskStore.tasks
  watch(
    () => taskStore.tasks,
    (newVal) => {
      if (!taskStore.isLoading) {
      tasks.value = taskStore.getTasksByOperation(operationId.value);
      console.log("Watch in ListTasksView: Tasks updated:", tasks.value);
      }
      if (taskStore.isLoading) {
        taskStore.notify(`Tasks for ${opName.value} updated!`);
      }
      
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
