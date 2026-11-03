import * as d3 from "d3";
import {margin, width, height, innerWidth, innerHeight, barColor, bodyBackgroundColor, xScale, yScale, binGenerator} from "./Shared-constants.js";

function drawHistogram(container, data) {
    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)

    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const bins = binGenerator(data);
    console.log(bins);

    const minEng = bins[0].x0;
    const maxEng = bins[bins.length - 1].x1;

    const binMaxLength = d3.max(bins, d => d.length);
    console.log("minEng: ", minEng, "maxEng: ", maxEng, "binMaxLength: ", binMaxLength);

    xScale.domain([minEng, maxEng]).range([0, innerWidth]);
    yScale.domain([0, binMaxLength]).range([innerHeight, 0]);

    innerChart.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    innerChart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis);

    innerChart.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
}

export default drawHistogram;
