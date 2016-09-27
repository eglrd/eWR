var express = require('express');
var socket = require('socket.io');
var fs = require('fs');


// ----------- creating WR object to use
var waterrower = require('./waterrower.js');

// -----------------------------------------------------------------
// ------------- web server + socket setup + file backup -----------
// -----------------------------------------------------------------

// start webserver and set default directory
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

//setup socket connections (sever side)
var io = socket(server);

//function to handle connections
io.sockets.on('connection', newConnection);

function newConnection(socket) {
    var collectData = []; // data object collecting data
    var incomSocketID; // saving socketID to save session data

    if (io.sockets.connected[socket.id]) {
        console.log('new connection id=' + socket.id);
        //incomSocketID = socket.id;
        waterrower.putSocketid(io, socket.id);
        console.log("server io:" + io);
    }
    console.log('amount of total connections' + io.engine.clientsCount);

    // start to emit to inbound socket
    setInterval(function() {
            if (io.sockets.connected[socket.id]) {

                jsonDate = (new Date()).toJSON();

                // getting recorded data from waterrower object --------------

                var record=waterrower.getRecord();


                var payload = {
                    "timestamp": jsonDate,
                    "watts": record['watts'],
                    "distance": record['distance'],
                    "totalStroke": record['totalStroke'],
                    "iSpeed": record['iSpeed'],
                    "aSpeed": record['aSpeed'],
                    "hRate": record['hRate'],
                    "strokeRate": record['strokeRate']
                }

                // faking rower data ------------------------------------------

                // var payload = {
                //   "timestamp": jsonDate,
                //   "watts": Math.round(Math.random()*200),
                //   "distance": 0,
                //   "totalStroke": 0,
                //   "iSpeed": Math.round(Math.random()*1.5),
                //   "aSpeed":Math.round(Math.random()*2),
                //   "hRate": Math.round(Math.random()*185),
                //   "strokeRate": Math.round(Math.random()*30)
                // }


                io.sockets.connected[socket.id].emit('WR', payload);
                collectData.push(payload);
            };
            // end ---- actual rowing data capture
    }, 1000);

    socket.on('disconnect', function(){
      console.log('user disconnected');
      // dump data collected into a JSON file
      var json = JSON.stringify(collectData);
      var output = fs.writeFile('tmp/'+incomSocketID+'.json', json, 'utf8'); // need to add callback fct.
      console.log("data backuped ")
    });
  }
