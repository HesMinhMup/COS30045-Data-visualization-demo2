import * as d3 from "d3";

const margin = {top: 40, right: 30, bottom: 50, left: 70};
const width = 800;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const barColor = "steelblue";
const bodyBackgroundColor = "#f5f5f5";

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

const binGenerator = d3.bin().value(d => d.energyConsumption)

const filters_screen = [
    {id:"ALL", label:"ALL", isActive: true},
    {id:"LED", label:"LED", isActive: false},
    {id:"LCD", label:"LCD", isActive: false},
    {id:"OLED", label:"OLED", isActive: false},
]

export {margin, width, height, innerWidth, innerHeight, barColor, bodyBackgroundColor, xScale, yScale, binGenerator, filters_screen};