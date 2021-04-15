function feature2point(f) {
    // todo: make more adaptible to feature types?
    if (f.type != "Feature") {
        return null
    }
    if (f.geometry.type != "Point") {
        return null
    }
    var c = f.geometry.coordinates;
    return [c[0], c[1]]
}

function feature2latlng(f) {
    // todo: make more adaptible to feature types?
    if (f.type != "Feature") {
        return null
    }
    if (f.geometry.type != "Point") {
        return null
    }
    var c = f.geometry.coordinates;
    return { "lng": c[0], "lat": c[1] }
}

function lnglat2feature(latLng) {
    return {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": [latLng.lng, latLng.lat]
        }
    };
}

function point2feature(point) {
    return {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": [point.x, point.y]
        }
    };
}

function feature2bounds(f) {
    if (f.type != "Feature") {
        return null
    }
    if (f.geometry.type != "Polygon") {
        return null
    }
    var c = f.geometry.coordinates;
    return L.latLngBounds(L.latLng(c[0][0]), L.latLng(c[0][2]));
}

function bounds2feature(bounds) {
    var nw = bounds.getNorthWest();
    var se = bounds.getSouthEast();
    return {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [nw.lng, nw.lat],
                    [se.lng, nw.lat],
                    [se.lng, se.lat],
                    [nw.lng, se.lat]
                ]
            ]
        }
    };
}

// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}