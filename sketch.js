// we both wrote the bulk of the code together, we split the work between the artwork and speech

// should make it so that there is an animation when the player collects an item
class Sparkle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 255;
    this.size = random(5, 12);
    this.xSpeed = random(-1, 1);
    this.ySpeed = random(-1, 1);
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.life -= 5;
  }

  //our 'sparkle' is made of ellipses
  display() {
    noStroke();
    fill(255, 200, 255, this.life);
    ellipse(this.x, this.y, this.size);
  }

  isFinished() {
    return this.life <= 0;
  }
}


// decided to add a short script!!!
//ellie wrote the script!

let scriptLines = [
  "Welcome to the Dressing Room! click enter to navigate through this first part of speech.",
  "Can you help me get ready?! lets find all the makeup. Just for fun, not because we have to!",
  "Good luck!",
];

let currentLineIndex = 0;
let showScript = true;

//background music file
let bgMusic;

// critical commentary script
let criticalScriptLines = [
  //issue with game not showing the first line
  // struggled to get it to cycle through the script but we think it works now
 "You're doing great!! but remember- you're perfect with or without makeup!",//we developed qutes together that go against societal standards //
 "Did you know that 80% of adolescent women feel that their looks are the most important thing about them?",
 "I hope you don't feel this way.",
 "You should love yourself as you are.",
 "Everyone is unique. Why would we all want to look the same anyways?",
 "Humans are like snowflakes. Each one is different and beautiful in their own way.",
 "Big corporations tell us to 'be confident', but then try to sell products to change ourselves? But we shouldn't.",
 "Every filter, every editing app teaches us to be a different version of ourselves, who society wants us to be. Not who we really are.",
 "Getting ready is fun! But make sure you only do all this if and when you want to!",
 "What makes you *you* isn't something that can be found in a makeup bag.",
 "Lots of blush is pretty! but remember, these are just *extra* tools, not rules.",
 "you got them all! but what if you were already enough, without all the makeup?",
];

// declaring the variable criticalineindex

let criticalLineIndex = 0;
let showCriticalScript = false; 

//adding different fonts to add a personal touch
//bold font for header

let customFont;
//handwriting style font for the script
// less bold than the main typeface 

let font2;

// setting game states
// we have a start screen, instructions screen, three levels of the game and a win screen  

let state = "start"; // start, instructions, game, win
let level = 0;

//our game has 3 levels
const totalLevels = 3;

// variables for our images and art

let instructionsImage;
let playerImg, elementImg, doorImg;
let tilemap = [];
let walkableTiles = [];

// the player

let player = {
  x: 1,
  y: 1
};

//sparkle array
let sparkles = [];

// variable for the win screen 

let winImage;

//variable to allow the items to be counted when you collect them
let collectedItems= 0;

function preload() {

//background music sound
bgMusic = loadSound("bgMusic.mp3");

//fonts
//arya chose the fonts!
customFont = loadFont("starbim.ttf");
font2 = loadFont("speech.ttf")//

  winImage = loadImage("winImage.png"); 
  //display for when you complete it 
  
  startImage = loadImage("startpage.png")

  instructionsImage = loadImage("instructions.png");

  playerImg = loadImage("player.png");

  // add more makeup elements, not sure if there is a simpler way to do this than adding many different variables
  // game became buggy and yellow door tiles stopped working when other makeup elements were added, not sure why
  // other original art files added into the readme as we didn't want it to go to waste
  elementImg = loadImage("blush.png");

  doorImg = loadImage("door.png");

// light pink walkable tile with a darker pink non walkable tile 
  walkImg = loadImage("walkable.png")
  nonWalkImg = loadImage("nonwalkable.png")
}


function setup() {
  createCanvas(1000,850);
  generateLevel(level);

  //plays our background music on a loop 
  bgMusic.loop();
  bgMusic.setVolume(1);
  //sets the volume for the start
}

