import * as d3 from "d3";

function readData(path) {
    return d3.csv(path, d => {
        return {
            Screen_Tech: d.Screen_Tech,
            "Mean(Labelled energy consumption (kWh/year))": +d["Mean(Labelled energy consumption (kWh/year))"]
        };

        }).then(data => {
            console.log(data);
            console.log(data.length);
            console.log(d3.max(data, d => d["Mean(Labelled energy consumption (kWh/year))"]));
            console.log(d3.min(data, d => d["Mean(Labelled energy consumption (kWh/year))"]));
            console.log(d3.extent(data, d => d["Mean(Labelled energy consumption (kWh/year))"]));

            return data;
        });

}

export default readData;