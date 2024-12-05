<script setup>
import { ref, computed, inject, onMounted } from "vue";
import { RouterLink } from "vue-router";

const ops = ref([]);
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
const task = ref(props.task);

const emitEvents = defineEmits(["toggle-working", "finish-task"]);

const toggleEvent = () => {
  task.value.started = !task.value.started;
  emitEvents("toggle-working", props.task.id);
};

const passTask = () => {
  task.value.finished = true;
  emitEvents("finish-task", props.task.id);
};

onMounted(async () => {
  ops.value = await inject("operationsData");
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

      <!-- Here is the mimication of the start/stop button 
      <button
        class="button column mx-4 mb-3 px-6 is-size-6-mobile"
        :class="!task.started ? 'is-success' : 'is-warning'"
        @click.prevent="task.started = !task.started"
      > -->
      <!-- Here we will try with emit -->
      <button
        class="button column mx-4 mb-3 px-6 is-size-6-mobile"
        :class="!task.started ? 'is-success' : 'is-warning'"
        @click="toggleEvent(task.id)"
      >
        {{ `${task.started ? " Pause " : " Start "}` }}
        <i class="pi" :class="task.started ? `pi-pause` : `pi-play`"></i>
      </button>

      <button
        :class="task.started ? 'is-danger' : 'os-cancel disabled'"
        class="button column mx-4 px-6 is-size-6-mobile"
        :disabled="task.started ? false : true"
        @click.prevent="passTask()"
      >
        {{ `Finish ${task.started ? " ✓ " : " ✗ "}` }}
      </button>
    </div>
    <div class="card-content">
      <div class="container columns is-multiline">
        <!-- <div class="column"> -->
        <p class="subtitle column">{{ task.client }}</p>
        <!-- </div> -->
        <!-- <div class="column"> -->
        <p class="subtitle column">{{ task.name }}</p>
        <!-- </div> -->
      </div>
      <!-- <p class="state">Not Started</p>
    <button class="done-button">Done</button> -->
      <!-- <div class="card-actions column">
        <button class="button" :class="!task.started ? 'is-success' : 'is-warning'">
          <i class="pi" :class="task.started ? `pi-pause` : `pi-play`"></i>
        </button>
      </div> -->
      <!-- <div class="card-footer">
        <div class="card-footer-item">
          <RouterLink :to="`/tasks/${task.id}`">Details</RouterLink>
        </div>
        <div class="card-footer-item">
          <RouterLink :to="`/tasks/${task.id}`">Edit</RouterLink>
        </div>
        <div class="card-footer-item">
          <RouterLink :to="`/tasks/${task.id}`">Delete</RouterLink>
        </div>
      </div> -->
    </div>
  </div>
</template>
