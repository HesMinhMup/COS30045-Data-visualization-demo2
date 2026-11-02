<script setup>
import { RouterView, RouterLink } from 'vue-router';

</script>
<template>
  <nav>
    <button>
      <RouterLink to="/">week4-5</RouterLink>
    </button>
    <button>
      <RouterLink to="/week6">week6</RouterLink>
    </button>
    <button>
      <RouterLink to="/pic">Pic</RouterLink>
    </button>
    <button>
      <RouterLink to="/coordinate">Coordinate</RouterLink>
    </button>
  </nav>
  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  justify-content: right;
  margin-bottom: 20px;
}
button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>