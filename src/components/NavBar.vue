<script setup>
import { RouterLink, useRoute } from "vue-router";
import { useTaskSnapStore } from "@/stores/useTaskSnapStore";
import { useOpsStore } from "@/stores/useOpsStore";
import brandImg from "@/assets/brandImg.png";
import { computed } from "vue";

const theStore = useTaskSnapStore();
const opsStore = useOpsStore();
const route = useRoute();

const toggleIsActive = () => {
  document.getElementById("navMenu").classList.toggle("is-active");
  document.getElementById("burgerIcon").classList.toggle("is-active");
};
const getHeading = () => {
  const path = computed(() => route.path);
  cases: switch (path.value) {
    case "/":
      return "Дневник на проектите";
    case "/create":
      return "Създаване на проект";
    case "/tasks":
      return "Всички задачи";
    case "/manage":
      return "Manage";
    default:
      return `Aктивни проекти за ${opsStore.getOperationBgName(route.params.oId)}`;
  }
};
</script>

<template>
  <nav
    class="navbar is-fixed-top is-spaced has-shadow"
    role="navigation"
    arial-label="main navigation"
  >
    <!-- <div class="container-fluid"> -->
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img :src="brandImg" class="navbar-brand" alt="logo" />
      </a>
      <h1 class="navbar-item" style="align-content: baseline">{{ getHeading() }}</h1>
      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click.prevent="toggleIsActive"
        id="burgerIcon"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" id="navMenu">
      <div class="navbar-end">
        <div class="navbar-item">
          <RouterLink class="nav-link" to="/create">Нов проект</RouterLink>
        </div>
        <div class="navbar-item">
          <RouterLink class="nav-link" to="/tasks">Всички проекти</RouterLink>
        </div>
        <div class="navbar-item">
          <router-link class="nav-link" to="/manage">График</router-link>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </nav>
</template>
