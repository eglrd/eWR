var socket;
var dataReceived;

function setup() {
  createCanvas(320, 240);

  socket = io.connect('http://localhost:3000');
  // should you send data ? https://www.youtube.com/watch?v=i6eP1Lw4gZk

  socket.on('WR', function(data){
    dataReceived=data;
  });

}


//https://www.youtube.com/watch?v=HZWmrt3Jy10 @ 7.31

function draw() {
  background(51);
  if (dataReceived){
      testText = "Stroke Count: " + dataReceived.totalStroke + " Strokes\n";
      testText = "Stroke Rate: " + dataReceived.strokeRate + " S/mn\n";
      testText = testText + "Instant Speed: " + dataReceived.iSpeed + " cm/s \n";
      testText = testText + "Average Speed: " + dataReceived.aSpeed + " cm/s \n";
      testText = testText + "Distance: " + dataReceived.distance + " m \n";
      testText = testText + "Watts: " + dataReceived.watts + " w \n";
      testText = testText + "HR: " + dataReceived.hRate + " bpm \n";

      noStroke();
      fill(255);
      text(testText, 10, 10, width-10, height-10);

      fill(150);
      ellipse(width/2, height/2, dataReceived.watts, dataReceived.watts);
  }

}
