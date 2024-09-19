function plotScatterplot() {
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#svg_scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("static/data/penguins_clean.csv").then( function(data) {

    // Add X axis body mass g
    const x = d3.scaleLinear()
    .domain([2600, 6300])
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

    // Add Y axis flipper length mm
    const y = d3.scaleLinear()
    .domain([170, 231])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Create a tooltip
    const tooltip = d3.select("#svg_scatterplot")
    .append("div")
    .attr("class", "tooltip")
    .classed("tooltip", true)

    const mouseover = function (event, d) {
        tooltip.style("opacity", 0.8)

        // Select the corresponding dot in the scatterplot
        d3.select("#svg_scatterplot")
                .selectAll("circle")
                .filter((cd, i) => cd.body_mass_g === d.body_mass_g && cd.flipper_length_mm === d.flipper_length_mm)
                .classed("highlight-encircle", true);

        d3.select("#svg_island_bar")
                .selectAll("rect")
                .filter((cd, i) => cd.island ===  d.island)
                .style("fill", "coral")
                .classed("highlight-encircle", true);
        
        d3.select("#svg_sex_bar")
                .selectAll("rect")
                .filter((cd, i) => cd.sex ===  d.sex)
                .style("fill", "coral")
                .classed("highlight-encircle", true);
        
        d3.select("#svg_species_bar")
                .selectAll("rect")
                .filter((cd, i) => cd.species ===  d.species)
                .style("fill", "coral")
                .classed("highlight-encircle", true);
    }

    const mousemove = function (event, d) {
        // Show the tooltip
        tooltip.html(`The body mass of this penguin is ${d.body_mass_g}g, and flipper length is ${d.flipper_length_mm}mm`)
                .style("left", (event.x + 20) + "px")
                .style("top", (event.y + 20) + "px")

    }

    const mouseleave = function (event, d) {
        // Hide the tooltip
        tooltip.style("opacity", 0)

        // Unselect the selected dot in the scatterplot
        d3.select("#svg_scatterplot")
                .selectAll("circle")
                .filter((cd, i) => cd.body_mass_g === d.body_mass_g && cd.flipper_length_mm === d.flipper_length_mm)
                .classed("highlight-encircle", false)

        d3.select("#svg_island_bar")
                .selectAll("rect")
                .filter((cd, i) => cd.island ===  d.island)
                .style("fill", null)
                .classed("highlight-encircle", false);
        
        d3.select("#svg_sex_bar")
                .selectAll("rect")
                .filter((cd, i) => cd.sex ===  d.sex)
                .style("fill", null)
                .classed("highlight-encircle", false);
        
        d3.select("#svg_species_bar")
                .selectAll("rect")
                .filter((cd, i) => cd.species ===  d.species)
                .style("fill", null)
                .classed("highlight-encircle", false);
    }

    // Add dots
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
        .attr("cx", function (d) { return x(d.body_mass_g); } )
        .attr("cy", function (d) { return y(d.flipper_length_mm); } )
        .attr("r", 6)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

})
}


