// Define SVG area dimensions
var svgWidth = 970;
var svgHeight = 500;

// Define the chart's margins
var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
  };

// Calculate chart dimensions
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select the HTML area to build the chart in
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load the data from the CSV
d3.csv("static/data/data.csv").then(data => {

    // Prints the data
    // console.log(data);

    // Ensures type of data is correct
    data.forEach(data => {
        data.age = +data.age
        data.income = +data.income
    });

    // Configure a scale with a range between 0 and the chartWidth
    // d3.extent returns the an array containing the min and max values for the property specified
    var xScale = d3.scaleLinear()
        .range([0, chartWidth])
        .domain(d3.extent(data, data => data.age));

    // Configure a linear scale with a range between the chartHeight and 0
    var yScale = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, d3.max(data, data => data.income)]);
    
    chartGroup.append("g")
        .selectAll('circle').data(data)
        .enter().append('circle')
            .attr('class', 'stateCircle')
            .attr('cx', (data) => xScale(data.age))
            .attr('cy', (data) => yScale(data.income))
            .attr('r', 8)
            .attr("stroke-width", "2")

    chartGroup
        .selectAll('text').data(data)
        .enter().append('text')
            .attr('class', 'stateText')
            .text((data) => (data.abbr))
            .attr("x", (data) => xScale(data.age))
            .attr("y", (data) => yScale(data.income) + 3)
    
    // Generates axes for the chart
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Position axes
    chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", "translate(0, " + chartHeight + ")")
        .call(bottomAxis);
    
    chartGroup.append("g")
        .classed("axis", true)
        .call(leftAxis);
    
    // Plot x-axis title
    chartGroup.append("text")
		.attr("transform", "translate(" + (chartWidth/2) + ", " + (chartHeight + 40) + ")")
		.attr("class", "aText")
		.text("Age (years)");
    
    // Plot y-axis title
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - chartHeight / 2)
        .attr("y", 0 - margin.left + 40)
        .attr("dy", "-1.5em")
        .attr("class", "aText")
        .text("Income (US Dollars)");

    // Plot title
    chartGroup.append("text")
        .attr("transform", "translate(" + (chartWidth/2) + ", " + (-20) + " )")
		.attr("class", "aText")
		.text("Age vs. Income in the USA");
})