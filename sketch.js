var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState,allPlayers,car1,car2,cars
var fuels,coins,obstacles

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  c1 = loadImage("./assets/car1.png")
  c2 = loadImage("./assets/car2.png")
  track = loadImage("./assets/track.jpg")
  fuel = loadImage("./assets/fuel.png")
  coin = loadImage("./assets/goldCoin.png")
  ob1 = loadImage("./assets/obstacle1.png")
  ob2 = loadImage("./assets/obstacle2.png")
  life = loadImage("./assets/life.png")
  boom = loadImage("./assets/blast.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if(playerCount==2){
    game.updateState(1)
  }
  if(gameState==1){
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
