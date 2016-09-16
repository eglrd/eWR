// this is a node.js based webserver (or webservice ?) experimenting with waterrower interfacing via sockets..
var waterrower = require("Waterrower");
var express = require('express');
var socket = require('socket.io');

var fakeDistance = 0;

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

  // start to emit to inbound socket
  setInterval(function(){
      if (io.sockets.connected[socket.id]) {

          // faking rower data
          var data ={
            strokeRate: Math.round(Math.random()*30),
            totalSpeed: Math.round(Math.random()*1.5),
            averageSpeed: Math.round(Math.random()*2),
            distance: fakeDistance,
            watts: Math.round(Math.random()*200),
            heartRate: Math.round(Math.random()*185),
          }

          fakeDistance+=1;

          io.sockets.connected[socket.id].emit('WR', data);
      };
    }, 500);


  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
}


// var readWaterrower = function() {
//  console.log();
//  console.log("Stroke Rate ....." + waterrower.readStrokeCount());  // [ - ]
//  console.log("Total Speed ....." + waterrower.readTotalSpeed());   // [cm/s]
//  console.log("Average Speed ..." + waterrower.readAverageSpeed()); // [cm/s]
//  console.log("Distance... ....." + waterrower.readDistance());     // [ m ]
//  console.log("Watts ..........." + waterrower.readWatts());    // [ bpm ]
//  console.log("Heart Rate ......" + waterrower.readHeartRate());    // [ bpm ]
