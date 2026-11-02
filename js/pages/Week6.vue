<script setup>
import { onMounted } from "vue";
import * as d3 from "d3";
import drawHistogram from "../week6/Histogram.js";
import loadData from "../week6/load-data.js";

onMounted(async () => {
  const data = await loadData();
  const histogramContainer = d3.select("#histogram");
  drawHistogram(histogramContainer, data);
});
</script>

<template>
<header>

<h1>TV Energy Consumption</h1>

</header>

<main>
    <div>
        <h1>Energy Consumption for different TV screen types and sizes</h1>
        <p>TV's vary considerably in energy consumption.</p>
    </div>
    <!-- div for chart -->
    <div id="histogram" class="responsive-svg-container"></div>
    <div class="body">
        <h3>Data source</h3>
        <p>
            <a href="https://data.gov.au/data/dataset/energy-rating-for-household-appliances">
                Energy Rating Data for household appliances – Televisions
            </a><br>
            Downloaded Jan 2026
        </p>
    </div>
</main>

<footer>
    <p>&copy; Data Visualisation Week 6</p>
</footer>
</template>