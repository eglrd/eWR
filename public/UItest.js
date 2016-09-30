var strokeStart = false;
var strokeEnd = false;

var i; // catch arc iteration
var j; // recovery arc iteration
var k; // pacer arc iteration
var rate = 3; // pacer re-evaluating variables

function setup() {
    createCanvas(320, 240);
    i = 0;
}

// all visual components
function draw() {
    // clean canvas
    frameRate(30);
    background(200);

    // show variables
    fill(255, 102, 153);
    textAlign(LEFT, BASELINE);
    textSize(20);
    noStroke();
    text("i: " + Math.floor(i), 10, 30);
    text("j: " + Math.floor(j), 10, 60);
    text("k: " + Math.floor(k), 10, 90);
    translate(width / 2, height / 2);

    // materializing center
    noFill();
    stroke(0);
    strokeWeight(1);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);

    // setting up for stroke display
    strokeWeight(10);
    rotate(toRadians(-90));

    if (i == 360) {
        i = 0;
        j = 0;
        strokeStart=false;
        strokeEnd=false;
    }

    if (strokeStart) {
        // visual element displaying catch (from SS to SE)
        stroke(255, 0, 0);
        arc(0, 0, 200, 200, 0, toRadians(1 + i), CENTER);
        j = i;
        i = i + rate;
    }
    if (strokeEnd && i>0) { // capturing strokeEnd
        // at SE
        strokeWeight(10);
        stroke(255, 0, 0);
        // redraw catch
        arc(0, 0, 200, 200, 0, toRadians(i), CENTER);

        // visual projecting recovery phase (arc+line)
        strokeWeight(2);
        stroke(0, 0, 255);
        k = i * 3;
        arc(0, 0, 200, 200, toRadians(i - rate), toRadians(k), CENTER);
        rotate(toRadians(k - 90));
        line(0, 80, 0, 120);
        rotate(toRadians(-k + 90));

        // draw recovery progress
        if (j < k) {
            strokeWeight(10);
            stroke(0, 255, 0);
            arc(0, 0, 200, 200, toRadians(i - rate), toRadians(1 + j), CENTER);
            j = j + rate;
        } else {
            if (j >= k) {
                strokeEnd=false;
                if (k > 360) {
                    rate = rate * 360 / k; // need to check for truth
                    println("rev rate down @ " + rate)
                } else if (k < 240) {
                    rate = rate * (360 / k) * .8; // need to check for truth
                    println("rev rate up @ " + rate)
                } else {
                    println("rate ok @ " + rate);
                }
                i = 0;
            }
        }

}


}


//controlers here
// should be plugged to waterrower SStart and SEnd
function keyTyped() {
    if (key === 's') {
      if(strokeEnd){
        i=0;
      }
      strokeStart=true;
      strokeEnd=false;
    } else if (key ==='e'){
      strokeEnd=true;
      strokeStart=false;
    }
    //return false;
}


toRadians = function(degrees) {
    return degrees * Math.PI / 180;
};
