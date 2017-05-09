// SVG element
const height = 400,
      width = 600,
    svg = d3.select('main')
      .append('svg')
      .attr('height', height)
      .attr('width', width);

// Create the Scale we will use for the Axis
const xAxisScale = d3.scale.ordinal().rangeRoundBands([0, 700], 0.05); //ordinal for discrete domains such as names or in my case roadNames
const yAxisScale = d3.scale.linear().range([height, 0]); // linear is used for the quantitative scales -> continuous domain such as numbers or in my case km

//Create the Axis
const xAxis = d3.svg.axis()
  .scale(xAxisScale)
  .orient('bottom')
  .ticks(10);

const yAxis = d3.svg.axis()
  .scale(yAxisScale)
  .orient('left')
  .ticks(20);

d3.json('http://localhost:3000/js/moeder.json', (err, data) => {
  // Set the ticks
  console.log(data);

  // xAxisScale.domain(data.forEach((d) => d.deDatering)); //d.road
  // yAxisScale.domain([0, d3.max(data, (d) => d.onzeData)]); //d.dag

  // Append the y axis
  svg.append('g')
    .attr('class', 'yAxis')
    .call(yAxis);

  // Append the x axis
  svg.append('g')
    .attr('class', 'xAxis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  .selectAll('text') // apend text labels to ticks
    .attr('dx', '-4em')
    .attr('dy', '-.55em')
    .attr('transform', 'rotate(-60)');

  function update(time) {
      var bars = svg.selectAll('rect').data(data);

      bars.enter(data).append('rect');// lopen door data en append rect voor elk data item
      bars.exit().remove(); // checkt of er items zijn verwijderd uit dataset, zo ja verwijderd die ook rects.

      bars
        .attr('class', time)
        .attr('x', (d) => xAxisScale(d.deDatering))
        .attr('width', xAxisScale.rangeBand())
        .attr('y', function(d) {
          if (time === 'day') {
            return yAxisScale(d.onzeData);
          }
        })
        .attr('height', function(d) {
          if (time === 'day') {
            return height - yAxisScale(d.overdag);
          }
        });
    }

  update('day');

  var time = document.getElementById('timeSelector');

  // time.addEventListener('change', function() {
  //   update(time.value);
  // });
});
