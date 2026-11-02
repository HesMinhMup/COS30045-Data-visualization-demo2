import * as d3 from "d3";

export default class Barchart {
    constructor(svg, data, xAxis, yAxis) {
        if (!Array.isArray(data)) {
            throw new TypeError(
                "Barchart: data must be an array."
            );
        }

        if (data.length === 0) {
            throw new Error(
                "Barchart: data must not be empty."
            );
        }

        if (typeof xAxis !== "string" || xAxis.trim() === "") {
            throw new TypeError(
                "Barchart: xAxis must be a non-empty string."
            );
        }

        if (typeof yAxis !== "string" || yAxis.trim() === "") {
            throw new TypeError(
                "Barchart: yAxis must be a non-empty string."
            );
        }

        for (let i = 0; i < data.length; i++) {
            const d = data[i];

            if (d === null || typeof d !== "object" || Array.isArray(d)) {
                throw new TypeError(
                    `Barchart: data[${i}] must be an object.`
                );
            }

            if (!(xAxis in d)) {
                throw new Error(
                    `Barchart: data[${i}] is missing property "${xAxis}".`
                );
            }

            if (!(yAxis in d)) {
                throw new Error(
                    `Barchart: data[${i}] is missing property "${yAxis}".`
                );
            }

            if (typeof d[yAxis] !== "number" || !Number.isFinite(d[yAxis])) {
                throw new TypeError(
                    `Barchart: data[${i}].${yAxis} must be a finite number.`
                );
            }
        }

        this.svg = svg;
        this.data = data;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.direction = "vertical";

        this.xLabel = "X Axis";
        this.yLabel = "Y Axis";
        this.fillColor = "steelblue";
        this.hoverColor = "orange";
    }

    switchDirection() {
        this.direction = this.direction === "vertical" ? "horizontal" : "vertical";
    }

    setXLabel(label) {
        this.xLabel = label;
    }

    setYLabel(label) {
        this.yLabel = label;
    }

    setFillColor(color) {
        this.fillColor = color;
    }

    setHoverColor(color) {
        this.hoverColor = color;
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
            "Barchart: SVG must have a valid viewBox, width/height, or rendered size."
        );
    }
    
    render() {
        const { width: svgWidth, height: svgHeight } =
            this.getSvgSize(this.svg);

        const chartWidth = svgWidth * 0.8;
        const chartHeight = svgHeight * 0.8;

        const offsetX = (svgWidth - chartWidth) / 2;
        const offsetY = (svgHeight - chartHeight) / 2;

        const chart = this.svg.append("g")
            .attr("class", "chart")
            .attr("transform", `translate(${offsetX}, ${offsetY})`);

        let scaleCategory;
        let scaleValue;
        let categoryAxis;
        let valueAxis;

        if (this.direction === "vertical") {
            scaleCategory = d3.scaleBand()
                .domain(this.data.map(d => d[this.xAxis]))
                .range([0, chartWidth])
                .padding(0.2);

            scaleValue = d3.scaleLinear()
                .domain([0, d3.max(this.data, d => d[this.yAxis])])
                .range([chartHeight, 0])
                .nice();

            categoryAxis = chart.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0, ${chartHeight})`)
                .call(d3.axisBottom(scaleCategory));

            valueAxis = chart.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(scaleValue));

            const bars = chart.append("g")
                .attr("class", "bars");

            bars.selectAll("rect")
                .data(this.data)
                .join("rect")
                .attr("x", d => scaleCategory(d[this.xAxis]))
                .attr("y", d => scaleValue(d[this.yAxis]))
                .attr("width", scaleCategory.bandwidth())
                .attr("height", d => chartHeight - scaleValue(d[this.yAxis]))
                .attr("fill", this.fillColor)
                .on("mouseover", (event) => {
                    d3.select(event.currentTarget)
                        .attr("fill", this.hoverColor);
                })
                .on("mouseout", (event) => {
                    d3.select(event.currentTarget)
                        .attr("fill", this.fillColor);
                });

            bars.selectAll(".bar-label")
                .data(this.data)
                .join("text")
                .attr("class", "bar-label")
                .attr("x", d =>
                    scaleCategory(d[this.xAxis]) + scaleCategory.bandwidth() / 2
                )
                .attr("y", d => scaleValue(d[this.yAxis]) - 8)
                .attr("text-anchor", "middle")
                .text(d => d[this.yAxis]);
        } else {
            scaleCategory = d3.scaleBand()
                .domain(this.data.map(d => d[this.xAxis]))
                .range([0, chartHeight])
                .padding(0.2);

            scaleValue = d3.scaleLinear()
                .domain([0, d3.max(this.data, d => d[this.yAxis])])
                .range([0, chartWidth])
                .nice();

            categoryAxis = chart.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(scaleCategory));

            valueAxis = chart.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0, ${chartHeight})`)
                .call(d3.axisBottom(scaleValue));

            const bars = chart.append("g")
                .attr("class", "bars");

            bars.selectAll("rect")
                .data(this.data)
                .join("rect")
                .attr("x", 0)
                .attr("y", d => scaleCategory(d[this.xAxis]))
                .attr("width", d => scaleValue(d[this.yAxis]))
                .attr("height", scaleCategory.bandwidth())
                .attr("fill", this.fillColor)
                .on("mouseover", (event) => {
                    d3.select(event.currentTarget)
                        .attr("fill", this.hoverColor);
                })
                .on("mouseout", (event) => {
                    d3.select(event.currentTarget)
                        .attr("fill", this.fillColor);
                });
            
            bars.selectAll(".bar-label")
                .data(this.data)
                .join("text")
                .attr("class", "bar-label")
                .attr("x", d => scaleValue(d[this.yAxis]) + 8)
                .attr("y", d =>
                    scaleCategory(d[this.xAxis]) + scaleCategory.bandwidth() / 2
                )
                .attr("dominant-baseline", "middle")
                .text(d => d[this.yAxis]);
        }

        chart.append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", chartWidth / 2)
            .attr("y", chartHeight + 60)
            .text(this.direction === "vertical" ? this.xLabel : this.yLabel);

        chart.append("text")
            .attr("class", "y-axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(-60, ${chartHeight / 2}) rotate(-90)`)
            .text(this.direction === "vertical" ? this.yLabel : this.xLabel);
    }

}