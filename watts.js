// this is a node.js based webserver (or webservice ?) experimenting with waterrower interfacing


// water rower part
// Initialise

var SerialPort = require("serialport");

var SerialPort = require('serialport');
SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});

// var port = new SerialPort("/dev/tty-usbserial1", {
//   baudRate: 57600
// });
