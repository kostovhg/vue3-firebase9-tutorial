<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useTaskSnapStore } from "@/stores/useTaskSnapStore";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

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

const priorityColorMatch = (priority) => {
  switch (priority) {
    case 1:
      return "has-background-dark";
    case 2:
      return "has-background-link";
    case 3:
      return "has-background-warning";
    case 4:
      return "has-background-danger";
    case 5:
      return "has-background-danger-light";
    default:
      return "";
  }
};

const task = ref(props.task);
const opId = ref(props.operationId);
const isStarted = ref(false);

watch(
  () => tasksStore.tasks[task.value.id],
  (newVal) => {
    task.value = newVal;
    // isStarted.value = tasksStore.isBeingWorked(task.value, opId.value);
    if (
      task.value.operations[opId.value].timestamps.start !== null &&
      task.value.operations[opId.value].timestamps.pause.length % 2 !== 0
    ) {
      isStarted.value = false;
    } else {
      isStarted.value = true;
    }
  },
  { deep: true }
);

const handleStartClick = () => {
  if (isStarted.value) {
    tasksStore.pauseTask(task.value.id, opId.value);
    isStarted.value = false;
    useToast().info(`Task ${task.value.number} paused!`);
  } else {
    tasksStore.startTask(task.value.id, opId.value);
    isStarted.value = true;
    useToast().info(`Task ${task.value.number} started!`);
  }
};

const passTask = () => {
  tasksStore.finishTask(task.value.id, opId.value);
  useToast().warning(`Task ${task.value.number} finished!`);
};

onMounted(() => {
  opId.value = props.operationId;
  isStarted.value = tasksStore.isBeingWorked(task.value, opId.value);
  console.log(isStarted.value);
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
        <i
          class="pi"
          :class="isStarted ? `pi-spin pi-cog` : `pi-play`"
          style="font-size: 1.5em"
        >
        </i>
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
