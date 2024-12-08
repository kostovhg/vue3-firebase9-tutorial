<script setup>
import { ref, computed, inject, onMounted} from "vue";
import { RouterLink } from "vue-router";

const ops = ref([]);
const emitEvents = defineEmits(["start-work", "pause-work", "finnish-task"]);
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const task = ref(props.task);

const handleStartClick = () => {
  emitEvents(task.value.started ? 'pause-work' : 'start-work', props.task.id);
};


const passTask = () => {
  console.log("passing task", props.task.id);
  const updatedTask = { ...task, finished: true };
  emitEvents('pause-work', props.task.id);
};


onMounted(async () => {
  ops.value = await inject("operationsData");
  console.log('print from TasckCard ', task.value)
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
        class="button column mx-4 mb-3 px-6 is-size-6-mobile"
        :class="!task.started ? 'is-success' : 'is-warning'"
        @click.prevent="handleStartClick(task)"
      >
        {{ `${task.started ? " Pause " : " Start "}` }}
        <i class="pi" :class="task.started ? `pi-pause` : `pi-play`"></i>
      </button>

      <button
        :class="task.started ? 'is-danger' : 'os-cancel disabled'"
        class="button column mx-4 px-6 is-size-6-mobile"
        :disabled="task.started ? false : true"
        @click.prevent="passTask(task)"
      >
        {{ `Finish ${task.started ? " ✓ " : " ✗ "}` }}
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
