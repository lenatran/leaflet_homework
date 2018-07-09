// Store API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the queryUrl
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

// Create features for earthquakes markers based on earthquake data from API request
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
    
    pointToLayer: function(feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 0.8,
        stroke: true,
        color: "black",
        weight: 0.5
      })
    }
  }).addTo(myMap);
}

var mapBox = "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibGVuYXRyYW4iLCJhIjoiY2owcHA4aHBmMDBrNzJxbzU4bjZnendtdCJ9.kIEiCwCLaBjWjHkppaTwYg";

// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a tile layer
L.tileLayer(mapBox).addTo(myMap);

// Create legend and add to map
var legend = L.control({position: "bottomright"});

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend"),
      magnitudes = [0, 1, 2, 3, 4, 5],
      labels = [];
  
  for (var i = 0; i < magnitudes.length; i++) {
    div.innerHTML +=
      "<i style='background:" + getColor(magnitudes[i] + 1) + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
  }
  return div;
};

legend.addTo(myMap);

// Setting circle's fill color based on magnitude
function getColor(m) {
  if (m > 5) {
    return "red"
  } else if (m > 4) {
    return "darkorange"
  } else if (m > 3) {
    return "orange"
  } else if (m > 2) {
    return "yellow" 
  } else if (m > 1) {
    return "lightgreen"
  } else {
    return "green"
  }
};

// Setting circle's radius based on magnitude
function getRadius(r) {
  return r * 25000
};