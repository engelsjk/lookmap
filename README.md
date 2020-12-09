# lookmap

A multiclient interactive Leaflet map using WebSockets. An experimental idea. 

![](images/lookmap.gif)

## Demo

```bash
go run main.go
```

## What

This idea came about while thinking about ways to collaboratively navigate a map, highlight points of interest and draw/annotate features.  This experiment shows the feasiblity of an interactive map that passes information between multiple clients. 

For any client that is connected to this demo service:

* Double-clicking on a map will fly every other map to the same location and zoom level
* Drawing a feature (polygon, circle, point, etc) will draw that same feature on every other map
* Annnnd that's it. No deleting features, styling, etc at the moment.

## How

A tiny web server hosts a Leaflet map and creates a WebSocket connection for each client that connects to the service. Client-triggered events on the map (like double-clicking for focus or drawing a shape) create a GeoJSON feature and uses its property fields to describe the event. This GeoJSON feature is then Geobuf-encoded and passed as a message over the WebSocket connection. The message is delivered to every client connected and each client then parses the message locally to respond accordingly, i.e. flying the map to the focus point or drawing a shape on the map. 

As an example, here's how this process works when a client double-clicks on the map to share focus.

```Javascript

// set a dbclick event for the map
map.on('dblclick', function (e) {
    sendFocus(latlng2f(e.latlng));
});

// create a basic GeoJSON Point feature from the click event lat/lng
function latlng2f(latlng) {
    return {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": [latlng.lng, latlng.lat]
        }
    };
}
        
// add event properties to the GeoJSON feature, then encode it as a Geobuf and send over the websocket connection
function sendFocus(f) {
  props = {
      "draw": false,
      "focus": true,
      "animate": true,
      "animate_duration": 2,
      "zoom": map.getZoom()
  }
  f.properties = { ...f.properties, ...props };
  var buffer = geobuf.encode(f, new Pbf());
  conn.send(buffer);
}

// after receiving a Geobuf message over the websocket connection...
// decode it to GeoJSON, check its properties and trigger a focus function
conn.onmessage = function (msg) {
    if (msg.data instanceof ArrayBuffer) {
        var f = geobuf.decode(new Pbf(new Uint8Array(msg.data)));
        if (f.properties.focus) {
            focus(f);
        }
    }
};
            
// fly the map to the location of the GeoJSON point using specified animation properties
function focus(f) {
  map.flyTo(f2latlng(f), f.properties.zoom, {
      animate: f.properties.animate,
      duration: f.properties.animate_duration // in seconds
  });
}
```

Clients receive every message triggered by an event, including events from that client. Therefore, a client only responds to events by receiving messages, not by the event triggers themselves. In other words, if you draw a shape on the map, that shape only appears on the map once the client receives back the message caused by that drawing event. 
        
## Somewhat Similar Ideas

I looked around for similar ideas and this is what I found:

* [Ethermap - A realtime collaborative, version controlled map editor](https://github.com/dwilhelm89/Ethermap)
* [Real-Time Interaction Between Maps with Socket.io and JavaScript](https://www.youtube.com/watch?v=Xgoexs3xybU)
* [CrowMapper: Real-time collaborative application for tagging streams of geospatial data, built on top of the Meteor Javascript platform](https://github.com/TurkServer/CrowdMapper)

