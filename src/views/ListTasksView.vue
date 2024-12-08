<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, onUnmounted, inject, reactive } from "vue";
import { Task } from "@/mappings/mappings";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { getTasks, startWorking, pauseWorking, finishWorking } from "@/firebase";
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

const toggleWorking = (tid) => {
  console.log("succesfully receive emit from child", tid);
  startWorking(tid, operationId.value);
  console.log("toggleWorking has been clicked. StartWorking has benn called and now we exit");
};

const toggleFinished = (tid) => {
  const processedTask = operationTasks.value.find((item) => item.id === tid);
  if (confirm(`Are you sure that task ${processedTask.number} is finished?`)) {
    // mimic database update
    console.log('toggleFinished has been clicked.')
  } else {
    processedTask.finished = false;
  }
  /*
  it should be something like this:
   axios.delete('/api/artist/'+id)
                .then(resp => {
                    this.artists.data.splice(index, 1);
                })
                .catch(error => {
                    console.log(error);
                })
  */
};

const isStarted = (tasksOperations, currentOperationID) => {
  // console.log('tasksOperations', tasksOperations)
  try {
    const intervals = tasksOperations[currentOperationID];
    // console.log('Task  operation intervals > ',intervals)
    if (intervals) {
      
      console.log('intervals', intervals)
      
      if (intervals[Object.keys(intervals)] === null) {
        console.log('intervals[Object.keys(intervals)]', intervals[Object.keys(intervals)])
        console.log('task is started')
        return true;
      } else {
        return false;
      };

    } else {
      return false;
    }
  } catch (e) {
    console.log('Operations are not properly recorded')
    return false
  }

};

onMounted(async () => {
  ops.value = await inject("operationsData");
  operationId.value = route.params.oId;

  const foundedOp = ops.value.find((item) => item.id === operationId.value);
  if (foundedOp) {
    opName.value = foundedOp.name;
  } else {
    opName.value = "None";
  }

  try {
    const response = await getTasks(operationId);
    // Debug print:
    console.log("Responce from ListTasksView.vue/onMounted/try: ", response);
    response.forEach((t) => {
      operationTasks.push({
        id: t.id,
        cOp: t.cOp,
        name: t.name,
        number: t.number,
        client: t.client,
        finished: t.finished,
        operations: t.operations,
        started: isStarted(t.operations, t.cOp),
      });
      console.log("operationTasks.value", operationTasks.value);
    });
    operationTasks.value = response;
  } catch (e) {
    console.log("Something wrong with getting tasks", e);
  } finally {
    state.isLoading = false;
    // console.log("Finally task async finished");
  }

  console.log("operationTasks.value", operationTasks.value);
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
        :key="task.id"
        :task="task"
        @start-work="toggleWorking(task.id)"
        @finish-task="toggleFinished(task.id)"
        @pause-work="toggleWorking(task.id)"
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
