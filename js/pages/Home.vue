<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

import readData from '../read_data';
import BarChart from '../charts/BarChart';
import csvUrl from "../data/tvTechEnergy.csv?url";

onMounted(async () => {
  const data = await readData(csvUrl);

  const svg = d3.select(".responsive-svg-container")
  .append("svg")
  .attr("class", "responsive-svg")
  .attr("viewBox", "0 0 1200 1600")

  data.sort((a, b) => b["Mean(Labelled energy consumption (kWh/year))"] - a["Mean(Labelled energy consumption (kWh/year))"]); 
  const barChart = new BarChart(svg, data, "Screen_Tech", "Mean(Labelled energy consumption (kWh/year))");
  barChart.setXLabel("Screen_Tech");
  barChart.setYLabel("Mean(Labelled energy consumption (kWh/year))");
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
  max-width: 1000px;
}
</style>