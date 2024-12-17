<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, onUnmounted, inject, reactive } from "vue";
import Task from "@/mappings/Task";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import {
  getTasks,
  startWorking,
  pauseWorking,
  finishWorking,
  serverTimestamp,
} from "@/firebase";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import TaskCard from "@/components/TaskCard.vue";

const route = useRoute();
const operationId = ref();
const toast = useToast;
const opName = ref("");
const operationTasks = reactive([]);
const ops = ref([]);

const state = reactive({
  isLoading: true,
});

const toggleWorking = (t) => {
  if (!t.isStarted) {
    t.startOperation(operationId.value, new Date());
    startWorking(t, operationId.value);
  } else {
    t.pauseOperation(operationId.value, new Date());
    pauseWorking(t, operationId.value);
  }
};

const toggleFinished = (t) => {
  t.finishOperation(operationId.value);
  // console.log("On listTask vue toggleFinish gives t: ", t);
  finishWorking(t, operationId.value);
  operationTasks.splice(operationTasks.indexOf(t), 1);
};

const isStarted = (tasksOperations, currentOperationID) => {
  // console.log('tasksOperations', tasksOperations)
  try {
    const intervals = tasksOperations[currentOperationID];
    // console.log('Task  operation intervals > ',intervals)
    if (intervals) {
      // console.log("intervals", intervals);

      if (intervals[Object.keys(intervals)] === null) {
        // console.log(
        //   "intervals[Object.keys(intervals)]",
        //   intervals[Object.keys(intervals)]
        // );
        // console.log("task is started");
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (e) {
    console.log("Operations are not properly recorded");
    return false;
  }
};

onMounted(async () => {
  ops.value = await inject("operationsData");
  operationId.value = route.params.oId;

  // console.log("print from ListTaskView/onMounted > ops.value", ops.value);

  const foundedOp = ops.value.find((item) => item.id === operationId.value);
  if (foundedOp) {
    opName.value = foundedOp.name;
  } else {
    opName.value = "None";
  }

  try {
    const response = await getTasks(operationId);
    // Debug print:
    // console.log("Response from ListTasksView.vue/onMounted/try: ", response);
    response.forEach((t) => {
      // console.log("operationTasks.value", t);
      const newTask = new Task(t);
      const isStarted = newTask.isStarted(operationId.value);
      newTask.isStarted = isStarted;
      // console.log("Print from ListTaskView/onMounted/try/newTask.isStarted", newTask);
      operationTasks.push(newTask);
    });
    // operationTasks = response;
  } catch (e) {
    console.log("Something wrong with getting tasks", e);
  } finally {
    state.isLoading = false;
    // console.log("Finally task async finished");
  }

  // console.log("operationTasks.value", operationTasks);
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
  <!-- Show loading spinner while loading is true -->
  <section class="section">
    <div v-if="state.isLoading">
      <PulseLoader />
    </div>

    <!-- Show list of tasks when done loading -->
    <div v-else class="is-multiline">
      <TaskCard
        v-for="task in operationTasks"
        :key="task.number"
        :task="task"
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
  top: 0px; 
  width: 100%;
} */
</style>
