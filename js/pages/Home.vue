<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

import readData from '../read_data';
import BarChart from '../charts/BarChart';

onMounted(async () => {
  const data = await readData();

  const svg = d3.select(".responsive-svg-container")
  .append("svg")
  .attr("class", "responsive-svg")
  .attr("viewBox", "0 0 1200 1600")

  data.sort((a, b) => b.count - a.count); 
  const barChart = new BarChart(svg, data, "brand", "count");
  barChart.switchDirection();
  barChart.render();
});
</script>

<template>
  <div class="responsive-svg-container">
  </div>
</template>

<style scoped>
.responsive-svg-container {
  border: 1px solid black;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  max-width: 1200px;
}
</style>