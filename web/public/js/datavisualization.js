var dataset = ['0'];

function runThis() {

  var socket = io();
  var kwh;
  var total;

  socket.on('kwh', function (waarde) {
      kwh = waarde;
      console.log('kwh', kwh);
      calc();
   });

   socket.on('total', function (waarde) {
       total = waarde;
       console.log('total', total);
       calc();
   });

   function calc() {
     if(kwh != undefined && total != undefined) {
       var val =  kwh / total * 100;
    //    console.log('val after calc', val);
       var key1 = val;
      //  dataset.push(key1);
      dataset[0] = key1;
     }
   }
}

runThis();

var margin = {top: 20, right: 20, bottom: 70, left: 40},
     width = 900 - margin.left - margin.right,
     height = 805 - margin.top - margin.bottom;

// set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);
 // define the axis
 var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

// add the SVG element
var svg = d3.select("main").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// load the data
// d3.json("/js/data.json", function(error, data) {
   //
   // data.forEach(function(d) {
   //      d.Letter = d.Letter;
   //      d.KW = +d.KW;
   //  });

 // scale the range of the data
  // x.domain(data.map(function(d) { return d.Letter; }));
  y.domain([0, d3.max(dataset, function(d) { return 100; })]);

 // add axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

 svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("KW");

   var bars = svg.selectAll('bar').data(dataset);
        bars.enter(dataset).append('rect');// lopen door data en append rect voor elk data item
        bars
          .attr("class", "bar")
          .attr("x", function(d) { return x(d); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d); })
          .attr("height", function(d) { return height - y(d); });

   function updateMyData(dataset) {
      var bars = svg.selectAll('bar')
        .data(dataset);

        svg.selectAll('rect')
        .remove();

        bars.enter(dataset).append('rect')
        .attr("class", "bar")
        .attr("x", function(d) { return x(d); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height - y(d); });
    }

    setInterval(function() {
      updateMyData(dataset);
      console.log('updatedddddd');
      console.log(dataset[0]);

      if (dataset[0] > '100') {
          socket.emit('completed');
      }
  }, 1000);
// });
