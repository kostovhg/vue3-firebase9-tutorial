<script setup>
import router from "@/router";
import { ref, inject, onMounted, onUnmounted } from "vue";
import { RouterView } from "vue-router";
import { useOpsStore } from "@/stores/useOpsStore";

const opsStore = useOpsStore();
const operationsList = ref([]);

const goToOperation = (id) => {
  router.push(`/tasks/${id}`);
};

onMounted(() => {
  operationsList.value = opsStore.operations;
});
</script>

<template>
  <div class="just-todo">
    <div class="title has-text-centered">Избери операция за списък със задачите</div>

    <div class="columns is-multiline">
      <div
        v-for="item in operationsList"
        :key="item.oId"
        ref="item"
        class="card column is-half mb-5"
        :class="{
          'ash-background-success-light': true,
        }"
        @click.prevent="goToOperation(item.oId)"
      >
        <!-- TODO: change dynamic class to be marked 
        if there is available tasks for that operation -->
        <div class="card-content">
          <div class="content">
            <label class="columns is-mobile is-centered">
              <div class="column">
                {{ item.name }}
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
