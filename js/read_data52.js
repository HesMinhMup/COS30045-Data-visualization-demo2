import * as d3 from "d3";
import csvUrl from "./data/ARE_Spot_Prices.csv?url";

function readData52() {
    return d3.csv(csvUrl, d => {
        return {
            year: +d.Year,
            average_price: +d["Average Price (notTas-Snowy)"]
        };

        }).then(data => {
            console.log(data);
            console.log(data.length);
            console.log(d3.max(data, d => d.average_price));
            console.log(d3.min(data, d => d.average_price));
            console.log(d3.extent(data, d => d.average_price));

            return data;
        });

}

export default readData52;