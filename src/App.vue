<script setup>
/*
    imports
*/
import { ref, onMounted } from "vue";
import {
  collection, onSnapshot,
  doc,  addDoc,  deleteDoc,  updateDoc,
  query,  orderBy, limit
} from "firebase/firestore";
import { db } from "@/firebase";

const newTodoContent = ref("");
/*
 firebase refs
*/
const todosCollectionRef = collection(db, "todos");
const todosCollectionQuery = query(todosCollectionRef, orderBy("date", "desc"), limit(10));

/*
  add todo
*/
const addTodo = async () => {
  await addDoc(todosCollectionRef, {
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
  await deleteDoc(doc(todosCollectionRef, id));
};

/*
  toggle todo status
*/
const toggleDone = async (id) => {
  const index = todos.value.findIndex((todo) => todo.id === id);

  await updateDoc(doc(todosCollectionRef, id), {
    done: !todos.value[index].done,
  });
};

/*
  todos
*/
const todos = ref([]);

/*
  get todos
*/
onMounted(async () => {
  onSnapshot(todosCollectionQuery, (querySnapshot) => {
    const fbTodos = [];
    querySnapshot.forEach((doc) => {
      const todo = {
        id: doc.id,
        content: doc.data().content,
        done: doc.data().done,
      };
      fbTodos.push(todo);
    });
    todos.value = fbTodos;
    console.log(todos.value);
  });
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
      v-for="todo in todos"
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
