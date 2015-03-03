/**
 * Created by jhale on 2/20/2015.
 */

var geneplots = [];

Array.observe(geneplots, function(changeRecords) {
    redrawCharts();
    //console.log('Array observe', changeRecords);
});

function addChart(gene) {
    var chartGene = newdata[getGene(gene)];
    geneplots.push(chartGene);
}

function removeChart(intChart) {
    geneplots.splice(intChart,1);
}

function clickClear() {
    geneplots.splice(0,geneplots.length);
}

function fooUP(selection,i) {
    //console.log("UPDATE "+i);
    d3.select(this).html("");
    //console.log(d3.select(this).datum());
    lineGraph(d3.select(this).datum(),d3.select(this),i,jsontest[0]);
    //displayChart2(d3.select(this).datum(),d3.select(this),i);
}

function fooNEW(selection,i) {
//console.log("NEW "+i);
    if (!selection) {
        console.log("ERROR !!!");
        return;
    }
    lineGraph(selection.datum(),selection,i,jsontest[0]);
    //displayChart2(selection.datum(),selection,i);
}

function redrawCharts() {

    var chartDiv = d3.select("body").select("#genecharts");

    var charts = chartDiv.selectAll("div").data(geneplots,function (d,i) {return i});
    charts.exit().remove();

    if (!charts.empty()) {
        charts.each(fooUP);
    }

    var newCharts = charts.enter();

    if(!newCharts.empty()) {
        var i=charts.data().length-1;
        newCharts.append("div")
            .call(fooNEW,i);
    }

}

function lineGraph(gene,selection,chartIndex,dataset) {
    var chartStages = dataset.Samples;
   // var chartStages = ["CD34","BFU","CFU","Pro"];
    var chartGene = gene;

    var chartwidth = 350,chartheight = 280;

    var margin = {top: 40, right: 20, bottom: 30, left: 50},
        width = chartwidth - margin.left - margin.right,
        height = chartheight - margin.top - margin.bottom;

    var x = d3.scale.ordinal().domain(chartStages).rangePoints([0, width], 0.5);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svg = selection
        .attr("class","geneGraph")
        .attr("draggable","true")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("text-rendering","geometricPrecision");

    var group = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    y.domain([0, d3.max(chartGene.fpkm)]);

    var line = d3.svg.line()
        .x(function(d,i) { return x(chartStages[i]); })
        .y(function(d) { return y(d); });

    group.append("path")
        .datum(chartGene.fpkm)
        .attr('fill', 'none')
        .attr('stroke','green')
        .attr('stroke-width',3)
        .attr("class", "line")
        .attr("d", line);

    group.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    group.append("g")
        .attr("class", "axis")
        //.attr("style", "fill: none;  stroke: #000; shape-rendering: crispEdges; font: 10px sans-serif;")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -80)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("FPKM");

    group.selectAll(".axis line")
        .attr("style","stroke: black; fill: none;  shape-rendering: crispEdges;");
    group.selectAll(".axis path")
        .attr("style","stroke: black; fill: none;  shape-rendering: crispEdges;");

    svg.append("text")
        .attr("y", 20)
        .attr("x", chartwidth/2)
        .style("text-anchor", "middle")
        .text(chartGene.gene);

    //close button
    svg.append("image")
        .attr("x",chartwidth-20)
        .attr("y",5)
        .attr("width",15)
        .attr("height",15)
        .attr("xlink:href","close.png")
        .on("click", function() {removeChart(chartIndex)});

    //copy to clipboard
    svg.append("image")
        .attr("x",chartwidth-40)
        .attr("y",5)
        .attr("width",15)
        .attr("height",15)
        .attr("xlink:href","copy.png")
        .on("click",function() {copytoclipboard(chartIndex)});

}

