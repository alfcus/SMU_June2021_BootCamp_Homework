// Store the API query variables.
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/";
// Add the timeframe
var timeframe = "all_week.geojson";

// build URL
var url = baseURL + timeframe;

// json
var tect_url = "static/data/PB2002_boundaries.json";

$(document).ready(function() {

    // AJAX
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        dataType: "json",
        success: function(data) {

            $.ajax({
                type: "GET",
                url: tect_url,
                contentType: "application/json",
                dataType: "json",
                success: function(tect_data) {
                    makeMap(data, tect_data);

                },
                error: function(data) {
                    console.log("Error");
                },
                complete: function(data) {
                    console.log("Completed");
                }
            });
        },
        error: function(data) {
            console.log("Error");
        },
        complete: function(data) {
            console.log("Completed");
        }
    });
});

function makeMap(data, tect_data) {
    // Create the base layers.
    var dark_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/dark-v10',
        accessToken: API_KEY
    });

    var light_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v10',
        accessToken: API_KEY
    });

    // Basemaps 
    var baseMaps = {
        "Dark": dark_layer,
        "Light": light_layer
    };

    //  MARKERS
    let features = data.features;
    let geoLayer = L.geoJSON(features, {
        onEachFeature: onEachFeature
    });

    // plate layer 
    let tecLayer = L.geoJson(tect_data, {
        style: function(feature) {
            return {
                color: "#226f8d",
                weight: 1,
        
            };
        }
    });

    // heatmaps and markers
    var heatArray = [];
    var quakeMarkers = L.markerClusterGroup();
    var circleMarkers = [];

    for (var i = 0; i < features.length; i++) {
        var location = features[i].geometry;

        if (location) {
            heatArray.push([location.coordinates[1], location.coordinates[0]]);

            // marker info for quake marker cluster group 
            let marker = L.marker([location.coordinates[1], location.coordinates[0]]);
            marker.bindPopup(`<h3>Location: ${data.features[i].properties.place}</h3>
            <hr>
            <p>Time: ${new Date(data.features[i].properties.time)}</p>
            <p>Magnitude: ${data.features[i].properties.mag}</p>
            <p>Depth: ${data.features[i].geometry.coordinates[2]}</p>`);
            quakeMarkers.addLayer(marker);

            // make circle plots
            let circle = L.circle([location.coordinates[1], location.coordinates[0]], {
                fillOpacity: 0.75,

                // color based on depth 
                color: makeColor(data.features[i].geometry.coordinates[2]),
                fillColor: makeColor(data.features[i].geometry.coordinates[2]),
            
                // marker's size according to its magnitude.
                radius: makeRadius(data.features[i].properties.mag)
            }).bindPopup(`<h3>Location: ${data.features[i].properties.place}</h3>
            <hr>
            <p>Time: ${new Date(data.features[i].properties.time)}</p>
            <p>Magnitude: ${data.features[i].properties.mag}</p>
            <p>Depth: ${data.features[i].geometry.coordinates[2]}</p>`);

            circleMarkers.push(circle);
        
        }
    }

    // circle layer
    var circleLayer = L.layerGroup(circleMarkers)
   
    // heat layer   
    var heatLayer = L.heatLayer(heatArray, {
        radius: 75,
        blur:5,
        gradient: {0.1: 'green', 0.3: 'yellow', 0.5: 'red'}
    });

    // overlays to include marker cluster, heatmap, circles, and tectonic plates 
    var overlayMaps = {
        "Quake Marker Cluster": quakeMarkers,
        // "Earthquakes": geoLayer, // replaced by marker cluster above
        "Heatmap": heatLayer,
        "Circles": circleLayer,
        "Plates": tecLayer
    };

    // map starting point and default layers 
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [dark_layer, heatLayer, circleLayer, tecLayer ]
    });
    
    // layer control for the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // legend setup 
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');

        let legend_display = `<span>Depth Legend</span><br>
        <br>
        <i class="circle" style='background: #04c727'></i><span> &nbsp&nbsp>10</span><br>
        <i class="circle" style='background: #a9f547'></i><span>10-30</span><br>
        <i class="circle" style='background: #e4f547'></i><span>30-50</span><br>
        <i class="circle" style='background: #ebbd36'></i><span>50-70</span><br>
        <i class="circle" style='background: #fc9132'></i><span>70-90</span><br>
        <i class="circle" style='background: #e31a1c'></i><span>90+</span>`;

        div.innerHTML = legend_display;
        return div;
    }
    legend.addTo(myMap);
}

// popup info for marker 
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3>
    <hr>
    <p>Time: ${new Date(feature.properties.time)}</p>
    <p>Magnitude: ${feature.properties.mag}</p>`);
}

// magnitude radius adjustment 
function makeRadius(magnitude) {
    return magnitude * 15000;
}

// circle colors
function makeColor(depth) {
    let depthColor = "#04c727";

    // color based on depth
    if (depth > 90) {
        depthColor = "#e31a1c";
    } else if (depth > 70) {
        depthColor = "#fc9132";
    } else if (depth > 50) {
        depthColor = "#ebbd36";
    } else if (depth > 30) {
        depthColor = "#e4f547";
    } else if (depth > 10) {
        depthColor = "#a9f547"
    } else {
        depthColor = "#04c727"
    }

    return depthColor;
}
