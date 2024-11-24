<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Task } from "@/mapings/Task";
import { addNew, getOperations } from "@/firebase";

const router = useRouter();
const task = ref([]);
const operations = ref([]);

const addTask = (number, name, operations) => {
  task.value = new Task(number, name, operations);

  addNew(task.value);

  router.push("/");
};

onMounted(() => {
  operations.value = getOperations();
});
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
  <div>
    <h2>Add New Task</h2>
    <form @submit.prevent="addTask">
      <div>
        <label for="number">Number:</label>
        <input type="text" id="number" required />
      </div>
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" required />
      </div>
      <div>
        <label>Available Operations:</label>
        <div v-for="item in operations.value" :key="item.oId">
          <label>
            <input
              type="checkbox"
              :value="item.oId"
              checked="checked"
              v-model="taskData.availableOps"
            />
            {{ item.name }}
          </label>
        </div>
      </div>
      <button type="submit">Add Task</button>
    </form>
  </div>
</template>
