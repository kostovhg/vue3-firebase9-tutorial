<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, onUnmounted, inject, reactive } from "vue";
import Task from "@/mappings/Task";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import TaskCard from "@/components/TaskCard.vue";
import TaskSnapshot from "@/mappings/TaskSnapshot";

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
  tasks.value = inject("tasksData");
  ops.value = inject("operationsData");

  operationId.value = route.params.oId;

  // console.log("print from ListTaskView/onMounted > ops.value", ops.value);

  const foundedOp = ops.value.find((item) => item.id === operationId.value);
  if (foundedOp) {
    opName.value = foundedOp.name;
  } else {
    opName.value = "None";
  }

  try {
    tasks.value.forEach((t) => {
      if (t.data().cOp === operationId.value) {
        operationTasks.push(new TaskSnapshot(t));
      }
    });
    setTimeout(1000) 
  } catch (e) {
    console.log("Something wrong with getting tasks", e);
  } finally {
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
  <!-- Show loading spinner while loading is true -->
  <section class="section">
    <div v-if="state.isLoading">
      <PulseLoader />
    </div>

    <!-- Show list of tasks when done loading -->
    <div v-else-if="3" class="is-multiline">
      <TaskCard
      v-for="task in operationTasks"
        :key="task.data.number"
        :task="task"
        :operationId="task.data.cOp"  
        @start-work="toggleWorking(task)"
        @finish-task="toggleFinished(task)"
        @pause-work="toggleWorking(task)"
      />
    </div>
    <div v-else>No operatioID</div>
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
