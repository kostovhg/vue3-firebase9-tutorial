<script setup>  
import { ref } from "vue";
import { onMounted, onUnmounted } from "vue";
import { RouterView } from "vue-router";


</script>

<template>
    <div class="container">
       <h1>Page 1 - Buttons</h1>
       <div class="button-column">
           <a href="cards.html"><button>Go to Cards Page</button></a>
           <button>Button 1</button>
           <button>Button 2</button>
           <button>Button 3</button>
       </div>
   </div>
</template>