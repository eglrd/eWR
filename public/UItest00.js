var t = 0
var kPress = true;
var pace = 1;
var values = [];
var i = 0;
var trails = 0;
var trailFlag = true;

function setup() {
  createCanvas(320, 240);
}


function draw() {
  background(51);

  translate(width/2, height/2);
  fill (255,150,0);


  stroke(255);
  strokeWeight(5);

  //point(x(t), y(t));

  if(!kPress){
    t=t+pace;
    values.push(t);

    if (trailFlag){
      trails++;
    }
    if (values.length > trails-1) {
        values.splice(0,1);
    }
  }
  for(i=values.length-1; i>=0; i--){
    point(x(values[i]), y(values[i]));
  }

}

function keyPressed(){
  if(!kPress){
    kPress=true;
    trailFlag=false;
  } else {
    kPress=false;
    //
  }
}

function x(t)
{
  return(sin(t/30)*100);
}

function y(t)
{
  return(-cos(t/30)*100);
}
