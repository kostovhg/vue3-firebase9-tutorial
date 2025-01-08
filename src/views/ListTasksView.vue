<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, reactive, watch, onUnmounted } from "vue";
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
const currentTasks = ref([]);

const state = reactive({
  isLoading: true,
});

onMounted(async () => {
  state.isLoading = true;
  operationId.value = route.params.oId;
  const ops = operationsStore.operations;
  opName.value = ops.find((op) => op.oId === operationId.value).name;

  taskStore.subscribeToPrecedingTasks(operationId.value);

  watch(
    () => taskStore.tasks,
    (newVal) => {
      if (state.isLoading) {
        return;
      }
      currentTasks.value = taskStore.getTasksByOperation(operationId.value);
      taskStore.notify(`Tasks for ${opName.value} updated!`);
    },
    { deep: true }
  );

  currentTasks.value = taskStore.getTasksByOperation(operationId.value);
  state.isLoading = false;
});

// onUnmounted(() => {
//   taskStore.unsubscribeToTasks(tasks.value);
// });
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

    <div v-else-if="currentTasks.length === 0" class="is-multiline">
      <div class="title has-text-centered">No tasks for {{ opName }} yet</div>
    </div>

    <div v-else class="is-multiline">
      <!-- Show list of tasks when done loading -->
      <TaskCard
        v-for="task in currentTasks"
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
