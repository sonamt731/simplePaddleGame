var paddlexPos = 200
var paddleyPos = 575

var ballxPos = 250
var ballyPos = 300

//randomized speed
var xSpeed = 0;
var ySpeed = 0;

//original ball speed
//store original so when you increase or decrease speed it does not go out of bounds
let ballXSpeedOriginal = xSpeed;
let ballYSpeedOriginal = ySpeed;

//initialize off of the screen to hide it
var ufoxPos = 600;
var ufoyPos = 700;

let restart = true;
var bounces = 0;
var UFOs = 0;

var bgY1 = 0;
var bgY2 = 1000;

//variables for random color changing 
let redness = 0;
let rednessDirection = 1;

let greenness = 0;
let greennessDirection = 1;

let blueness = 0;
let bluenessDirection = 1;


function preload() {
  bg = loadImage('starfield.png')
  ufo = loadImage('ufo.png')

  //load sounds
  bounce = loadSound('space_bounce.wav');
  gameOver = loadSound('game_over.wav');
  shipCaught = loadSound('ship_caught.wav');

}

function setup() {
  background(0);

  // set the background size of our canvas
  createCanvas(500, 600);
  noStroke()

  //set the randomized color 
  redness = random(0,255);
  greenness = random(0,255);
  blueness = random(0,255);
}

function draw() {
  imageMode(CORNER);
	image(bg, 0, bgY1);
  image(bg, 0, bgY2);

  bgY1 += 2;
  bgY2 +=2;

  if (bgY1 >= 1000) {
    bgY1 = bgY2 - 1000;
  }

  if (bgY2 >= 1000){
    bgY2 = bgY1 - 1000;
  }

	//three visual borders --> width of 20
	fill(128)
  rect(0,0,20,600);
  rect(0,0,500, 20);
  rect(480,0,20,600);

  fill(255);
  textSize(15);
  text("Bounces: " + bounces + " UFOs: " + UFOs, 20, 15);

  //randomized color for the ball
	fill(redness, greenness, blueness)
	//third parameter is the width
	ellipse(ballxPos, ballyPos, 20);

  //randomize the color gradually
  redness += rednessDirection;
  if(redness >= 255 || redness<=0){
    rednessDirection *= -1
  }

  greenness += greennessDirection;
  if(greenness >= 255 || greenness<=0){
    greennessDirection *= -1
  }

  blueness += bluenessDirection;
  if(blueness >= 255 || blueness<=0){
    bluenessDirection *= -1
  }

	//ufo 
  imageMode(CENTER);
	image(ufo, ufoxPos, ufoyPos);

  	// move left - make sure does not touch border 
  	//I added a 5 unit gap in between the border and the paddle 
	if (keyIsDown(65) && paddlexPos>25) {
		paddlexPos -= 3
	}

  //move right
  if (keyIsDown(68) && paddlexPos<375) {
  	paddlexPos += 3
  }
  fill(280)

  //the paddle
  rect(paddlexPos, paddleyPos, 100,25);

  ballxPos+= xSpeed;
  ballyPos+= ySpeed;

  //hits left or right border - should bounce and reverse its xSpeed 
  if ((ballxPos >= width - 20 - 10) || (ballxPos <= 20 + 10)){
  	xSpeed *= -1
    bounces+=1
    bounce.play();
  }

  //hits the top border - should bounce and reverse its ySpeed
  if ((ballyPos <= 20 + 10)){
  	ySpeed *= -1
    bounces+=1
    bounce.play();
  }

  //hits the paddle 
  //565 because the paddle height is 25 and the width of the ball is 20 - radius 10 (600-25-10)
  if ((ballyPos >= 565) && (ballxPos >= paddlexPos) && (ballxPos <= paddlexPos+100)){

    //acceleration
    //left edge hit
  	if (ballxPos <= paddlexPos+50){
      let valToScale = map(ballxPos, paddlexPos, paddlexPos + 50, 3, .1);
      xSpeed = ballXSpeedOriginal * valToScale;
    } 
    //right edge
    else{
      let valToScale = map(ballxPos, paddlexPos +50, paddlexPos + 100, .1, 3);
      xSpeed = ballXSpeedOriginal * valToScale;
    }
   //  ySpeed = map(ballxPos, paddlexPos, paddlexPos + (100/3), paddlexPos + 2*(100/3), ySpeed * -.8);
    ySpeed *= -1

    //without this line the ball keeps bouncing 
    ballyPos = 564;
    bounces+=1
    bounce.play();
  }

  //case that the ball travels out of the frame --> add 25 (ball diameter/width) to assure the ball is completely off screen 
  else if (ballyPos > 600 + 20){
    gameOver.play();
  	ballxPos = 250; 
  	ballyPos = 300;
  	xSpeed = 0;
  	ySpeed = 0;
  	//make the mouse pressed functionality available again - mouse pressed only works to restart the game once the game has ended
  	restart = true;
  	//remove from screen to start the game
  	ufoxPos = 600;
  	ufoyPos = 700;

  }

  //check to see if the ball has gotten close ot the ufo 
  let d = dist(ballxPos, ballyPos, ufoxPos, ufoyPos);
  //note the image dimensions are 100 by 100 
  //image is drawn from center so take into account 50 units
  if (d < 60) {
    shipCaught.play();
  	ufoxPos = random(21+50, 380-50);
  	ufoyPos = random(21+50, 400-50);
    UFOs+=1;
  }
}

function mousePressed(){
	if (restart == true){
		xSpeed = getRandomSpeed();
    ySpeed = getRandomSpeed();
    ballXSpeedOriginal = xSpeed;
    ballYSpeedOriginal = ySpeed;
    //disable mouse pressed functionality so the user cannot generate new speeds for the ball
    restart = false;

    //change positon of the ufo - visible only when game is being played
    //avoiding overlap of right and left border
    //note that the image is drawn from the top right corner
    ufoxPos = random(21+50, 380-50)
    //avoiding overlap of top border & 200 pixels fromn the bottom
    ufoyPos = random(21+50, 400-50)
    //reset point counts
    bounces = 0;
    UFOs = 0;

	}
}

//function to get randomized speed - makes sure the ball has not gotten too close to 0
function getRandomSpeed(){ 
	let num = 0
	while (num < 1.5 && num > -1.5){
		num = random(-2.5,2.5)
	}
	return num;
}
