
import * as d3 from "d3";

export default class Linechart {
    constructor(svg, data, xAxis, yAxis) {
        if (!Array.isArray(data)) {
            throw new TypeError(
                "Linechart: data must be an array."
            );
        }

        if (data.length === 0) {
            throw new Error(
                "Linechart: data must not be empty."
            );
        }

        if (typeof xAxis !== "string" || xAxis.trim() === "") {
            throw new TypeError(
                "Linechart: xAxis must be a non-empty string."
            );
        }

        if (typeof yAxis !== "string" || yAxis.trim() === "") {
            throw new TypeError(
                "Linechart: yAxis must be a non-empty string."
            );
        }

        for (let i = 0; i < data.length; i++) {
            const d = data[i];

            if (d === null || typeof d !== "object" || Array.isArray(d)) {
                throw new TypeError(
                    `Linechart: data[${i}] must be an object.`
                );
            }

            if (!(xAxis in d)) {
                throw new Error(
                    `Linechart: data[${i}] is missing property "${xAxis}".`
                );
            }

            if (!(yAxis in d)) {
                throw new Error(
                    `Linechart: data[${i}] is missing property "${yAxis}".`
                );
            }
        }

        this.svg = svg;
        this.data = data;
        this.xAxis = xAxis;
        this.yAxis = yAxis;

        this.xLabel = "X Axis";
        this.yLabel = "Y Axis";

        this.lineColor = "steelblue";
        this.pointColor = "steelblue";
        this.pointHoverColor = "orange";
        this.lineWidth = 2;
        this.pointRadius = 3;
        this.showPoints = true;
    }

    setXLabel(label) {
        this.xLabel = label;
    }

    setYLabel(label) {
        this.yLabel = label;
    }

    setLineColor(color) {
        this.lineColor = color;
    }

    setPointColor(color) {
        this.pointColor = color;
    }

    setPointHoverColor(color) {
        this.pointHoverColor = color;
    }

    setLineWidth(width) {
        if (typeof width !== "number" || !Number.isFinite(width) || width <= 0) {
            throw new TypeError(
                "Linechart: line width must be a positive finite number."
            );
        }

        this.lineWidth = width;
    }

    setPointRadius(radius) {
        if (typeof radius !== "number" || !Number.isFinite(radius) || radius < 0) {
            throw new TypeError(
                "Linechart: point radius must be a non-negative finite number."
            );
        }

        this.pointRadius = radius;
    }

    setShowPoints(show) {
        if (typeof show !== "boolean") {
            throw new TypeError(
                "Linechart: showPoints must be a boolean."
            );
        }

        this.showPoints = show;
    }

    getSvgSize(svg) {
        const node = svg.node();
        const viewBox = node.viewBox.baseVal;

        if (viewBox.width > 0 && viewBox.height > 0) {
            return {
                width: viewBox.width,
                height: viewBox.height
            };
        }

        const width = node.width.baseVal.value;
        const height = node.height.baseVal.value;

        if (width > 0 && height > 0) {
            return { width, height };
        }

        const rect = node.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0) {
            return {
                width: rect.width,
                height: rect.height
            };
        }

        throw new Error(
            "Linechart: SVG must have a valid viewBox, width/height, or rendered size."
        );
    }

    render() {
        const { width: svgWidth, height: svgHeight } =
            this.getSvgSize(this.svg);

        const margin = {
            top: 20,
            right: 30,
            bottom: 60,
            left: 70
        };

        const chartWidth = svgWidth - margin.left - margin.right;
        const chartHeight = svgHeight - margin.top - margin.bottom;

        if (chartWidth <= 0 || chartHeight <= 0) {
            throw new Error(
                "Linechart: SVG is too small for the configured margins."
            );
        }

        this.svg.selectAll(".linechart-container").remove();

        const chart = this.svg.append("g")
            .attr("class", "linechart-container")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const sortedData = [...this.data].sort(
            (a, b) => a[this.xAxis] - b[this.xAxis]
        );

        const xScale = d3.scaleLinear()
            .domain(d3.extent(sortedData, d => d[this.xAxis]))
            .range([0, chartWidth]);

        const yScale = d3.scaleLinear()
            .domain([
                Math.min(0, d3.min(sortedData, d => d[this.yAxis])),
                d3.max(sortedData, d => d[this.yAxis])
            ])
            .range([chartHeight, 0])
            .nice();

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format("d"));

        const yAxis = d3.axisLeft(yScale);

        chart.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);

        chart.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        const lineGenerator = d3.line()
            .x(d => xScale(d[this.xAxis]))
            .y(d => yScale(d[this.yAxis]));

        chart.append("path")
            .datum(sortedData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", this.lineColor)
            .attr("stroke-width", this.lineWidth)
            .attr("d", lineGenerator);

        if (this.showPoints) {
            chart.append("g")
                .attr("class", "points")
                .selectAll("circle")
                .data(sortedData)
                .join("circle")
                .attr("cx", d => xScale(d[this.xAxis]))
                .attr("cy", d => yScale(d[this.yAxis]))
                .attr("r", this.pointRadius)
                .attr("fill", this.pointColor)
                .on("mouseover", (event) => {
                    d3.select(event.currentTarget)
                        .attr("fill", this.pointHoverColor);
                })
                .on("mouseout", (event) => {
                    d3.select(event.currentTarget)
                        .attr("fill", this.pointColor);
                });
        }

        chart.append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", chartWidth / 2)
            .attr("y", chartHeight + 45)
            .text(this.xLabel);

        chart.append("text")
            .attr("class", "y-axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(-50, ${chartHeight / 2}) rotate(-90)`)
            .text(this.yLabel);
    }
}
