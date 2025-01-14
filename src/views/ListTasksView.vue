<script setup>
import { useRoute } from "vue-router";
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
const currentTasks = ref([]);

const state = reactive({
  isLoading: true,
});

onMounted(async () => {
  state.isLoading = true;
  operationId.value = route.params.oId;
  const ops = operationsStore.operations;
  opName.value = ops.find((op) => op.oId === operationId.value).bgName;

  taskStore.operation = operationId.value;
  taskStore.subscribeToPreviousTasks(operationId.value);

  watch(
    () => taskStore.tasks,
    (newVal) => {
      if (state.isLoading) {
        return;
      }
      const updatedTasks = taskStore.getPreviousOperationTasks(operationId.value);
      updatedTasks.forEach((task) => {
        const index = currentTasks.value.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          currentTasks.value[index] = task;
        } else {
          currentTasks.value.push(task);
          console.log("Passing unchanged task: ", task);
        }
      });
      taskStore.notify(`Tasks for ${opName.value} updated!`);
    },
    { deep: true }
  );

  currentTasks.value = taskStore.getTasksByOperation(operationId.value);
  state.isLoading = false;
});
</script>

<template>
  <section class="section">
    <div v-if="state.isLoading">
      <PulseLoader />
    </div>

    <div v-else-if="currentTasks.length === 0" class="is-multiline">
      <div class="title has-text-centered">Все още няма проекти за <h1>{{ opName }}</h1></div>
    </div>

    <div v-else class="is-multiline">
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
