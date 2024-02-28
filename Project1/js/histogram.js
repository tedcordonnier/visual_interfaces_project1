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
      colorScale: d3.scaleOrdinal()
          .domain(["Urban", "Suburban", "Rural"]) // Replace with actual categories if different
          .range(["red", "blue", "green"]), // Mapping "Urban" to red, "Suburban" to blue, and "Rural" to green
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 600,
      margin: _config.margin || {top: 25, right: 20, bottom: 50, left: 60},
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

    // Append y-axis label
    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('text-anchor', 'middle') // Center the text
        .attr('transform', `translate(${15}, ${(vis.height / 2) + vis.config.margin.top}) rotate(-90)`) // Position and rotate
        .text('Frequency');


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
    const xAxisTitleY = vis.height + vis.config.margin.bottom ; // Position it below the x-axis
    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', xAxisTitleX)
        .attr('y', xAxisTitleY)
        .attr('dy', '.71em')
        .text(vis.config.option);

    vis.renderVis(bins);
  }

  renderVis(bins) {
    let vis = this;

    vis.chart.selectAll('.bar')
        .data(bins)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => vis.xScale(d.x0))
        .attr('width', d => 10)
        .attr('y', d => vis.yScale(d.length))
        .attr('height', d => vis.height - vis.yScale(d.length))
        .attr('fill', d => vis.config.colorScale('Suburban')); // Simplified for demonstration

    vis.xAxisG.call(d3.axisBottom(vis.xScale));
    vis.yAxisG.call(d3.axisLeft(vis.yScale));
  }
}