function draw() {

  //light background to fit the theme  
  background(240, 244, 248);

  if (state === "start") {
    drawStartScreen();

    //if start button is pressed then start screen gets drawn
  } else if (state === "instructions") {
    drawInstructions();

  } else if (state === "game") {
    drawGame();

    //this is the actual game state

  } else if (state === "win"){
    drawWinScreen();
    //displays when game is completed
  }
}

function drawStartScreen() {

  textAlign(CENTER, CENTER);
  textSize(60);

  //bigger size text for title
  fill(0);

  //black colour text
  textFont(customFont);

  // not spelt right, but this is intentional
  // the font we chose has a star in place of the 'a' which we wanted in the title
  // not a mistake!
  text("The Dressing Raam!", width/2, height/2 - 40);

  image(startImage, 280, 0, 450, 360);
  //both characters on the start screen- characters are symbolic of the gamemakers and deliberately made to look like us!!

  //clicking this button takes you to our instructions!
  drawButton("Instructions", width/2 - 75, height/2, 150, 50, () => {
    state = "instructions";
  });
}

drawButton("Instructions", width/2 - 75, height/2, 150, 50, () => {
  state = "instructions";
  //creates the button that says instructions and sets the games state to 'instructions'
});


function drawInstructions() {

  //from the instructions page you go to the main game 
image(instructionsImage, 0, 0, width, height);
drawButton("Start Game", width - 150, height - 70, 120, 40, () => {

  state = "game";
  level = 0;
  generateLevel(level);
});
}

function drawWinScreen(){
  image(winImage, 0, 0, width, height);
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(0);

  textFont(customFont);
  //this makes it so that our win screen loads to take up the entire canvas , otherwise the game would look messy!
}

function drawGame() {
  drawTilemap();
  //prompts p5 to draw our tilemap

  image(playerImg, player.x * 64, player.y * 64, 64, 64);
  //sets up the size of the player on the screen
  
  fill(0);
  textSize(30);
  text("level: " + (level + 1), 40, height - 35);
  //all the characteristics of the text eg text size and width, didnt want the level text too big because it isnt as important
  textSize(25);
  fill(80);
  text(`Makeup Collected: ${collectedItems}`, width - 320, height - 35);

  //puts our script box on the screen 
  if (showScript) {
    drawScriptBox();

  } else if (showCriticalScript){
    drawCriticalScriptBox();
    //this is the text that plays everytime a makeup icon is collected by our character
  }

  //makes the sparkles disappear after an item is collected
  //wanted to add sound effects with the sparkles but this made the game buggy
  for (let i = sparkles.length - 1; i >= 0; i--) {
    sparkles[i].update();
    sparkles[i].display();
    if (sparkles[i].isFinished()) {
      sparkles.splice(i, 1);
    }
  }
  
}

function drawScriptBox() {
  let boxX = width - 355;
  let boxY = 50;
  //puts the script box to the right of the tilemap, where there would otherwise be a blank space- so we utilised this space 

  let boxW = 350;
  let boxH = 400;
  //box needed to be big enoughto contain entire script

  fill(255, 240, 250);
  stroke(150);
  rect(boxX, boxY, boxW, boxH, 20);

  //using a different font for the speech for aesthetic purposes
  textFont(font2);

  //font found in external website that is linked in the readme file
  fill(0);
  noStroke();
  textSize(25);
  textAlign(LEFT, TOP);
  text(scriptLines[currentLineIndex], boxX + 20, boxY + 20, boxW - 40);
}


function drawCriticalScriptBox() {
  let boxX = width - 355;
  let boxY = 50;
  let boxW = 350;
  let boxH = 400;

  fill(255, 240, 250);
  stroke(150);
  rect(boxX, boxY, boxW, boxH, 20);
  // same box for the ongoing script as the initial box 

  textFont(font2);
  // different font 
  fill(0);
  noStroke();
  textSize(22);
  textAlign(LEFT, TOP);
  text(criticalScriptLines[criticalLineIndex], boxX + 20, boxY + 20, boxW - 40);
}


