<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="card" data-state="not-started">
    <p>Card 1</p>
    <p class="state">Not Started</p>
    <button class="done-button">Done</button>
  </div>
</template>
