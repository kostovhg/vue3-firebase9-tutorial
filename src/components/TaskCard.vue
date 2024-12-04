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

onMounted(async () => {
  ops.value = await inject("operationsData");
});
</script>

<template>
  <div class="card" data-state="not-started">
    <header class="card-header columns m-5">
      <div class="column">
        <p class="card-header-title title">{{ task.number }}</p>
      </div>

      <button
        class="button card-actions column is-2 has-text-right m-5"
        :class="!task.started ? 'is-success' : 'is-warning'"
        @click.prevent="task.started = !task.started"
      >
        <i class="pi" :class="task.started ? `pi-pause` : `pi-play`"></i>
      </button>
      <button
        :class="task.started ? 'is-success' : 'os-cancel disabled'"
        class="button card-actions column is-2 has-text-right m-5"
      >
        {{ `Finish ${task.started ? " ✓ " : " ✗ "}` }}
      </button>
    </header>
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
