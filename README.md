# Visual Interfaces Data Project 1

## Live Visualization Webpage
https://main--beautiful-cucurucho-4754fd.netlify.app/project1/

## Video Demo
https://www.youtube.com/watch?v=kGxZSxeOooM

![image](https://github.com/tedcordonnier/visual_interfaces_project1/assets/83316488/c146d01b-de91-4f13-b89e-35e876d3b790)

## Goal of project
To allow users to take the given .csv data and choose which columns they want to visualize. The user would then be able to understand the data better by seeing it visually through the 2 histograms and 2 cloropheth maps, as well as seeing the combination of the data through the scatterplot.

## Data
https://www.cdc.gov/dhdsp/maps/atlas/index.htm or national_health_data.csv

## GUI 
2 Dropdowns with labels of Option1 and Option2 that alllow the user to select the two options (columns) that they want to visualize

## Views 
2 Histograms, one for each option, with axis labels and a title.
2 Choropleth maps, one for each option, with a title. The color itensity determines the value at each county. Details on demand are available when using mouse hover
1 Scatterplot, using data from both options, with axis labels and a title.

Color coded views that use the same option, such as cyan for both Option1 and magenta for both Option2
Order of the views: The top half of the page contains a histogram for Option1, the scatterplot, then the histogram for Option2. The bottom half of the page contains the maps for Option1 and Option2

## Interaction 
GUI allows the user to choose which 2 options they want to display. All of the charts will then automatically change based on the options selected, and use the data of the selected option (column)
Mouse hover on the Choropleth maps allow the user to see detials on demand that will show the exact value of the option that is being shown as well as the name of the county

## Application Discovery
This application allows the user to discover trends within the data and to get a better understanding of each variable as well as how they interact with eachother.
An example of a new insight that was found is that when choosing the options of poverty percentage and percent stroke, we can see that there is a positive trend between these 2 variables, as well as the higher prevalence of rural counties the higher you go with these 2 variables. 

## Process
Libraries that were used were d3 version 6. Code was structured: index.html to include the html elements. main.js as the controller who organizes the data and creates instances of each chart. Then 3 js files, one for each chart type: histogram, scatterplot, choroplethMap. These files were all structured in a way such that they have an initVis(), updateVis(), and renderVis().

## Running Code
This code can be found inside the Project1 folder in the github repo. Open this file inside of a compiler and run it. In my case, I have used JetBrains Webstorm, and am able to simply run the index.js file, which then runs all of the other files, and automatically starts a server. This server opens in my browser and shows what my web application looks like.

## Future Works
Finish A goals by adding things such as brushing.

## Challenges 
Working with the data and the passing from main.js to each other file
Creating the funcitonality to choose any two columns and then update all of the visualizaitons dynamicallly and automatically

