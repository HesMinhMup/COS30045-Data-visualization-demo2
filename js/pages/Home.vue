<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const svg = d3.select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 1200 1600")
  .style("border", "1px solid black");

svg
  .append("rect")
  .attr("x", 10)
  .attr("y", 10)
  .attr("width", 414)
  .attr("height", 16)
  .attr("fill", "blue");
</script>

<template>
  <div class="responsive-svg-container">
  </div>
</template>

<style scoped>
.responsive-svg-container {
    margin-right: auto;
    margin-left: auto;
    width: 100%;
    max-width: 1200px;
}
</style>