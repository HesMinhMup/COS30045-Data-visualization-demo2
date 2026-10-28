
<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const svg = ref(null);

onMounted(() => {
    const background = d3.select(svg.value)
        .append('g')
        .attr('class', 'background');

    background.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', '100%')
        .attr('height', '70%')
        .attr('fill', 'blue');

    background.append('rect')
        .attr('x', 0)
        .attr('y', '70%')
        .attr('width', '100%')
        .attr('height', '40%')
        .attr('fill', 'green');

    const foreground = d3.select(svg.value)
        .append('g')
        .attr('class', 'foreground');

    const sun = foreground.append('circle')
        .attr('class', 'sun')
        .attr('cx', 450)
        .attr('cy', 100)
        .attr('r', 50)
        .attr('fill', 'yellow');

    const house = foreground.append('g')
        .attr('class', 'house')
        .attr('transform', 'translate(200, 300)');

    house.append('rect')
        .attr('class', 'house-body')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 200)
        .attr('height', 200)
        .attr('fill', 'brown');

    house.append('polygon')
        .attr('class', 'house-roof')
        .attr('points', '0,0 100,-100 200,0')
        .attr('fill', 'gray');

    house.append('rect')
        .attr('class', 'house-door')
        .attr('x', 75)
        .attr('y', 100)
        .attr('width', 50)
        .attr('height', 100)
        .attr('fill', 'white');

    house.append('circle')
        .attr('class', 'house-door-knob')
        .attr('cx', 120)
        .attr('cy', 150)
        .attr('r', 5)
        .attr('fill', 'black');

    const windows = house.append('g')
        .attr('class', 'house-windows');

    windows.append('rect')
        .attr('class', 'house-window')
        .attr('x', 120)
        .attr('y', 40)
        .attr('width', 50)
        .attr('height', 50)
        .attr('fill', 'lightblue');

    windows.append('rect')
        .attr('class', 'house-window')
        .attr('x', 30)
        .attr('y', 40)
        .attr('width', 50)
        .attr('height', 50)
        .attr('fill', 'lightblue');

    const windowCrosses = windows.append('g')
        .attr('class', 'house-window-crosses');

    windowCrosses.append('line')
        .attr('x1', 145)
        .attr('y1', 40)
        .attr('x2', 145)
        .attr('y2', 90)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
    
    windowCrosses.append('line')
        .attr('x1', 120)
        .attr('y1', 65)
        .attr('x2', 170)
        .attr('y2', 65)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    windowCrosses.append('line')
        .attr('x1', 55)
        .attr('y1', 40)
        .attr('x2', 55)
        .attr('y2', 90)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    windowCrosses.append('line')
        .attr('x1', 30)
        .attr('y1', 65)
        .attr('x2', 80)
        .attr('y2', 65)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    const chimney = house.append('g')
        .attr('class', 'house-chimney');

    chimney.append('rect')
        .attr('x', 130)
        .attr('y', -100)
        .attr('width', 30)
        .attr('height', 80)
        .attr('fill', 'darkred');

    const smoke = chimney.append('g')
        .attr('class', 'house-smoke');

    smoke.append('circle')
        .attr('cx', 145)
        .attr('cy', -110)
        .attr('r', 10)
        .attr('fill', 'lightgray');

    smoke.append('circle')
        .attr('cx', 155)
        .attr('cy', -130)
        .attr('r', 15)
        .attr('fill', 'lightgray');

    smoke.append('circle')
        .attr('cx', 165)
        .attr('cy', -150)
        .attr('r', 20)
        .attr('fill', 'lightgray');

    const tree = foreground.append('g')
        .attr('class', 'tree')
        .attr('transform', 'translate(100, 350)');

    tree.append('rect')
        .attr('class', 'tree-trunk')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 30)
        .attr('height', 100)
        .attr('fill', 'saddlebrown');

    tree.append('circle')
        .attr('class', 'tree-foliage')
        .attr('cx', 15)
        .attr('cy', -30)
        .attr('r', 50)
        .attr('fill', 'green');

    tree.append('circle')
        .attr('class', 'tree-foliage')
        .attr('cx', 50)
        .attr('cy', -65)
        .attr('r', 50)
        .attr('fill', 'green');

    tree.append('circle')
        .attr('class', 'tree-foliage')
        .attr('cx', -20)
        .attr('cy', -65)
        .attr('r', 50)
        .attr('fill', 'green');

    const path = foreground.append('g')
        .attr('class', 'path');

    const leftLineData = [
        { x: 285, y: 500 },
        { x: 260, y: 515 },
        { x: 170, y: 535 },
        { x: 190, y: 565 },
        { x: 280, y: 600 }
    ];

    const rightLineData = [
        { x: 315, y: 500 },
        { x: 290, y: 515 }, 
        { x: 195, y: 535 }, 
        { x: 215, y: 565 }, 
        { x: 330, y: 600 }
    ];

    const lineGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveBasis);

    path.append("path")
        .attr("d", lineGenerator(leftLineData))
        .attr("fill", "none")
        .attr("stroke", "yellow")
        .attr("stroke-width", 4);

    path.append("path")
        .attr("d", lineGenerator(rightLineData))
        .attr("fill", "none")
        .attr("stroke", "yellow")
        .attr("stroke-width", 4);

});
</script>

<template>
    <svg
        ref="svg"
        width="600"
        height="600"
    ></svg>
</template>

<style scoped>
svg {
    display: block;
    margin: 0 auto;
}
</style>
