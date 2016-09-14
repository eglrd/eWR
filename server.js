var waterrower = require("Waterrower");
var express = require('express');

var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

var readWaterrower = function() {
  console.log();
  console.log("Stroke Rate ....." + waterrower.readStrokeCount());  // [ - ]
  console.log("Total Speed ....." + waterrower.readTotalSpeed());   // [cm/s]
  console.log("Average Speed ..." + waterrower.readAverageSpeed()); // [cm/s]
  console.log("Distance... ....." + waterrower.readDistance());     // [ m ]
  console.log("Heart Rate ......" + waterrower.readHeartRate());    // [ bpm ]

}

setInterval(readWaterrower, 2000);
