function plotIsland() {
    // set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 60},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#svg_island_bar")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("static/data/island_counts.csv").then( function(data) {

    // X axis
    const x = d3.scaleBand()
                    .range([ 0, width ])
                    .domain(data.map(d => d.island))
                    .padding(0.2);
    svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
                    .domain([0, 170])
                    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Create a tooltip_island
    const tooltip_island = d3.select("#svg_island_bar")
    .append("div")
    .attr("class", "tooltip")
    .classed("tooltip", true)

    //Mouse event functions for bars
    const mouseover = function (event, d) {
        tooltip_island.style("opacity", 0.8)

        d3.select("#svg_scatterplot")
            .selectAll("circle")
            .classed("highlight-encircle", (cd, i) => cd.island === d.island)
            .filter((cd, i) => cd.island === d.island)
            .style('opacity', 1.0);

        svg.selectAll('rect')
            .filter((cd, i) => cd.island === d.island)
            .classed("highlight-encircle", true);
    }

    const mousemove = function (event, d) {
        // Show the tooltip_island
        tooltip_island.html(`The number of penguins living on island ${d.island} is ${d.count}.`)
                .style("left", (event.x + 20) + "px")
                .style("top", (event.y + 20) + "px")

    }

    const mouseleave = function (event, d) {
        tooltip_island.style("opacity", 0)
        d3.select("#svg_scatterplot")
            .selectAll("circle")
            .classed("highlight-encircle", false)
            .style('opacity', null);

        svg.selectAll('rect')
            .filter((cd, i) => cd.island === d.island)
            .classed("highlight-encircle", false);
    }

    // Bars
    svg.selectAll("mybar")
            .data(data)
            .join("rect")
            .attr("x", d => x(d.island))
            .attr("y", d => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.count))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

    // Island color scheme
    var islandColor = d3.scaleOrdinal()
                        .domain(data.map(d => d.island))
                        .range(d3.schemeSet3);


    // Mouseover functions for entire chart
    const mouseover_islandbarchart = function (event, d) {
        // Select the corresponding dot in the scatterplot
        d3.select("#svg_scatterplot")
            .selectAll("circle")
            .style("fill", function(d, i) { return islandColor(d.island); });

        svg.selectAll('rect')
            .style("fill", function(d, i) { return islandColor(d.island); });
    }

    const mouseleave_islandbarchart = function (event, d) {
        // Select the corresponding dot in the scatterplot
        d3.select("#svg_scatterplot")
            .selectAll("circle")
            .style("fill", null);
        
        svg.selectAll('rect')
            .style("fill", null);
    }

    svg.on("mouseover", mouseover_islandbarchart)
       .on("mouseleave", mouseleave_islandbarchart);

})
}



