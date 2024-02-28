class Scatterplot {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      colorScale: d3.scaleOrdinal()
          .domain(["Urban", "Suburban", "Rural"])
          .range(["rgb(255, 99, 99)", "rgb(99, 99, 255)", "rgb(99, 200, 99)"]), // Lighter shades of red, blue,
      containerWidth: _config.containerWidth || 800,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || {top: 50, right: 50, bottom: 50, left: 50},
      tooltipPadding: _config.tooltipPadding || 15,
      option1: _config.option1,
      option2: _config.option2
    }
    this.data = _data;
    this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleLinear()
        .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSize(-vis.height - 10)
        .tickPadding(10);

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSize(-vis.width - 10)
        .tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement).append('svg')
        .attr('class', 'center-container')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart 
    // and position it according to the given margin config
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // Append legend
    const legend = vis.svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${vis.config.containerWidth - vis.config.margin.right - 100}, ${vis.config.margin.top})`);

    const legendCategories = ['Urban', 'Suburban', 'Rural'];

    const legendItem = legend.selectAll('.legend-item')
        .data(legendCategories)
        .enter().append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    // Append rectangles to legend items
    legendItem.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', d => vis.config.colorScale(d));

    // Append text labels to legend items
    legendItem.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '0.35em')
        .text(d => d);


    this.updateVis()
  }


  updateVis() {
    let vis = this;

    // Specify accessor functions
    vis.colorValue = d => d.urban_rural_status;
    vis.xValue = d => +d[vis.config.option1];
    vis.yValue = d => +d[vis.config.option2];

    // Set the scale input domains
    vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
    vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);


    // remove the previous axis title each time
    vis.svg.selectAll('.axis-title').remove();
    // Append axis title
    const xAxisTitleX = vis.width / 2 - 40; // Center the title along the x-axis
    const xAxisTitleY = vis.height + vis.config.margin.bottom + 40 ; // Position it below the x-axis
    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', xAxisTitleX)
        .attr('y', xAxisTitleY)
        .text(vis.config.option1);

    // Append y-axis label
    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('text-anchor', 'middle') // Center the text
        .attr('transform', `translate(${15}, ${(vis.height / 2) + vis.config.margin.top}) rotate(-90)`) // Position and rotate
        .text(vis.config.option2);

    // Append chart title
    vis.svg.append('text')
        .attr('class', 'axis-title')
        .attr('x', vis.width / 2 + 25)
        .attr('y', vis.config.margin.top / 2)
        .attr('text-anchor', 'middle') // Center the chart title
        .style('font-size', '14px') // Optional: style your title here
        .text('Scatterplot of ' + vis.config.option1 + ' vs. ' + vis.config.option2); // Replace with your dynamic title if needed

    vis.renderVis();
  }

  /**
   * Bind data to visual elements.
   */
  renderVis() {
    let vis = this;

    // Add circles
    const circles = vis.chart.selectAll('.point')
        .data(vis.data)
        .join('circle')
        .attr('class', 'point')
        .attr('r', 2)
        .attr('cy', d => vis.yScale(vis.yValue(d)))
        .attr('cx', d => vis.xScale(vis.xValue(d)))
        .attr('fill', d => vis.config.colorScale(vis.colorValue(d)));
    
    // Update the axes/gridlines
    // We use the second .call() to remove the axis and just show gridlines
    vis.xAxisG
        .call(vis.xAxis)
        .call(g => g.select('.domain').remove());

    vis.yAxisG
        .call(vis.yAxis)
        .call(g => g.select('.domain').remove())
  }
}