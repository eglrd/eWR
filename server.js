// this is a node.js based webserver (or webservice ?) experimenting with waterrower interfacing a web browesr via sockets..
var waterrower = require("Waterrower");
var express = require('express');
var socket = require('socket.io');
var fs = require('fs');


// var fakeDistance = 0;

// start webserver and set default directory
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

//setup socket connections (sever side)
var io = socket(server);
//function to handle connections
io.sockets.on('connection', newConnection);

function newConnection(socket){
  var collectData = []; // data object collecting data
  var incomSocketID; // saving socketID to save session data

  if (io.sockets.connected[socket.id]) {
    console.log('new connection id=' + socket.id);
    incomSocketID = socket.id;
  }
  console.log('amount of total connections' + io.engine.clientsCount);

  // start to emit to inbound socket
  setInterval(function(){
      if (io.sockets.connected[socket.id]) {

          jsonDate = (new Date()).toJSON();

          // faking rower data
          // var data ={
          //   "logTime": jsonDate,
          //   "type": 'logItem',
          //   "logData": {
          //   sRate: Math.round(Math.random()*30),    // strokeRate
          //   tSpeed: Math.round(Math.random()*1.5),  // totalSpeed
          //   aSpeed: Math.round(Math.random()*2),    // averageSpeed
          //   d: fakeDistance,                        // distance
          //   w: Math.round(Math.random()*200),       // watts
          //   hR: Math.round(Math.random()*185)       // Heart Rate
          //   }
          // }
          // fakeDistance+=1;

          // begin ---- actual rowing data capture
          if(waterrower){
            var data = {
                "logData":{
                    "timestamp": jsonDate,
                    // need to figure a way to grab strokestart/stroke end messages...
                    "type": 'Records',
                    "sRate": waterrower.readStrokeRate(),     //#/mn
                    "sCount": waterrower.readStrokeCount(),   //#
                    "tSpeed": waterrower.readTotalSpeed(),    // cm/s
                    "aSpeed": waterrower.readAverageSpeed(),  // cm/s
                    "d": waterrower.readDistance(),           // m
                    "w": waterrower.readWatts(),              // W
                    "hR": waterrower.readHeartRate()          //bpm
                }
            }

            io.sockets.connected[socket.id].emit('WR', data);
            collectData.push(data);
          };
          // end ---- actual rowing data capture
      };
    }, 1000);


  socket.on('disconnect', function(){
    console.log('user disconnected');
    // dump data collected into a JSON file
    var json = JSON.stringify(collectData);
    var output = fs.writeFile('tmp/'+incomSocketID+'.json', json, 'utf8'); // need to add callback fct.
  });
}
