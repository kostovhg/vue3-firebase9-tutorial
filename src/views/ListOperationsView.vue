<script setup>
import router from "@/router";
import { ref, inject } from "vue";
import { onMounted, onUnmounted } from "vue";
import { RouterView } from "vue-router";

const operationsList = ref([]);

const simulateLink = (id) => {
  console.log(id);
  router.push(`/tasks/${id}`);
};

onMounted(() => {
  operationsList.value = inject("operationsData").sort((a, b) => a.id - b.id);
});
</script>

<template>
  <div class="just-todo">
    <div class="title has-text-centered">Избери операция за списък със задачите</div>

    <div class="columns is-multiline">
      <div
        v-for="item in operationsList"
        :key="item.id"
        ref="item"
        class="card column is-half mb-5"
        :class="{
          'ash-background-success-light': true,
        }"
        @click.prevent="simulateLink(item.id)"
      >
        <!-- TODO: change dynamic class to be marked 
        if there is available tasks for that operation -->
        <div class="card-content">
          <div class="content">
            <label class="columns is-mobile is-centered">
              <div class="column">
                {{ item.name }}
              </div>
              <!-- <div class="column has-text-right">
                <button
                  :class="item.isChecked ? 'is-success' : 'is-cancel'"
                  class="button"
                >
                  {{ `${item.isChecked ? " ✓ " : " ✗ "}` }}
                </button>
              </div> -->
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
