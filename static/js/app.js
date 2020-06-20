// function to get the data from samples.json
function getSampleData(sample){

    // use d3 to load json file
    d3.json("./samples.json").then(function(data){
    
      // use d3 to select from ids in `#sample-metadata` and default first id
          var sample_metadata = d3.select("#sample-metadata");
          var metadata = data.metadata;
          var result = metadata.filter(sampleobj => sampleobj.id==sample)[0]
      
      // use `.html("") to clear table and update with new id selection from dropdown
        sample_metadata.html("");
          
      // use `Object.entries` to add each key and value pair to the table when selected
          Object.entries(result).forEach(([key, value]) => {
    
            var row = sample_metadata.append("p");
            row.text(`${key}: ${value}`);
          })
        });
    }
    
    // function to build the charts
    function buildCharts(sample) {
      
      // use d3 to load json file
      d3.json("./samples.json").then(function(data){
        var samples = data.samples;
        var result = samples.filter(sampleobj => sampleobj.id==sample)[0]
    
      // define bubble plot variables
          var xValues = result.otu_ids;
          var yValues = result.sample_values;
          var markerSize = result.sample_values;
          var markerClrs = result.otu_ids;
          var tValues = result.otu_values;
          
          var trace_bubble = {
            x: xValues,
            y: yValues,
            text: tValues,
            mode: 'markers',
            marker: {
              size: markerSize,
              color: markerClrs
            }
          };

      // display bubble chart
          var data = [trace_bubble];
          var layout = {
            xaxis: {title: "OTU ID"}
          };
      
          Plotly.newPlot('bubble', data, layout)
    
     // define variables for bar chart
     var barValue = result.sample_values.slice(0,10).reverse();
     var otu_ids_bar = result.otu_ids.slice(0,10).map((item => "ITU " + item)).reverse(); 
     var otu_labels_bar = result.otu_labels.slice(0,10).reverse();
    
     var trace_bar = {
       x: barValue,
       y: otu_ids_bar,
       text: otu_labels_bar,
       type: 'bar',
       orientation: "h",
     };
    
     //  display bar chart
     var data_bar = [trace_bar];
     var layout_bar = {
       title: "Top 10 OTUs",
       margin: {
         l: 100,
       },
       xaxis: {title: "Quantity"},
     };  
    
     Plotly.newPlot("bar", data_bar, layout_bar);
      });
    }
    
    // initialize function
    function init(){
      d3.json("./samples.json").then(function(data){
        var selector = d3.select("#selDataset");
        var sampleNames = data.names;
        sampleNames.forEach((sample)=>{
          selector.append("option").text(sample).property("value", sample);
        })
        getSampleData(sampleNames[0])
        buildCharts(sampleNames[0])
      });
    }
    
    init();
        
    // function to update based on dropdown selection
    d3.selectAll("#selDataset").on("change", updatePlotly);
    function updatePlotly() {

      var dropdownMenu = d3.select("#selDataset");

      var dataset = dropdownMenu.property("value");
    
      getSampleData(dataset)
      buildCharts(dataset)
    };