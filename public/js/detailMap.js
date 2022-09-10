mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: cg.geometry.coordinates, // starting position [lng, lat]
    zoom: 11, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(cg.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h3>${cg.name}</h3><p>${cg.location}</p>`))
    .addTo(map);