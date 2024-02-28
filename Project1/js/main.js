
// colors and size

let option1 = 'percent_smoking';
let option2 = 'percent_high_blood_pressure';


Promise.all([
  d3.json('data/counties-10m.json'),
  d3.csv('data/national_health_data.csv')
]).then(data => {
  const geoData = data[0];
  const countyData = data[1];
  const filteredData = countyData.filter(d =>
      +d.poverty_perc > 0 &&
      +d.median_household_income > 0 &&
      +d.education_less_than_high_school_percent > 0 &&
      +d.air_quality > 0 &&
      +d.park_access > 0 &&
      +d.percent_inactive > 0 &&
      +d.percent_smoking > 0 &&
      // Assuming urban_rural_status is a categorical text field, so we're not filtering by it
      +d.elderly_percentage > 0 &&
      +d.number_of_hospitals > 0 &&
      +d.number_of_primary_care_physicians > 0 &&
      +d.percent_no_heath_insurance > 0 &&
      +d.percent_high_blood_pressure > 0 &&
      +d.percent_coronary_heart_disease > 0 &&
      +d.percent_stroke > 0 &&
      +d.percent_high_cholesterol > 0
  );

  // Combine both datasets by adding the population density to the TopoJSON file
  // Combine both datasets by adding the new data to the TopoJSON file
  // This is only used in choroplehthMap.js
  geoData.objects.counties.geometries.forEach(d => {
    for (let i = 0; i < countyData.length; i++) {
      if (d.id === countyData[i].cnty_fips) {
        if (+countyData[i][option1] != 0) {
          d.properties[option1] = +countyData[i][option1];
        }
        if (+countyData[i][option2] != 0) {
          d.properties[option2] = +countyData[i][option2];
        }
      }
    }
  });

  const choroplethMap = new ChoroplethMap({
    parentElement: '#bottom',
    option: option1,
    colorScaleRange: ['#ccffff', '#009999'] // Light to dark cyan
  }, geoData);

  const choroplethMap2 = new ChoroplethMap({
    parentElement: '#bottom',
    option: option2,
    colorScaleRange: ['#ffccff', '#990099'] // Light to dark magenta
  }, geoData);

  const histogram = new Histogram({
    parentElement: '#top',
    option: option1,
    color: 'rgb(99, 255, 255)',
  }, filteredData)

  const scatterplot = new Scatterplot({
    parentElement: '#top',
    option1: option1,
    option2: option2
  }, filteredData
);

  const histogram2 = new Histogram({
    parentElement: '#top',
    option: option2,
    color: 'rgb(255, 99, 255)',
  }, filteredData)

  // Function to create a dropdown from data columns
  function createDropdown(selector, columns, option, optionChoice) {
    const select = d3.select(selector)
        .append('select')
        .attr('class','dropdown') // You can set a class for styling
        .on('change', function() {
          const selectedOption = d3.select(this).property('value');
          // Update visualization based on selected option
          // This will depend on how your visualizations are set up to react to new data
          console.log(`New option selected: ${selectedOption}`); // Placeholder action

          if (optionChoice == 'option1') {

            option1 = selectedOption;
            geoData.objects.counties.geometries.forEach(d => {
              for (let i = 0; i < countyData.length; i++) {
                if (d.id === countyData[i].cnty_fips) {
                  if (+countyData[i][option1] != 0) {
                    d.properties[option1] = +countyData[i][option1];
                  }
                }
              }
            });

            choroplethMap.config.option = selectedOption
            choroplethMap.updateVis();
          }

          if (optionChoice == 'option2') {

            option2 = selectedOption;
            geoData.objects.counties.geometries.forEach(d => {
              for (let i = 0; i < countyData.length; i++) {
                if (d.id === countyData[i].cnty_fips) {
                  if (+countyData[i][option2] != 0) {
                    d.properties[option2] = +countyData[i][option2];
                  }
                }
              }
            });

            choroplethMap2.config.option = selectedOption
            choroplethMap2.updateVis();
          }

          scatterplot.config[optionChoice] = selectedOption
          scatterplot.updateVis();

          if (optionChoice == 'option1') {

            histogram.config.option = selectedOption
            histogram.updateVis();
          }
          else if (optionChoice == 'option2') {
            histogram2.config.option = selectedOption
            histogram2.updateVis();
          }
        });

    // Add options to the dropdown
    select.selectAll('option')
        .data(columns)
        .enter()
        .append('option')
        .text(d => d)
        .attr('value', d => d)
        .property("selected", d => d === option); // Set the default selected option
  }

  // Assuming your data has a consistent structure, use the first row to determine column names
  const columnNames = Object.keys(countyData[0]);

  // Exclude columns not suitable for visualization, if necessary
  const filteredColumnNames = columnNames.filter(name => name !== 'cnty_fips' && name !== 'display_name' && name !== 'urban_rural_status');

  // Create dropdowns
  createDropdown('#dropdown1', filteredColumnNames, option1, 'option1');
  createDropdown('#dropdown2', filteredColumnNames, option2, 'option2');

})
.catch(error => console.error(error));
