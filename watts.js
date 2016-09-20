// this is a node.js based webserver (or webservice ?) experimenting with waterrower interfacing via sockets..
var waterrower = require("Waterrower");
// start to emit to inbound socket
setInterval(function() {
    if (waterrower) {
        waterrower.readWatts(); // W
    }
}, 1000);
