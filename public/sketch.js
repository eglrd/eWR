var socket;
var dataReceived;

function setup() {
  createCanvas(320, 240);

  socket = io.connect('http://localhost:3000');
  // should you send data ? https://www.youtube.com/watch?v=i6eP1Lw4gZk

  socket.on('WR', function(data){

    dataReceived=data;
    //println(floor(data.strokeRate));

  });
}

// function mousePressed(){
//   socket.emit('click', mouseX+" "+mouseY);
// }



//https://www.youtube.com/watch?v=HZWmrt3Jy10 @ 7.31

function draw() {
  background(51);
  if (dataReceived){
      testText = "Stroke Count: " + dataReceived.logData.sCount + " Strokes\n";
      testText = "Stroke Rate: " + dataReceived.logData.sRate + " S/mn\n";
      testText = testText + "Total Speed: " + dataReceived.logData.tSpeed + " cm/s \n";
      testText = testText + "Average Speed: " + dataReceived.logData.aSpeed + " cm/s \n";
      testText = testText + "Distance: " + dataReceived.logData.d + " m \n";
      testText = testText + "Watts: " + dataReceived.logData.w + " w \n";
      testText = testText + "HR: " + dataReceived.logData.hR + " bpm \n";

      noStroke();
      fill(255);
      text(testText, 10, 10, width-10, height-10);

      fill(150);
      ellipse(width/2, height/2,dataReceived.logData.w, dataReceived.logData.w);
  }

}

// code to close connection if need be
// socket.disconnect() ;
