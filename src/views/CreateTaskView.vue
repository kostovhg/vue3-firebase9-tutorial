<script setup>
import { onMounted, ref, onUnmounted, reactive, inject } from "vue";
import { useRouter } from "vue-router";
import { Task } from "@/mappings/mappings";
import { addTask } from "@/firebase";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { fetchOperations } from "@/firebase";

const router = useRouter();
const toast = useToast();

const operationsList = ref([]);
const ops = ref([]);


const dummyTask = reactive({
  number: "",
  name: "",
  client: "",
  operations: ["1", "2", "11", "15"],
  isValid: false,
});

const state = reactive({
  isLoading: true,
});

const addNewTask = async () => {
  console.log(dummyTask);
  const newTaskModel = new Task(
    dummyTask.number,
    dummyTask.name,
    dummyTask.client,
    dummyTask.operations.sort((a, b) => a - b)
  );
  console.log(newTaskModel);
  try {
    await addTask(newTaskModel);
    toast.success("Task added successfully");
    router.push("/");
  } catch (error) {
    console.error(error);
    toast.error("Error adding task");
  }
};

const checkInput = () => {
  if (
    dummyTask.number &&
    dummyTask.name &&
    dummyTask.client &&
    dummyTask.operations.length > 0
  ) {
    dummyTask.isValid = true;
  } else {
    dummyTask.isValid = false;
    console.log("Selected operations in checkInput:", dummyTask.operations.length);
  }
};

const handleCheckboxChange = (item) => {
  // console.log("the item is: ", item);
  if (item.isChecked) {
    // console.log("item is checked we will push it to selectedOperations");
    dummyTask.operations.push(item.id);
  } else {
    const index = dummyTask.operations.indexOf(item.id);
    // console.log("item was checked but now we remove it from selectedOperations");
    if (index !== -1) {
      dummyTask.operations.splice(index, 1);
    }
  }
  console.log("Print from handleCheckboxChange", dummyTask.operations);
};

const toggleItemCheckbox = (item) => {
  // event.preventDefault();
  item.isChecked = !item.isChecked;
  handleCheckboxChange(item);
  // console.log("Log from toggleItemCheckbox: ", item, item.isChecked);
};

onMounted(async () => {
  ops.value = inject("operationsData");
  // selectedOperations.value = dummyTask.operations;
  if (ops.value.length === 0) {
    await fetchOperations()
      .then((result) => {
        operationsList.value = result.sort((a, b) => a.id - b.id);
      })
      .finally(() => {
        // state.isLoading = false;
      });
  } else {
    // console.log("ops.value", ops.value);
    operationsList.value = ops.value.sort((a, b) => a.id - b.id);
  }

  if (operationsList.value.length > 0) {
    dummyTask.operations.forEach((op) => {
      operationsList.value.find((item) => item.id === op).isChecked = true;
    });
    state.isLoading = false;
  } else {
    console.log("there is no operations", dummyTask.operations);
  }
});
</script>

<template>
  <div class="just-todo">
    <div class="title has-text-centered">Add new task</div>

    <form @submit.prevent="addTask">
      <div class="field is-grouped is grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model.lazy="dummyTask.name"
            class="input"
            type="text"
            id="name"
            placeholder="Name"
            @change="checkInput"
            required
          />
        </p>
      </div>
      <div class="field is-grouped is grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model.lazy="dummyTask.number"
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
            v-model.lazy="dummyTask.client"
            class="input"
            type="text"
            id="client"
            placeholder="Client"
            @change="checkInput"
            required
          />
        </p>
      </div>
    </form>
    <div v-if="state.isLoading">
      <pulse-loader />
    </div>
    <div v-else class="columns is-multiline">
      <div
        v-for="item in operationsList"
        :key="item.id"
        ref="item"
        class="card column is-half mb-5"
        :class="{
          'ash-background-success-light': dummyTask.operations.includes(item.id),
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
          :disabled="!dummyTask.isValid"
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
