<script setup>
import { RouterLink } from "vue-router";
import { useTaskSnapStore } from "@/stores/useTaskSnapStore";
import { useOpsStore } from "@/stores/useOpsStore";

const theStore = useTaskSnapStore();
const opsStore = useOpsStore();
</script>

<template>
  <div class="navbar-menu">
    <!-- navbar items -->
    <div class="navbar-start">
      <div class="navbar-item">
        <image :src="'@/assets/logo.png'" />
      </div>
      <div class="navbar-item">
        ПРОЕКТИ за {{ opsStore.operations[theStore.operation].bgName }}
      </div>
    </div>

    <div class="navbar-end">
      <!-- navbar items -->
      <div class="navbar-item">Link 3</div>
      <div class="navbar-item">link 4</div>
      <div class="navbar-item">link 5</div>
    </div>
  </div>
</template>
