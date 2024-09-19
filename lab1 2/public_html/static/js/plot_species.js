function plotSpecies() {
        // set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 60},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#svg_species_bar")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("static/data/species_counts.csv").then( function(data) {

        // X axis
        const x = d3.scaleBand()
                        .range([ 0, width ])
                        .domain(data.map(d => d.species))
                        .padding(0.2);
        svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

        // Add Y axis
        const y = d3.scaleLinear()
                        .domain([0, 150])
                        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Create a tooltip_species
        const tooltip_species = d3.select("#svg_species_bar")
                                .append("div")
                                .attr("class", "tooltip")
                                .classed("tooltip", true)

        //Mouse event functions for bars
        const mouseover = function (event, d) {
                tooltip_species.style("opacity", 0.8)

                d3.select("#svg_scatterplot")
                .selectAll("circle")
                .classed("highlight-encircle", (cd, i) => cd.species === d.species)
                .filter((cd, i) => cd.species === d.species)
                .style('opacity', 1.0);

                svg.selectAll('rect')
                .filter((cd, i) => cd.species === d.species)
                .classed("highlight-encircle", true);
        }

        const mousemove = function (event, d) {
                // Show the tooltip_species
                tooltip_species.html(`There are in total ${d.count} ${d.species} penguins.`)
                        .style("left", (event.x + 20) + "px")
                        .style("top", (event.y + 20) + "px")
        
            }

        const mouseleave = function (event, d) {
                tooltip_species.style("opacity", 0)

                d3.select("#svg_scatterplot")
                .selectAll("circle")
                .classed("highlight-encircle", false)
                .style('opacity', null);

                svg.selectAll('rect')
                .filter((cd, i) => cd.species === d.species)
                .classed("highlight-encircle", false);
        }

        // Bars
        svg.selectAll("mybar")
                .data(data)
                .join("rect")
                .attr("x", d => x(d.species))
                .attr("y", d => y(d.count))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.count))
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

        // species color scheme
        var speciesColor = d3.scaleOrdinal()
        .domain(data.map(d => d.species))
        .range(d3.schemeSet1);


        // Mouseover functions for entire chart
        const mouseover_speciesbarchart = function (event, d) {
        // Select the corresponding dot in the scatterplot
        d3.select("#svg_scatterplot")
        .selectAll("circle")
        .style("fill", function(d, i) { return speciesColor(d.species); });

        svg.selectAll('rect')
        .style("fill", function(d, i) { return speciesColor(d.species); });
        }

        const mouseleave_speciesbarchart = function (event, d) {
        // Select the corresponding dot in the scatterplot
        d3.select("#svg_scatterplot")
        .selectAll("circle")
        .style("fill", null);

        svg.selectAll('rect')
        .style("fill", null);
        }

        svg.on("mouseover", mouseover_speciesbarchart)
        .on("mouseleave", mouseleave_speciesbarchart);

})
}



