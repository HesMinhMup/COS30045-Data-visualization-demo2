
import * as d3 from "d3";

export default class Piechart {
    constructor(svg, data, category, value) {
        if (!Array.isArray(data)) {
            throw new TypeError(
                "Piechart: data must be an array."
            );
        }

        if (data.length === 0) {
            throw new Error(
                "Piechart: data must not be empty."
            );
        }

        if (typeof category !== "string" || category.trim() === "") {
            throw new TypeError(
                "Piechart: category must be a non-empty string."
            );
        }

        if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError(
                "Piechart: value must be a non-empty string."
            );
        }

        for (let i = 0; i < data.length; i++) {
            const d = data[i];

            if (d === null || typeof d !== "object" || Array.isArray(d)) {
                throw new TypeError(
                    `Piechart: data[${i}] must be an object.`
                );
            }

            if (!(category in d)) {
                throw new Error(
                    `Piechart: data[${i}] is missing property "${category}".`
                );
            }

            if (!(value in d)) {
                throw new Error(
                    `Piechart: data[${i}] is missing property "${value}".`
                );
            }

            if (
                typeof d[value] !== "number" ||
                !Number.isFinite(d[value]) ||
                d[value] < 0
            ) {
                throw new TypeError(
                    `Piechart: data[${i}].${value} must be a non-negative finite number.`
                );
            }
        }

        if (data.some(d => d[category] === null || d[category] === undefined)) {
            throw new TypeError(
                `Piechart: "${category}" must not contain null or undefined values.`
            );
        }

        if (d3.sum(data, d => d[value]) <= 0) {
            throw new Error(
                "Piechart: the sum of values must be greater than zero."
            );
        }

        this.svg = svg;
        this.data = data;
        this.category = category;
        this.value = value;

        this.innerRadiusRatio = 0;
        this.padding = 20;
        this.padAngle = 0;
        this.cornerRadius = 0;

        this.colors = d3.schemeTableau10;
        this.showLabels = true;
        this.showPercentages = false;
    }

    switchToDonut() {
        this.innerRadiusRatio = 0.6;
    }

    switchToPie() {
        this.innerRadiusRatio = 0;
    }

    setPadding(padding) {
        if (
            typeof padding !== "number" ||
            !Number.isFinite(padding) ||
            padding < 0
        ) {
            throw new TypeError(
                "Piechart: padding must be a non-negative finite number."
            );
        }

        this.padding = padding;
    }

    setColors(colors) {
        if (!Array.isArray(colors) || colors.length === 0) {
            throw new TypeError(
                "Piechart: colors must be a non-empty array."
            );
        }

        this.colors = colors;
    }

    setPadAngle(angle) {
        if (
            typeof angle !== "number" ||
            !Number.isFinite(angle) ||
            angle < 0
        ) {
            throw new TypeError(
                "Piechart: padAngle must be a non-negative finite number."
            );
        }

        this.padAngle = angle;
    }

    setCornerRadius(radius) {
        if (
            typeof radius !== "number" ||
            !Number.isFinite(radius) ||
            radius < 0
        ) {
            throw new TypeError(
                "Piechart: cornerRadius must be a non-negative finite number."
            );
        }

        this.cornerRadius = radius;
    }

    setShowLabels(show) {
        if (typeof show !== "boolean") {
            throw new TypeError(
                "Piechart: showLabels must be a boolean."
            );
        }

        this.showLabels = show;
    }

    setShowPercentages(show) {
        if (typeof show !== "boolean") {
            throw new TypeError(
                "Piechart: showPercentages must be a boolean."
            );
        }

        this.showPercentages = show;
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
            "Piechart: SVG must have a valid viewBox, width/height, or rendered size."
        );
    }

    render() {
        const { width: svgWidth, height: svgHeight } =
            this.getSvgSize(this.svg);

        const radius = Math.min(svgWidth, svgHeight) / 2 - this.padding;

        if (radius <= 0) {
            throw new Error(
                "Piechart: SVG is too small for the configured padding."
            );
        }

        this.svg.selectAll(".piechart-container").remove();

        const chart = this.svg.append("g")
            .attr("class", "piechart-container")
            .attr("transform", `translate(${svgWidth / 2}, ${svgHeight / 2})`);

        const colorScale = d3.scaleOrdinal()
            .domain(this.data.map(d => d[this.category]))
            .range(this.colors);

        const pieGenerator = d3.pie()
            .value(d => d[this.value])
            .sort(null);

        const arcGenerator = d3.arc()
            .innerRadius(radius * this.innerRadiusRatio)
            .outerRadius(radius)
            .padAngle(this.padAngle)
            .cornerRadius(this.cornerRadius);

        const arcs = pieGenerator(this.data);

        const slices = chart.append("g")
            .attr("class", "slices");

        slices.selectAll("path")
            .data(arcs)
            .join("path")
            .attr("class", "slice")
            .attr("d", arcGenerator)
            .attr("fill", d => colorScale(d.data[this.category]))
            .attr("stroke", "white")
            .attr("stroke-width", 1);

        if (this.showLabels) {
            const labels = chart.append("g")
                .attr("class", "labels");

            labels.selectAll("text")
                .data(arcs)
                .join("text")
                .attr("class", "slice-label")
                .attr("transform", d =>
                    `translate(${arcGenerator.centroid(d)})`
                )
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .text(d => {
                    const category = d.data[this.category];

                    if (this.showPercentages) {
                        const percentage = d3.format(".1%")(
                            d.value / d3.sum(this.data, item => item[this.value])
                        );

                        return `${category}: ${percentage}`;
                    }

                    return category;
                });
        }
    }
}
