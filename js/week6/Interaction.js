import * as d3 from "d3";
import {
    innerHeight,
    xScale,
    yScale,
    barColor,
    bodyBackgroundColor,
    binGenerator
} from "./Shared-constants.js";

function populateFilters(filtersContainer, filters, chartData) {
    filtersContainer.selectAll(".filter")
        .data(filters)
        .join("button")
        .text(d => d.label)
        .attr("class", d => `filter ${d.isActive ? 'active' : ''}`)
        .on("click", (event, selectedFilter) => {
            if (selectedFilter.isActive) return;

            filters.forEach(filter => {
                filter.isActive = filter.id === selectedFilter.id;
            });

            filtersContainer.selectAll(".filter")
                .classed("active", filter => filter.isActive);

            updateHistogram(chartData, selectedFilter.id);
        });
}

function updateHistogram(data, filterId) {
    const filteredData = filterId === "ALL" ? data : data.filter(d => d.screenTech === filterId);
    const bins = binGenerator(filteredData);
    const maxBinLength = d3.max(bins, d => d.length) || 0;

    xScale.domain([bins[0]?.x0 ?? 0, bins[bins.length - 1]?.x1 ?? 1]);
    yScale.domain([0, maxBinLength]).nice();

    const histogram = d3.select("#histogram");
    histogram.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2)
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0) - 1)
        .attr("height", d => innerHeight - yScale(d.length));

    histogram.select(".x-axis")
        .transition()
        .duration(500)
        .call(d3.axisBottom(xScale));

    histogram.select(".y-axis")
        .transition()
        .duration(500)
        .call(d3.axisLeft(yScale));
}

export { populateFilters, updateHistogram };