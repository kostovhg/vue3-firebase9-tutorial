<script setup>
import { ref, computed, inject, onMounted, watch } from "vue";
import { RouterLink } from "vue-router";
import TaskSnapshot from "@/mappings/TaskSnapshot";

const ops = ref([]);
const emitEvents = defineEmits(["start-work", "pause-work", "finish-task"]);
const props = defineProps({
  task: {
    type: TaskSnapshot,
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

watch(opId, (newVal) => {
  isStarted.value = task.value.data.isStarted(newVal);
})

const handleStartClick = () => {
  emitEvents(isStarted.value ? "pause-work" : "start-work", props.task.number);
  isStarted.value = !isStarted.value;
};

const passTask = () => {
  emitEvents("finish-task", task.value.data.number);
};

onMounted(() => {
  ops.value = inject("operationsData");
  opId.value = props.operationId
  console.log(ops.value)
  console.log(opId.value)
  if (task.value.isStarted(opId.value)) {
    isStarted.value = true;
  } else {
    isStarted.value = false;
  }
  // console.log("print from TaskCard/onMounted > ", task.value);
});
</script>

<template>
  <div v-if="!task.finished" class="card" data-state="not-started">
    <div class="columns is-mobile-centered">
      <div class="column is-half">
        <header class="card-header">
          <p class="card-header-title title">{{ task.data.number }}</p>
        </header>
      </div>

      <button
        class="button column mx-4 px-6 is-size-6-mobile"
        :class="!isStarted ? 'is-success' : 'is-warning'"
        @click.prevent="handleStartClick(task)"
      >
        {{ `${task.isStarted.value ? " Pause " : " Start "}` }}
        <i class="pi" :class="isStarted ? `pi-pause` : `pi-play`"></i>
      </button>

      <button
        :class="task.isStarted ? 'is-danger' : 'os-cancel disabled'"
        class="button column mx-4 px-6 is-size-6-mobile"
        :disabled="isStarted ? false : true"
        @click.prevent="passTask(task)"
      >
        {{ `Finish ${isStarted ? " ✓ " : " ✗ "}` }}
      </button>
    </div>
    <div class="card-content">
      <div class="container columns is-multiline">
        <p class="subtitle column">{{ task.data.client }}</p>

        <p class="subtitle column">{{ task.data.name }}</p>
      </div>
    </div>
  </div>
</template>
