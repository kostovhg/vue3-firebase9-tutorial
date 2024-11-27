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
    console.log(newTaskModel);
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
  // console.log(selectedOperations.value);
};

const toggleItemCheckbox = (item) => {
  // event.preventDefault();
  item.isChecked = !item.isChecked;
  console.log("Log from toggleItemCheckbox: ", item.isChecked);
};

onMounted(() => {
  selectedOperations.value = ["1", "2", "11", "15"];
  unsubscribe.value = getOperations((updatedDocuments) => {
    operations.value = updatedDocuments.sort((a, b) => a.id - b.id);
    // for (let i = 0; i < operations.value.length; i++) {
    //   // if (selectedOperations.value.includes(operations.value[i].id)) {
    //   //   operations.value[i].isChecked = true;
    //   // } else {
    //   //   operations.value[i].isChecked = false;
    //   // }
    //   operations.value[i].isChecked = selectedOperations.value.includes(
    //     operations.value[i].id
    //   );
    // }
    for (const id of selectedOperations.value) {
      const foundItem = operations.value.find((item) => item.id === id);
      if (foundItem) {
        foundItem.isChecked = true; // Set initial checked state directly
      }
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
  <!-- <div class="just-todo">
    <div class="title has-text-centered">Add Task</div>
    <form @submit.prevent="addTask">
      <div class="field is-grouped is grouped mb-5"></div>
      <div>
        <label>Available Operations:</label>
        <ol>
          <div class="card mb-5 ash-background-success-light">
            <div class="card-content">
              <div class="">
                <div class="columns is-mobile">
                  <li v-for="item in operations" :key="item.id" ref="item">
                    <label
                      class="column"
                      :class="{
                        'checkbox-label': true,
                        checked: item.isChecked,
                      }"
                    >
                      {{ item.name }}
                      <input
                        type="checkbox"
                        class="column is-5"
                        :id="item.id"
                        :value="item.id"
                        v-model.lazy="item.isChecked"
                        @change="handleCheckboxChange(item)"
                      />
                    </label>
                    <button
                      class="button"
                      type="button"
                      :class="{
                        'is-success': item.isChecked,
                        'is-danger': !item.isChecked,
                      }"
                      @click.stop="toggleItemCheckbox(item)"
                    >
                      {{ `${item.isChecked ? " ✓ " : " ✗ "}` }}
                    </button>
                  </li>
                </div>
              </div>
            </div>
          </div>
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
  <div class="just-todo">
    <div class="title has-text-centered">Badass Todo</div>

    <form @submit.prevent="addTodo">
      <div class="field is-grouped is-grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model="dummyTask.name"
            class="input"
            type="text"
            placeholder="Add Name"
          />
        </p>
        <p class="control"></p>
      </div>

      <div
        v-for="item in operations"
        :key="item.id"
        ref="item"
        class="card mb-5"
        :class="{
          'ash-background-success-light': item.isChecked,
        }"
      >
        <div class="card-content">
          <div class="content">
            <div class="columns is-mobile is-vcentered">
              <div
                class="column"
                :class="{
                  'has-text-success line-trough': item.isChecked}"
              >
                {{ todo.content }}
              </div>
              <div class="column is-5 has-text-right">
                <button
                  :class="todo.done ? 'is-success' : 'is-light'"
                  @click="toggleItemCheckbox(op.id)"
                  class="button"
                >
                  &check;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button :disabled="!dummyTask.isValid" class="button is-info">Add</button>
    </form>
  </div> -->
  <div class="just-todo">
    <div class="title has-text-centered">Add new task</div>

    <form @submit.prevent="addTask">
      <div class="field is-grouped is-grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model.lazy="dummyTask.name"
            class="input"
            type="text"
            placeholder="Add a todo"
            required
          />
        </p>
        <p class="control">
          <button :disabled="!dummyTask.isValid" class="button is-info">
            Add
          </button>
        </p>
      </div>
    </form>
    <div
      v-for="item in operations"
      :key="item.id"
      ref="item"
      class="card mb-5"
      :class="{
        'ash-background-success-light': selectedOperations.includes(item.id),
      }"
    >
      <div class="card-content">
        <div class="content">
          <div class="columns is-mobile is-vcentered">
            <label
              class="column"
              :class="{ 'has-text-success line-trough': item.isChecked }"
            >
              {{ item.name }}
            </label>
              <!-- <imput
                type="checkbox"
                :id="item.id"
                :value="item.id"
                v-model.lazy="item.isChecked"
                @change="handleCheckboxChange(item)"
              /> -->
              <div class="column is-5 has-text-right">
                <button
                  :class="item.isChecked ? 'is-success' : 'is-light'"
                  @click="toggleItemCheckbox(item)"
                  class="button"
                >
                  {{ `${item.isChecked ? " ✓ " : " ✗ "}` }}
                </button>
              </div>

          </div>
        </div>
      </div>
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
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.line-trough {
  text-decoration: line-through;
}
</style>
