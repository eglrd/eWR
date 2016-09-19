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
      testText = "SR: " + dataReceived.logData.strokeRate + "\n";
      testText = testText + "TS: " + dataReceived.logData.tSpeed + "\n";
      testText = testText + "AS: " + dataReceived.logData.aSpeed + "\n";
      testText = testText + "D: " + dataReceived.logData.d + "\n";
      testText = testText + "W: " + dataReceived.logData.w + "\n";
      testText = testText + "HR: " + dataReceived.logData.hR + "\n";

      noStroke();
      fill(255);
      text(testText, 10, 10, width-10, height-10);

      fill(150);
      ellipse(width/2, height/2,dataReceived.logData.w, dataReceived.logData.w);
  }

}

// code to close connection if need be
// socket.disconnect() ;
