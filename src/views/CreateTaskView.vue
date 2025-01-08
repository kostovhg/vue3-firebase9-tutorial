<script setup>
import { onMounted, ref, onUnmounted, reactive, inject } from "vue";
import { useRouter } from "vue-router";
import Task from "@/mappings/Task";
// import { addTask } from "@/firebase";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useOpsStore } from "@/stores/useOpsStore";
import { useTaskSnapStore } from "@/stores/useTaskSnapStore";
// import { fetchOperations } from "@/firebase";

const router = useRouter();
const toast = useToast();
const taskStore = useTaskSnapStore();
const opsStore = useOpsStore();

const dummyOperationList = ref([]);

const taskModel = reactive({
  number: "J.24.0",
  name: "",
  client: "",
  operations: ["1", "2", "11", "15"],
  isValid: false,
});

const state = reactive({
  isLoading: true,
});

const addNewTask = async () => {
  // console.log(taskModel);

  // const newTaskModel = new Task(taskModel);
  const newTaskModel = { ...taskModel };
  // console.log(newTaskModel);
  // try {
  //   await addTask(newTaskModel);
  //   toast.success("Task added successfully");
  //   router.push("/");
  // } catch (error) {
  //   console.error(error);
  //   toast.error("Error adding task");
  // }
  await taskStore.addTask(newTaskModel);
};

const checkInput = () => {
  if (
    taskModel.number &&
    taskModel.name &&
    taskModel.client &&
    taskModel.operations.length > 0
  ) {
    taskModel.isValid = true;
  } else {
    taskModel.isValid = false;
    // console.log("Selected operations in checkInput:", taskModel.operations.length);
  }
};

const handleCheckboxChange = (item) => {
  // console.log("the item is: ", item);
  if (item.isChecked) {
    // console.log("item is checked we will push it to selectedOperations");
    taskModel.operations.push(item.id);
  } else {
    const index = taskModel.operations.indexOf(item.id);
    // console.log("item was checked but now we remove it from selectedOperations");
    if (index !== -1) {
      taskModel.operations.splice(index, 1);
    }
  }
  // console.log("Print from handleCheckboxChange", taskModel.operations);
};

const toggleItemCheckbox = (item) => {
  // event.preventDefault();
  item.isChecked = !item.isChecked;
  handleCheckboxChange(item);
  console.log("Log from toggleItemCheckbox: ", item, item.isChecked);
};

onMounted(async () => {
  opsStore.operations.forEach((op) => {
    dummyOperationList.value.push({
      id: op.oId,
      name: op.name,
      isChecked: taskModel.operations.includes(op.oId),
    });
  });
  state.isLoading = false;
});
</script>

<template>
  <div class="just-todo">
    <div class="title has-text-centered">Add new task</div>

    <form @submit.prevent="addTask">
      <div class="field is-grouped is grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model.lazy="taskModel.name"
            class="input"
            type="text"
            id="name"
            placeholder="Name"
            @change="checkInput"
            required
          />
        </p>
        <div class="control is-expanded radios">
          Priority:
          <label v-for="n in 5" :key="n" class="radio" @click="taskModel.priority = n">
            <input
              :value="n"
              v-model="taskModel.priority"
              type="radio"
              name="priority"
              required
            />
            {{ n }}
          </label>
        </div>
      </div>
      <div class="field is-grouped is grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model.lazy="taskModel.number"
            class="input"
            type="text"
            id="number"
            placeholder="Project Number"
            @change="checkInput"
            required
          />
        </p>
        <p class="control is-expanded">
          <input
            v-model.lazy="taskModel.client"
            class="input"
            type="text"
            id="client"
            placeholder="Client"
            @change="checkInput"
            required
          />
        </p>
        <p class="control is-expanded">
          <input
            v-model.lazy="taskModel.dueDate"
            class="input"
            type="date"
            id="dueDate"
            placeholder="Due Date"
            @change="checkInput"
          />
        </p>
      </div>
    </form>
    <div v-if="state.isLoading">
      <pulse-loader />
    </div>
    <div v-else class="columns is-multiline">
      <div
        v-for="item in dummyOperationList"
        :key="item.id"
        ref="item"
        class="card column is-half mb-5"
        :class="{
          'ash-background-success-light': taskModel.operations.includes(item.id),
        }"
        @click.prevent="toggleItemCheckbox(item)"
      >
        <div class="card-content">
          <div class="content">
            <label class="columns is-mobile is-centered">
              <div
                class="column"
                :class="{
                  'has-text-success ': item.isChecked,
                  'line-trough': !item.isChecked,
                }"
              >
                {{ item.name }}
              </div>
              <div class="column has-text-right">
                <button
                  :class="item.isChecked ? 'is-success' : 'is-cancel'"
                  class="button"
                >
                  {{ `${item.isChecked ? " ✓ " : " ✗ "}` }}
                </button>
              </div>
            </label>
          </div>
        </div>
      </div>

      <p class="control">
        <button
          type="submit"
          :disabled="!taskModel.isValid"
          class="button is-info"
          @click="addNewTask"
        >
          Add
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.checkbox-label {
  align-items: center;
  cursor: pointer;
  margin: 2em;
}

.checkbox-label {
  color: gray;
  text-decoration: line-through;
}

.checkbox-label.checked {
  color: green;
  text-decoration: none;
}

input[type="checkbox"] {
  display: none;
}

.just-todo {
  /* max-width: 400px; */
  margin: 0 auto;
  padding: 10px;
}

.line-trough {
  text-decoration: line-through;
}

.card {
  padding: 1px;
  margin: 0px;
}

.card-content {
  padding: 10px;
  font-size: x-large;
}
</style>
