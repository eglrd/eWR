// this is a node.js based webserver (or webservice ?) experimenting with waterrower interfacing via sockets..
var waterrower = require("Waterrower");
var express = require('express');
var socket = require('socket.io');

// start webserver and set default directory
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

//setup socket connections (sever side)
var io = socket(server);
//function to handle connections
io.sockets.on('connection', newConnection);

function newConnection(socket){
  console.log('new connection id=' + socket.id);
  console.log('amount of total connections' + io.engine.clientsCount);
  // waterrower stuff

}

var readWaterrower = function() {
  console.log();
  // console.log("Stroke Rate ....." + waterrower.readStrokeCount());  // [ - ]
  // console.log("Total Speed ....." + waterrower.readTotalSpeed());   // [cm/s]
  // console.log("Average Speed ..." + waterrower.readAverageSpeed()); // [cm/s]
  // console.log("Distance... ....." + waterrower.readDistance());     // [ m ]
  console.log("Watts ..........." + waterrower.readWatts());    // [ bpm ]
  console.log("Heart Rate ......" + waterrower.readHeartRate());    // [ bpm ]

// no need for that it seems... close occur from clientside
// io.sockets.once('disconnect', closeConnection);

// function closeConnection(socket){
//   socket.close();
//   console.log('closed connection id=' + socket.id);
//
// }

// var readWaterrower = function() {
//
//   console.log('sending');
//
//   var payload ={
//     strokeCount : waterrower.readStrokeCount(),
//     totalSpeed : waterrower.readTotalSpeed(),
//     averageSpeed : waterrower.readAverageSpeed(),
//     distance : waterrower.readDistance(),
//     heartRate : waterrower.readHeartRate()
//   }
//   io.broadcast.emit('eWRdata', payload);
//
// }
//
// setInterval(readWaterrower, 2000);
