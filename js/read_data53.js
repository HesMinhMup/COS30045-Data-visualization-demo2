import * as d3 from "d3";
import csvUrl from "./data/tvSizegroupCount.csv?url";

function readData53() {
    return d3.csv(csvUrl, d => {
        return {
            Size: d["Size group"],
            Count: +d.Count
        };

        }).then(data => {
            console.log(data);
            console.log(data.length);
            console.log(d3.max(data, d => d.count));
            console.log(d3.min(data, d => d.count));
            console.log(d3.extent(data, d => d.count));

            return data;
        });

}

export default readData53;