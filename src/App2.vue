<script setup>
/*
    imports
*/
import { ref, onMounted, onUnmounted } from "vue";

import { addNew, getTodos, delTodo, updateTodo } from "@/firebase";
import { db } from "@/firebase";

/*
  component specific constants
*/
const todos = ref([]);
const newTodoContent = ref("");
const unsubscribe = ref(null);

/*
  add todo
*/
const addTodo = async () => {
  await addNew({
    content: newTodoContent.value,
    done: false,
    date: Date.now(),
  });
  newTodoContent.value = "";
};

/*
    Delete todo
*/
const deleteTodo = async (id) => {
  await delTodo(id); 
  console.log("Todo deleted with ID: ", id);
};

/*
  toggle todo status
*/
const toggleDone = async (id) => {
  const index = todos.value.findIndex((todo) => todo.id === id);

  await updateTodo(id, {
    done: !todos.value[index].done,
  });
};


/*
  get todos
*/
onMounted( () => {
   unsubscribe.value =  getTodos((updatedDocuments) => {
    todos.value = updatedDocuments;
  });
});

onUnmounted(() => {
  unsubscribe.value();
});
</script>

<template>
  <div class="badass-todo">
    <div class="title has-text-centered">Badass Todo</div>

    <form @submit.prevent="addTodo">
      <div class="field is-grouped is-grouped mb-5">
        <p class="control is-expanded">
          <input
            v-model="newTodoContent"
            class="input"
            type="text"
            placeholder="Add a todo"
          />
        </p>
        <p class="control">
          <button :disabled="!newTodoContent" class="button is-info">
            Add
          </button>
        </p>
      </div>
    </form>
    <div
      v-for="todo in todos" :key="todo.id"
      class="card mb-5"
      :class="{ 'ash-background-success-light': todo.done }"
    >
      <div class="card-content">
        <div class="content">
          <div class="columns is-mobile is-vcentered">
            <div
              class="column"
              :class="{ 'has-text-success line-trough': todo.done }"
            >
              {{ todo.content }}
            </div>
            <div class="column is-5 has-text-right">
              <button
                :class="todo.done ? 'is-success' : 'is-light'"
                @click="toggleDone(todo.id)"
                class="button"
              >
                &check;
              </button>
              <button
                @click="deleteTodo(todo.id)"
                class="button is-danger ml-2"
              >
                &cross;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.badass-todo {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.line-trough {
  text-decoration: line-through;
}
</style>
