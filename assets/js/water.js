var canvas;
var clickPos;
p5.disableFriendlyErrors = true;

function windowResized() {
    if (windowHeight <= 600){
        resizeCanvas(windowWidth, windowHeight*2);
    }
    else if (windowWidth <= 600){
        resizeCanvas(windowWidth, windowHeight*2);
    }
    else if (windowHeight <= 500){
        resizeCanvas(windowWidth, windowHeight*3);
    }
    else if (windowWidth <= 500){
        resizeCanvas(windowWidth, windowHeight*3);
    }
    else {
        resizeCanvas(windowWidth, windowHeight);
    }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('body');  
  canvas.style('z-index', '-1');
  canvas.position(0,0);  
  canvas.scale(5);  
  noStroke();
  colorMode(HSB, 360, 255, 255);
}

function mousePressed(){
  clickPos = [mouseX, mouseY];
  console.log(windowWidth, windowHeight);  
}

function drawSun(){
  fill('#fede03'); 
    if (clickPos){
        ellipse(clickPos[0], clickPos[1], 100);
    }
  else 
      ellipse(150, 150, 100);
}

function draw() {
  windowResized();  
  var addSharpness = -0.03; // -0.3 to 0.3 reasonable
  noiseDetail(1, 0.5 + addSharpness);

  var skyHeight = height/3;
  var noiseWidth = height;
  var noiseHeight = height;
  var layerDifference = 0.3; // try 0.3
  var layers = 20;
  var barWidth = 1; // try 15
  var minScale = 0.075;
  var maxScale = 0.55;
  background(getColor(0));
 // drawSun();
    
  for (var i = 1; i < layers; i++) {
    var scale = exp(map(i, 0, layers-1, log(minScale), log(maxScale)));
    var y = map(i, 0, layers, 0, height)*1.7*scale + skyHeight; // 1.7 is a quick fix
    
    var lightness = map(i, 0, layers-1, 0, 1);
    fill(getColor(lightness));

    var xShift = 100 + millis() * 0.0002;
    for (var x = 0; x < width; x = x + barWidth) {
      var xCentered = x/3 - width/2;
      var noiseValue = noise(xCentered / scale / noiseWidth + xShift, i * layerDifference);
      var yMaxDifference = -noiseHeight/2*scale;
      var dy = map(noiseValue, 0, 1, -yMaxDifference, yMaxDifference);
      rect(x, y + dy, barWidth, height); // int() makes the edges more sharp
    }
  }
}

function getColor(lightness) {
  var gamma = exp(1.75 - lightness * 1.075); // lightness and contrast parameters
  lightness = pow(lightness, gamma) * 192 / 255; // *192/255 is a quick fix
    
  var hue1 = 220;
  var hue2 = 220;
  var addSaturation = 1.5;
  var addBrightness = -0.35;
  
  return color(map(lightness, 0, 1, hue1, hue2),
               map(pow(lightness, exp(-addSaturation)), 0, 1, 48, 255),
               map(pow(lightness, exp(addBrightness)), 0, 1, 255-16, 0));
}