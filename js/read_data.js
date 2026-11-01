import * as d3 from "d3";
import csvUrl from "./data/tvBrandCount.csv?url";

function readData() {
    d3.csv(csvUrl, d => {
        return {
            brand: d.brand,
            count: +d.count
        };

        }).then(data => {
            console.log(data);
            console.log(data.length);
            console.log(d3.max(data, d => d.count));
            console.log(d3.min(data, d => d.count));
            console.log(d3.extent(data, d => d.count));
        });
}

export default readData;