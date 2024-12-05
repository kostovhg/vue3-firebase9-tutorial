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
const operationTasks = ref([]);
const ops = ref([]);

const state = reactive({
  isLoading: true,
});

const toggleWorking = (tid) => {
  startWorking(tid, operationId.value);
  alert("switched");
};

const toggleFinished = (tid) => {
  const processedTask = operationTasks.value.find((item) => item.id === tid);
  if (confirm(`Are you sure that task ${processedTask.number} is finished?`)) {
    // mimic database update
    alert("finished");
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

const isStarted = (taskId) => {
  // mocking database return
  return false;
};

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
    response.forEach((t) => {
      operationTasks.value.push({
        id: t.id,
        started: isStarted(t.id),
        cOp: t.cOp,
        name: t.name,
        number: t.number,
        client: t.client,
        finished: t.finished,
        started: isStarted(t.id),
      });
    });
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
        @toggle-working="toggleWorking(task.id)"
        @finish-task="toggleFinished(task.id)"
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
