// ID selector
function addOptions(){
    d3.json("data/samples.json").then(function(sample){
        // get IDs from the metadata
        var metadataID = sample.metadata.map(d=>d.id);
        console.log(metadataID);
        
        // select metadataID
        var DatasetInput = d3.select("#selDataset");
        metadataID.forEach(function(id){
            DatasetInput.append("option").attr('value',id).text(id);
        });
    });
}

// demographic info table
function displayData(selection) {
    d3.json("data/samples.json").then(function(sample){
        
        var filteredData = sample.metadata.filter(function(s){
            return s.id == selection
        });

        // clear data panel
        d3.select('.panel-body').text('')

        // display metadata
        Object.entries(filteredData[0]).forEach(([key,value])=>{
            d3.select('.panel-body').append('p').text(`${key}: ${value}`)
        })    
    });
}

// plot charts
function plotCharts(selection){
    d3.json("data/samples.json").then(function(sample){
        console.log("Data", sample);
        
        var filteredSamplesData = sample.samples.filter(function(s){
            return s.id == selection
        });
        console.log("Filtered Data:",filteredSamplesData);
        
        var otuID = filteredSamplesData[0].otu_ids.slice(0,10).reverse().map(id=>id);
        var sampleValues = filteredSamplesData[0].sample_values.slice(0,10).reverse();
        var otuLabels = filteredSamplesData[0].otu_labels.slice(0,10).reverse()
        console.log("otuLabels", otuLabels);

        // Plot bar
        var data = [{
            type: 'bar',
            x: sampleValues,
            y: otuID.map(id=>"OTU"+id),
            text: otuLabels,
            orientation: 'h'
            }];
        
        Plotly.newPlot('bar', data);
        
        // Plot bubble
        var bubbleData = [{
            x: otuID,
            y: sampleValues,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuID,
                sizeref: 2
            },
            text: otuLabels,
            type: 'scatter'
        }];
        
        var bubbleLayout = {
            title: 'Bubble Chart',
            showlegend: false,
            //hovermode:
            xaxis: {title:"OTU ID"},
            height: 500,
            width: 1000
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
}

// display new values
function optionChanged(val){
    console.log("Selected",val);
    plotCharts(val);
    displayData(val);
    plotGauge(val);
}

// initializing the page
function init(){
    addOptions();
    plotCharts("940");
    displayData("940");
    plotGauge("940");
}
init();