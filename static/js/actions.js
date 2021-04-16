//////////////////////////////////////////////////
//////////////////////////////////////////////////
// actions

// highlight
// focus
// focus + highlight
// draw
// bounds?

function focus(f) {
    var latLng = feature2latlng(f);
    map.flyTo({ center: [latLng.lng, latLng.lat], zoom: f.properties.zoom });
}

// map.flyTo({
//     center: [0, 0],
//     zoom: 9,
//     speed: 0.2,
//     curve: 1,
//     easing(t) {
//         return t;
//     }
// });

function highlight(f) {
    map.setFilter('country-boundaries-highlight-fill', f.properties.filter);
    map.setFilter('country-boundaries-highlight-line', f.properties.filter);
}

function draw(f) { }
function bounds(f) { }