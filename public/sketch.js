var socket;

function setup() {
  createCanvas(320, 240);
  background(51);

  socket = io.connect('http://localhost:3000');
}

//https://www.youtube.com/watch?v=HZWmrt3Jy10 @ 7.31

function draw() {
  s = "hello world";
  fill(255);
  text(s, 10, 10, 70, 80);
}
