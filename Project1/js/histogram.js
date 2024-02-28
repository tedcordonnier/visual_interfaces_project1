class Histogram {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    // Configuration object with defaults
    this.config = {
      parentElement: _config.parentElement,
      color: _config.color,
      containerWidth: _config.containerWidth || 300,
      containerHeight: _config.containerHeight || 300,
      margin: _config.margin || {top: 70, right: 50, bottom: 50, left: 50},
      option: _config.option
    }
    this.data = _data;
    this.initVis();
  }

  /**
   * Initialize scales/axes and append static elements, such as axis titles
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Initialize scales and axes
    
    // Important: we flip array elements in the y output range to position the rectangles correctly
    vis.xScale = d3.scaleLinear().range([0, vis.width]);
    vis.yScale = d3.scaleLinear().range([vis.height, 0]);

    // todo can change later to not be 10
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(10)
        .tickSizeOuter(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSizeOuter(0);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement).append('svg')
        .attr('class', 'center-container')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // SVG Group containing the actual chart; D3 margin convention
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group 
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    this.updateVis()
  }


  updateVis() {
    let vis = this;

    vis.xScale.domain(d3.extent(vis.data, d => +d[vis.config.option]));

    // Data binning
    const histogram = d3.histogram()
        .value(d => +d[vis.config.option])
        .domain(vis.xScale.domain())
        .thresholds(vis.xScale.ticks(20)); // Adjust the number of bins

    const bins = histogram(vis.data);

    vis.yScale.domain([0, d3.max(bins, d => d.length)]);

    // remove the previous axis title each time
    vis.svg.selectAll('.axis-title').remove();
    // Append x-axis title
    const xAxisTitleX = vis.width / 2 - 40; // Center the title along the x-axis
    const xAxisTitleY = vis.height + vis.config.margin.bottom + 55; // Position it below the x-axis
    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', xAxisTitleX)
        .attr('y', xAxisTitleY)
        .text(vis.config.option);

    // Append y-axis label
    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('text-anchor', 'middle') // Center the text
        .attr('transform', `translate(${15}, ${(vis.height / 2) + vis.config.margin.top}) rotate(-90)`) // Position and rotate
        .text('Frequency');

    // Append chart title
    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', vis.width / 2 + 25)
        .attr('y', vis.config.margin.top / 2)
        .attr('text-anchor', 'middle') // Center the chart title
        .style('font-size', '14px') // Optional: style your title here
        .text('Histogram of '); // Replace with your dynamic title if needed

    // Append chart title data
    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', vis.width / 2 + 35)
        .attr('y', vis.config.margin.top / 2 + 15)
        .attr('text-anchor', 'middle') // Center the chart title
        .style('font-size', '14px') // Optional: style your title here
        .text(vis.config.option); // Replace with your dynamic title if needed


    vis.renderVis(bins);
  }

  renderVis(bins) {
    let vis = this;

    vis.chart.selectAll('.bar')
        .data(bins)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => vis.xScale(d.x0))
        .attr('width', d => vis.width / bins.length - 2)
        .attr('y', d => vis.yScale(d.length))
        .attr('height', d => vis.height - vis.yScale(d.length))
        .attr('fill', d => vis.config.color); // Simplified for demonstration

    vis.xAxisG.call(d3.axisBottom(vis.xScale));
    vis.yAxisG.call(d3.axisLeft(vis.yScale));
  }
}