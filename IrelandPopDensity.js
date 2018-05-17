//Helpful Sources:
//http://d3-legend.susielu.com/#color-threshold
//http://bl.ocks.org/aerrity/4338818
//http://bl.ocks.org/shimizu/61e271a44f9fb832b272417c0bc853a5

//Define Margin
var margin = {left: 10, right: 10, top: 40, bottom: 0 }, 
    width = 620 - margin.left -margin.right,
    height = 760 - margin.top - margin.bottom;

//Define main SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Define Legend SVG
var svgLegend = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", 40 + margin.top + margin.bottom)
    .attr("transform", "translate(" + (-width) + "," + (5 + margin.top - height) + ")");

//Define map projection
var projection = d3.geoMercator()
    .scale([6000])
    .translate([1120, 7000])

//Define path generator
var path = d3.geoPath()
    .projection(projection);

//Define counties
var counties = svg.append("g")
    .attr("id", "ireland");

//Load GeoJSON data
d3.json("Ireland.json", function(error, geojson) {
  if (error) throw error;
  counties.selectAll("path")
    .data(geojson.features)
    .enter().append("path")
    .attr("class", "ireland")
    .attr("fill", "rgb(49, 163, 84)")
    .attr("d", path)
    .attr("stroke", "#222");
})

//Get input from radio buttons
d3.selectAll(("input[name='options']")).on("change", function(){
    //console.log(this.value)
    var optionA = (this.value == "a");

    //Load CSV data
    d3.csv("PopDensity.csv", function(error, data) {
        if (error) throw error;
        if (optionA) {
            //Define color scale
            var colorScaleA = d3.scaleLinear()
                .range(d3.schemeGreens[3])
                .domain([
                    d3.min(data, function(d) {return (d.a); }),
                    d3.quantile(data, 0.5, function(d) {return (d.a); }),
                    d3.max(data, function(d) {return (d.a); })
                ]);

            //Create legend
            svgLegend.append("g")
                .attr("class", "legendLinear");

            var legendLinear = d3.legendColor()
                .shapeWidth(100)
                .cells([
                    32, 35, 40, 45, 50
                ])
                .orient('horizontal')
                .scale(colorScaleA);

            svgLegend.select(".legendLinear")
                .call(legendLinear);
            
            //Change counties colors
            counties.selectAll("path")
                .attr("fill", function(d) {
                    //console.log(d.properties.Name)
                    for (var i = 0; i < data.length; i++) {
                        var countyData = data[i];
                        //console.log(countyData.region)
                        if (countyData.region == d.properties.Name) {
                            //console.log(countyData)
                            value = countyData.a;
                            //console.log(value)
                            if (value) {
                                return colorScaleA(value);
                            } else {
                                return "black";
                            }
                        }
                    }
                })
        }
        else {
            //Define color scale
            var colorScaleB = d3.scaleLinear()
                .range(d3.schemeGreens[3])
                .domain([
                    -2000, 0, 7000
                ]);

            //Create legend
            svgLegend.append("g")
                .attr("class", "legendLinear");

            var legendLinear = d3.legendColor()
                .shapeWidth(100)
                .cells(5)
                .orient('horizontal')
                .scale(colorScaleB);

            svgLegend.select(".legendLinear")
                .call(legendLinear);
            
            //Change counties colors
            counties.selectAll("path")
                .attr("fill", function(d) {
                    //console.log(d.properties.Name)
                    for (var i = 0; i < data.length; i++) {
                        var countyData = data[i];
                        //console.log(countyData.region)
                        if (countyData.region == d.properties.Name) {
                            //console.log(countyData)
                            value = countyData.b;
                            //console.log(value)
                            if (value) {
                                return colorScaleB(value);
                            } else {
                                return "black";
                            }
                        }
                    }
                })
        }
        console.log(counties)
    })
});