function drawTilemap() {
for (let y = 0; y < tilemap.length; y++) {
  for (let x = 0; x < tilemap[y].length; x++) {
    let tile = tilemap[y][x];

    if (tile === 0) {
      // walkable tile (light pink)
      image(walkImg, x * 64, y * 64, 64, 64);
    } else if (tile === 1) {
      // wall (dark pink tile)
      image(nonWalkImg, x * 64, y * 64, 64, 64);
    } else if (tile === 2) {
      // image for the makeup tiles
      image(elementImg, x * 64, y * 64, 64, 64);
    } else if (tile === 3) {
      // yellow door image
      image(doorImg, x * 64, y * 64, 64, 64);
    }
  }
}
}


let isMuted = false;

function keyPressed() {

// issue with the music not being loud enough (RESOLVED)
//code to mute the game music if necessary
//last minute addition so unsure if it is working, working at time of submission 
// when you press 'm' it mutes the music

if (key === 'm' || key === 'M') {
    isMuted = !isMuted;
    bgMusic.setVolume(isMuted ? 0 : 0.2);
  }

  if (state === "win" && keyCode === ENTER){
    state = "start";
    level = 0; 
    currentLineIndex = 0;
    criticalLineIndex = 0;
    showScript = true;
    return;
  }

  if (state !== "game") return;
  let newX = player.x;
  let newY = player.y;


// pressing the enter key takes you directly to the game 
// struggled to get this to work
// working at time of submission 

if (keyCode === ENTER) {
  if (showScript) {
    currentLineIndex++;
    if (currentLineIndex >= scriptLines.length) {
      showScript = false;
    }
    return;
  } else if (showCriticalScript) {
    criticalLineIndex++;
    if (criticalLineIndex >= criticalScriptLines.length) {
      showCriticalScript = false;
    }
    return;
  }
}





  //game used wasd controls
  // works on both caps lock and lowercase 


  if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') newX--;
  if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') newX++;
  if (keyCode === UP_ARROW || key === 'w' || key === 'W') newY--;
  if (keyCode === DOWN_ARROW || key === 's' || key === 'S') newY++;


  if (tilemap[newY][newX] !== 1) {
    player.x = newX;
    player.y = newY;


    if (tilemap[newY][newX] === 2) {
      tilemap[newY][newX] = 0;
      collectedItems++;
      for (let i = 0; i < 10; i++) {
        sparkles.push(new Sparkle(player.x * 64 + 32, player.y * 64 + 32));
      }      
      if (criticalLineIndex < criticalScriptLines.length) {
        showCriticalScript = true;
        criticalLineIndex++;
      } else {
        showCriticalScript = false;
      }    
    } else if (tilemap[newY][newX] === 3) {
      level++;
      if (level < totalLevels) {
        generateLevel(level);
      } else {
        state = "win"; 
      }
    }
  }
}

function generateLevel(lvl) {
// 10x10 tilemap grids
let maps = [

  [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,2,1],
    [1,0,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,1,1],
    [1,0,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,1],
    [1,2,1,1,1,1,0,3,0,1],
    [1,1,1,1,1,1,1,1,1,1]
  ],

  //different tilemaps for the different levels

  [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,3,1],
    [1,1,1,1,1,0,1,0,1,1],
    [1,2,0,0,1,0,0,2,0,1],
    [1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,2,1,0,1],
    [1,2,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1]
  ],

  // each level gets more difficult as there are more makeup pictures on each level

  [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,2,0,3,1],
    [1,2,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,1],
    [1,2,1,1,1,0,1,0,1,1],
    [1,0,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,1,1,1,0,1],
    [1,0,0,2,0,0,0,1,0,1],
    [1,2,1,1,1,1,2,0,0,1],
    [1,1,1,1,1,1,1,1,1,1]
  ]
];



tilemap = maps[lvl];
player.x = 1;
player.y = 1;
}



// when the button is clicked it takes you to the next page 
function drawButton(label, x, y, w, h, onClick) {
fill(255);
stroke(0);
rect(x, y, w, h);
fill(0);
noStroke();
textSize(16);
textAlign(CENTER, CENTER);
text(label, x + w / 2, y + h / 2);



// registers when you click the mouse
if (mouseIsPressed && mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
  onClick();
}
}