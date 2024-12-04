<script setup>
import { defineProps, ref, computed, inject, onMounted } from "vue";
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
    <header class="card-header">
      <p class="card-header-title">{{ task.name }}</p>
    </header>
    <div class="card-content">
      <div class="content">
        <p>{{ task.number }}</p>
        <p>{{ task.client }}</p>
      </div>
      <!-- <p class="state">Not Started</p>
    <button class="done-button">Done</button> -->
      <div class="card-actions">
        <p>{{ task.finished }}</p>
      </div>
      <div class="card-footer">
        <div class="card-footer-item">
          <RouterLink :to="`/tasks/${task.id}`">Details</RouterLink>
        </div>
        <div class="card-footer-item">
          <RouterLink :to="`/tasks/${task.id}`">Edit</RouterLink>
        </div>
        <div class="card-footer-item">
          <RouterLink :to="`/tasks/${task.id}`">Delete</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
