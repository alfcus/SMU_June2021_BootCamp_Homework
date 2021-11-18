$(document).ready(function() {
    getData();
    $("#selDataset").on("change", function() {
        getData();
    });
});

function getData() {
    let url = "samples.json";
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            Dropdown(data);
            BarChart(data);
            BubbleChart(data);
            Table(data);
        
        },
        error: function(data) {
            console.log("Error");
        },
        complete: function(data) {
            console.log("Request finished");
        }
    });
}


function Dropdown(data) {
    let names = data.names;

    for (let i = 0; i < names.length; i++) {
        let name = names[i];
        let html_option = `<option value="${name}">${name}</option>`;
        $("#selDataset").append(html_option);
    }
}


function Table(data) {
    let id = parseInt($("#selDataset").val());
    let currentData = data.metadata.filter(x => x.id === id)[0];

    $("#sample-metadata").empty();

    let items = Object.entries(currentData).map(([key, value]) => `${key}: ${value}`);
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let text = `<p>${item.charAt(0).toUpperCase() + item.slice(1)}<p>`;
        $("#sample-metadata").append(text);
    }
}



function BarChart(data){
    let id = $("#selDataset").val();
    let currentData = data.samples.filter(x => x.id === id)[0];
    
    let trace = {
        x: currentData.sample_values.slice(0, 10).reverse(),
        y: currentData.otu_ids.map(x => `OTU ID: ${x}`).slice(0, 10).reverse(),
        text: currentData.otu_labels.slice(0, 10).reverse(),
        name: "Bacteria Count",
        type: "bar",
        marker: {
            color: 'red'
        },
        orientation: 'h',
        text: currentData.otu_labels,
    };

    let traces = [trace];

    let layout = {
        title: 'Bacteria Count',
        margin: { t: 30, l: 150 },
        xaxis: {
            title: 'Count'

        }
    };
    
    Plotly.newPlot('bar', traces, layout);


}


function BubbleChart(data){
    let id = $("#selDataset").val();
    let currentData = data.samples.filter(x => x.id === id)[0];

    let trace = {
        x: currentData.otu_ids,
        y: currentData.sample_values,
        text: currentData.otu_labels,
        mode: 'markers',
        marker: {
            color: currentData.otu_ids,
            size: currentData.sample_values
        }
    };
          
        
        
    
    traces = [trace];

    let layout = {
        showlegend: false,
        margin: { t: 30},
        hovermode: "closest",
        xaxis: {
            title: 'OTU ID'
        }
      };

    Plotly.newPlot("bubble", traces, layout);



}
