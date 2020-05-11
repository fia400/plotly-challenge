//I used this to help reference: https://medium.com/@vworri/use-plotly-in-javascript-to-creat-a-bar-graph-from-json-82d7220b463d

let url = "samples.json"

// get data from json file
d3.json(url).then(function(data) {
    console.log(data);
})


// build function for chart
function buildChart(sample) {
    d3.json(url).then((data) => {
      let samples = data.samples;
      let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;
    
//  define the bar chart using to 10 values   
    let yticks=(otu_ids.slice(0,10).map(otu_ids=> `OTU ${otu_ids}`)).reverse()
    let trace1 = {
        y: yticks,
        x: sample_values,
        hover_data: otu_labels,
        type: 'bar',
        orientation: 'h'
        
        
    }
    let bardata = [trace1]

    let layout = {
        xaxis: { title: "Samples"}
        
    };
    Plotly.newPlot('bar', bardata, layout)
})
}

//Build bubble chart

function buildBubbleChart(sample) {
    d3.json(url).then((data) => {
        let samples = data.samples;
        let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let trace1 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            type: 'scatter',
            marker: {
                size:sample_values,
                color: otu_ids,
                colorscale: 'Earth',
                showscale: true
            }
        }
        let bubbledata = [trace1]
    
        let layout = {
            xaxis: { title: 'OTU ID'},
            
        };
        Plotly.newPlot('bubble', bubbledata, layout)
    })
}


function buildDemographics(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata
        let result = metadata.filter(sampleObj => sampleObj.id == sample);
        let table = d3.select('#sample-metadata');
        console.log(result)
        table.html("");

        Object.entries(result[0]).forEach(([key, value]) => {
            table.append('h5').text(`${key}: ${value}`);
    })
})
}

function init() {
    let selector = d3.select('#selDataset');
    d3.json(url).then((data)=>{
        let idData = data.names
        idData.forEach((id)=>{
            selector
                .append("option")
                .text(id)
                .property('value', id);
        });

//use for filtering
        const firstId = idData[0];
        buildChart(firstId);
        buildBubbleChart(firstId);
        buildDemographics(firstId);

    });
}

// # build function to change all of the charts
 

function optionChanged(newId){
    buildChart(newId);
    buildBubbleChart(newId);
    buildDemographics(newId);


}
init()