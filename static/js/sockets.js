//////////////////////////////////////////////////
//////////////////////////////////////////////////
// websocket connection

function sendFocus(f) {
    props = {
        "focus": true,
        "zoom": map.getZoom()
    }
    f.properties = { ...f.properties, ...props };
    var buffer = geobuf.encode(f, new Pbf());
    conn.send(buffer);
}

function sendHighlight(f) {
    props = {
        "highlight": true,
        "zoom": map.getZoom()
    }
    f.properties = { ...f.properties, ...props };
    var buffer = geobuf.encode(f, new Pbf());
    conn.send(buffer);
}

function sendBounds(f) {
    props = {
        "draw": false,
        "focus": false,
        "bounds": true,
        "zoom": map.getZoom()
    }
    f.properties = { ...f.properties, ...props };
    var buffer = geobuf.encode(f, new Pbf());
    conn.send(buffer);
}

function sendFeature(f) {
    props = {
        "draw": true,
        "uuid": create_UUID()
    }
    f.properties = { ...f.properties, ...props };
    var buffer = geobuf.encode(f, new Pbf());
    conn.send(buffer);
}

function connect() {
    conn = new WebSocket("wss://" + document.location.host + "/ws");
    conn.binaryType = "arraybuffer";

    conn.onclose = function (evt) {
        setTimeout(function () {
            connect();
        }, 3000);
    };

    conn.onmessage = function (msg) {
        if (msg.data instanceof ArrayBuffer) {
            var f = geobuf.decode(new Pbf(new Uint8Array(msg.data)));
            if (f.properties.focus) {
                focus(f);
            }
            if (f.properties.highlight) {
                highlight(f);
            }
        }
    };

    window.onbeforeunload = function () {
        conn.close();
    };
}

window.onload = function () {
    connect();
};