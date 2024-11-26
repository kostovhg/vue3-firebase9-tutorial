<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Task } from "@/mapings/Task";
import { addNew, getOperations } from "@/firebase";

const router = useRouter();
const newTaskModel = ref([]);
const operations = ref([]);
const unsubscribe = ref(null);
const selectedOperations = ref([]);
const dummyTask = ref({ number: "", name: "", isValid: false });

const addTask = () => {
  console.log(dummyTask.value);
  try {
    // const number = dummyTask.value.number;
    // const name = dummyTask.value.name;
    // const ops = selectedOperations.value.sort((a, b) => a - b);
    const newTaskModel = new Task(
      dummyTask.value.number,
      dummyTask.value.name,
      selectedOperations.value.sort((a, b) => a - b)
    );
    console.log(newTaskModel)
    addNew(newTaskModel);

    router.push("/");
  } catch (error) {
    console.error(error);
  }
};

const checkInput = () => {
  if (
    dummyTask.value.number &&
    dummyTask.value.name &&
    selectedOperations.value.length > 0
  ) {
    dummyTask.value.isValid = true;
  } else {
    dummyTask.value.isValid = false;
  }
};

const handleCheckboxChange = (item) => {
  if (item.isChecked) {
    selectedOperations.value.push(item.id);
  } else {
    const index = selectedOperations.value.indexOf(item.id);
    if (index !== -1) {
      selectedOperations.value.splice(index, 1);
    }
  }
  console.log(selectedOperations.value);
};

onMounted(() => {
  selectedOperations.value = ["1", "2", "11", "15"];
  unsubscribe.value = getOperations((updatedDocuments) => {
    operations.value = updatedDocuments.sort((a, b) => a.id - b.id);
    for (let i = 0; i < operations.value.length; i++) {
      // if (selectedOperations.value.includes(operations.value[i].id)) {
      //   operations.value[i].isChecked = true;
      // } else {
      //   operations.value[i].isChecked = false;
      // }
      operations.value[i].isChecked = selectedOperations.value.includes(
        operations.value[i].id
      );
    }
    console.log(operations.value);
  });
  console.log(operations.value);

  // Loop through selectedOperations and trigger handleCheckboxChange
  for (const id of selectedOperations.value) {
    const foundItem = operations.value.find((item) => item.id === id);
    if (foundItem) {
      handleCheckboxChange(foundItem);
    }
  }
});

onUnmounted(() => {
  unsubscribe.value();
});
</script>

<template>
  <div class="just-todo">
    <div class="title has-text-centered">Add Task</div>
    <form @submit.prevent="addTask">
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
      <div>
        <label>Available Operations:</label>
        <ol>
          <li v-for="item in operations" :key="item.id" ref="item">
            <label :class="{ 'checkbox-label': true, checked: item.isChecked }">
              {{ item.name }}

              <input
                type="checkbox"
                :id="item.id"
                :value="item.id"
                v-model.lazy="item.isChecked"
                @change="handleCheckboxChange(item)"
              />
              <button
                class="button"
                :class="{
                  'is-success': item.isChecked,
                  'is-danger': !item.isChecked,
                }"
                disabled
              >
                {{ `${item.isChecked ? " ✓ " : " ✗ "}` }}
              </button>
            </label>
          </li>
        </ol>
      </div>
      <p class="control">
        <button
          type="submit"
          :disabled="!dummyTask.isValid"
          class="button is-info"
        >
          Add
        </button>
      </p>
    </form>
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
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.line-trough {
  text-decoration: line-through;
}
</style>
