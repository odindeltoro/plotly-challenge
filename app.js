// Review connection 
console.log('Connection successful');

// Define variable to store data
let data;

// Define functions for dashboard
// Function initialize and read json data file
function init(){
// Use the D3 library to read in samples.json
d3.json('samples.json').then(importedData => {
    data = importedData;
// Select value id
    let valueSelection = importedData.names;
    let selectedOption = d3.select('#selDataset');

    valueSelection.forEach(value => {
        selectedOption.append('option').text(value).attr('value',function(){
            return value;
        });
    });
});
};
init();

// For selected id plot data
d3.selectAll('#selDataset').on('change', buildPlot);

// Function build plot for bar chart, bubble chart and gauge chart
function buildPlot() {
    let selectedValue = d3.select('#selDataset').node().value;
    population(selectedValue);
    panel(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue);
  }

// Function population
function population(selectedValue) {
    let filterPopulation = data.samples.filter(value => value.id == selectedValue);
    let otuid = filterPopulation.map(d => d.otu_ids);
    otuid = microbialSpecies(otuid[0].slice(0, 10));
    let xValue = filterPopulation.map(d => d.sample_values);
    xValue = xValue[0].slice(0, 10); 
    let label_out = filterPopulation.map(d => d.otu_labels);
    let names = bacteriaName(label_out[0]).slice(0, 10);

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
// Traces for horizontal bar chart
    let traceBar = {
        x: xValue,
        y: otuid,
        text: names,
        type: 'bar',
        orientation: 'h'
      };

    let layout = {
        yaxis: {
          autorange: 'reversed'
        }
      };

    let plotBardata = [traceBar];
    
    let config = {responsive: true}  

    Plotly.newPlot('bar', plotBardata, layout, config);
};

// Function panel extract metadata text for id, ethnicity, gender, age, location, bbtype and wfreq
function panel(selectedValue) {
  let filterPanel = data.metadata.filter(value => value.id == selectedValue);
  let panelValue = d3.select('.panel-body');
  panelValue.html('');
  panelValue.append('p').text(`id: ${filterPanel[0].id}`);
  panelValue.append('p').text(`ethnicity: ${filterPanel[0].ethnicity}`);
  panelValue.append('p').text(`gender: ${filterPanel[0].gender}`);
  panelValue.append('p').text(`age: ${filterPanel[0].age}`);
  panelValue.append('p').text(`location: ${filterPanel[0].location}`);
  panelValue.append('p').text(`bbtype: ${filterPanel[0].bbtype}`);
  panelValue.append('p').text(`wfreq: ${filterPanel[0].wfreq}`);
}

// Function bubble
function bubble(selectedValue) {
  let filterBubble = data.samples.filter(value => value.id == selectedValue);
  let otuid = filterBubble.map(d => d.otu_ids);
  otuid = otuid[0];
  let yValue = filterBubble.map(d => d.sample_values);
  yValue = yValue[0];
  let label_out = filterBubble.map(d => d.otu_labels);
  label_out = bacteriaName(label_out[0]);

// Create a bubble chart that displays each sample
// Traces for bubble chart
  let traceBubble = {
    x: otuid,
    y: yValue,
    mode: 'markers',
    marker: {
      size: yValue
    },
    text: label_out
  };

  let plotBubbledata = [traceBubble];

  var layout = {
    showlegend: false,
    xaxis: {title: 'OTU ID'}
  };

  let config = {responsive: true}  

  Plotly.newPlot('bubble', plotBubbledata, layout, config);
};

// Function gauge
function gauge(selectedValue) {
  let filterGauge = data.metadata.filter(value => value.id == selectedValue);
  let weeklyFrequency = filterGauge[0].wfreq;

// Create a gauge chart to display washing frequency between 0-9  
  let plotGaugedata = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      title: {
        text: 'Belly Button Washing Frequency <br> Scrubs per Week'
      },
      type: 'indicator',

      mode: 'gauge',
      gauge: {
        axis: {
          range: [0, 9],
          tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          ticks: 'outside'
        },

// Define colors for intervals
        steps: [
          {range: [0, 1], color: '#B0E0E6'},
          {range: [1, 2], color: '#ADD8E6'},
          {range: [2, 3], color: '#87CEEB'},
          {range: [3, 4], color: '#87CEFA'},
          {range: [4, 5], color: '#00BFFF'},
          {range: [5, 6], color: '#1E90FF	'},
          {range: [6, 7], color: '#6495ED'},
          {range: [7, 8], color: '#4169E1'},
          {range: [8, 9], color: '#4682B4'}
        ],
        threshold: {
          line: {color: 'red', width: 5},
          thickness: 3,
          value: weeklyFrequency
        }
      }
    }
  ];

  let layout = { 
    width: 500, 
    height: 500, 
    margin: { 
      t: 0, b: 0} };

  let config = {responsive: true}    

  Plotly.newPlot('gauge', plotGaugedata, layout, config);
};

// Function bacteria name
function bacteriaName(name) {
  let listBact = [];

  for (let i = 0; i < name.length; i++) {
    let stringName = name[i].toString();
    let splitValue = stringName.split(";");
    if (splitValue.length > 1) {
      listBact.push(splitValue[splitValue.length - 1]);
    } else {
      listBact.push(splitValue[0]);
    }
  }
  return listBact;
};

// Function microbial species
function microbialSpecies(name) {
  let listMicSpe = [];
  for (let i = 0; i < name.length; i++) {
    listMicSpe.push(`OTU ${name[i]}`);
  }
  return listMicSpe;
};