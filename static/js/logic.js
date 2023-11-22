const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url).then(function(data) {
    console.log(data);

    let features = data.features;

    // Adding base map
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let baseMaps = {
        "Street": street,
    };

    // Marker colors
    function markerColor(value) {
        if (value < 10) return "A2F602";
        else if (value < 30) return "DCF400";
        else if (value < 50) return "F7DB11";
        else if (value < 70) return "FDB729";
        else if (value < 90) return "FCA35D";
        else return "FF5F65";
    };

    // Setting datapoints
    let dataMarkers = [] 
    for (let i = 0; i < features.length; i++){
        let geo = features[i].geometry;
        let coordinates = [geo.coordinates[1], geo.coordinates[0]];
        //Populating data markers
        dataMarkers.push(
            L.circleMarker(coordinates, {
                weight: 0.5,
                color: "white",
                fillColor: markerColor(geo.coordinates[2]),
                radius: (features[i].properties.mag*3),
                fillOpacity: 0.6
            }).bindPopup(features[i].properties.title)
        );
    }; 

    // Adding marker overlay
    let earthquakeMarkers = L.layerGroup(dataMarkers);
    let overlayMaps = {
        Earthquakes: earthquakeMarkers
    };

    // Creating the map object
    let myMap = L.map("map", {
        center: [38.7128, -94.0059],
        zoom: 5,
        layers: [street, earthquakeMarkers],
        preferCanvas: true
    });  

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false, 
    }).addTo(myMap);  


});