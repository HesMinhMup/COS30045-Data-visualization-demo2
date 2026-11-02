import * as d3 from "d3";
import scvUrl from "../data/Ex6_TVdata_withStar.csv?url";

function loadData() {
    return d3.csv(scvUrl, d => {
        return {
            brand: d.brand,
            model: d.model,
            screenSize: +d.screenSize,
            screenTech: d.screenTech,
            energyConsumption: +d.energyConsumption,
            star: +d.star
        };
    }).then(data => {
        console.log(data);

        return data;
    });
}

export default loadData;