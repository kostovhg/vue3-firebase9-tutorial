<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useTaskSnapStore } from "@/stores/useTaskSnapStore";

const tasksStore = useTaskSnapStore();
const emitEvents = defineEmits(["start-work", "pause-work", "finish-task"]);
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  operationId: {
    type: String,
    required: true,
  },
}); 

const task = ref(props.task);
const opId = ref(props.operationId);
const isStarted = ref(false);

watch(() => tasksStore.tasks[task.value.id], (newVal) => {
  task.value = newVal;
  isStarted.value = tasksStore.isBeingWorked(task.value, opId.value);
}, { deep: true });

const handleStartClick = () => {
  // console.log("TaskCard: handleStartClick ", tasksStore.tasks[task.value.id]);
  // emitEvents(isStarted.value ? "pause-work" : "start-work", props.task.number);
  // isStarted.value = !isStarted.value;
  if (isStarted.value) {
    tasksStore.pauseTask(task.value.id, opId.value);
    isStarted.value = false;
    // emitEvents("pause-work", task.value.number);
  } else {
    tasksStore.startTask(task.value.id, opId.value);
    isStarted.value = true;
    // emitEvents("start-work", task.value.number);
  }
};

const passTask = () => {
  // emitEvents("finish-task", task.value);
  tasksStore.finishTask(task.value.id, opId.value);
};

onMounted(() => {
  opId.value = props.operationId;
  isStarted.value = tasksStore.isBeingWorked(task.value, opId.value);
  tasksStore.subscribeToTask(task.value.id);
});

onUnmounted(() => {
  tasksStore.unsubscribeToTask(task.value.id);
});
</script>

<template>
  <div v-if="!task.finished" class="card" data-state="not-started">
    <div class="columns is-mobile-centered">
      <div class="column is-half">
        <header class="card-header">
          <p class="card-header-title title">{{ task.number }}</p>
        </header>
      </div>

      <button
        class="button column mx-4 px-6 is-size-6-mobile"
        :class="!isStarted ? 'is-success' : 'is-warning'"
        @click.prevent="handleStartClick"
      >
        {{ `${isStarted ? " Pause " : " Start "}` }}
        <!-- <i class="pi" :class="isStarted ? `pi-pause` : `pi-play`"></i> -->
        <i class="pi" :class="isStarted ? `pi-spin pi-cog`: `pi-play`" style="font-size:1.5em"> </i>
      </button>

      <button
        :class="isStarted ? 'is-danger' : 'os-cancel disabled'"
        class="button column mx-4 px-6 is-size-6-mobile"
        :disabled="!isStarted"
        @click.prevent="passTask"
      >
        {{ `Finish ${isStarted ? " ✓ " : " ✗ "}` }}
      </button>
    </div>
    <div class="card-content">
      <div class="container columns is-multiline">
        <p class="subtitle column">{{ task.client }}</p>
        <p class="subtitle column">{{ task.name }}</p>
      </div>
    </div>
  </div>
</template>