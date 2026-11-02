<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

import readData from '../read_data';
import readData52 from '../read_data52';
import readData53 from '../read_data53';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';

onMounted(async () => {
  const data = await readData();
  const data52 = await readData52();
  const data53 = await readData53();

  const svg = d3.select(".responsive-svg-container")
  .append("svg")
  .attr("class", "responsive-svg")
  .attr("viewBox", "0 0 1200 1600")

  data.sort((a, b) => b["Mean(Labelled energy consumption (kWh/year))"] - a["Mean(Labelled energy consumption (kWh/year))"]); 
  const barChart = new BarChart(svg, data, "Screen_Tech", "Mean(Labelled energy consumption (kWh/year))");
  barChart.setXLabel("Screen_Tech");
  barChart.setYLabel("Mean(Labelled energy consumption (kWh/year))");
  barChart.render();

  const lineChartSvg = d3.select(".line-chart")
  .append("svg")
  .attr("class", "responsive-svg")
  .attr("viewBox", "0 0 1200 1600")

  const lineChart = new LineChart(lineChartSvg, data52, "year", "average_price");
  lineChart.setXLabel("Year");
  lineChart.setYLabel("Average Price");
  lineChart.render();

  const pieChartSvg = d3.select(".donut-chart")
  .append("svg")
  .attr("class", "responsive-svg")
  .attr("viewBox", "0 0 1200 1600")

  const pieChart = new PieChart(pieChartSvg, data53, "Size", "Count");
  pieChart.switchToDonut();
  pieChart.render();
});
</script>

<template>
  <div class="responsive-svg-container">
  </div>

  <div class="line-chart">
  </div>

  <div class="donut-chart">
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

.line-chart {
  border: 1px solid black;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  max-width: 1000px;
}

.donut-chart {
  border: 1px solid black;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  max-width: 1000px;
}
</style>