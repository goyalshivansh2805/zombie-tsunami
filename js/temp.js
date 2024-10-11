const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const backgroundCity = new Image();
backgroundCity.src = '../assets/background/city/background.png';  
const backgroundBeach = new Image();
backgroundBeach.src = '../assets/background/beach/background.png';
const backgroundCloud = new Image();
backgroundCloud.src = '../assets/background/backgroundCloud.png';  
const backgroundTreesCity1 = new Image();
backgroundTreesCity1.src = '../assets/background/city/backgroundTrees1.png';  
const backgroundTreesCity2 = new Image();
backgroundTreesCity2.src = '../assets/background/city/backgroundTrees2.png';  
const backgroundTreesBeach1 = new Image();
backgroundTreesBeach1.src = '../assets/background/beach/backgroundTrees1.png'; 
const backgroundTreesBeach2 = new Image();
backgroundTreesBeach2.src = '../assets/background/beach/backgroundTrees2.png'; 

function loadHumanSprites(basePath, numColors) {
  const sprites1 = [];
  const sprites2 = [];
  for (let i = 1; i <= numColors; i++) {
    sprites1.push(`${basePath}/sprites1/${i}.png`);  
    sprites2.push(`${basePath}/sprites2/${i}.png`);
  }
  return {sprites1, sprites2};
}

const {sprites1:humanSprites1, sprites2:humanSprites2} = loadHumanSprites('../assets/humans', 1);
let randomHumanIndex = Math.floor(Math.random() * humanSprites1.length);
let currentHumanImage1 = new Image();
currentHumanImage1.src = humanSprites1[randomHumanIndex];
let currentHumanImage2 = new Image();
currentHumanImage2.src = humanSprites2[randomHumanIndex];

let currentHuman = currentHumanImage1;

let human = {
  x: Math.random() * (canvas.width ) + 150,  
  y: 380 - 100, 
  width: 150,   
  height: 150   
};

function drawHuman() {
  // console.log(currentHumanImage1);
  ctx.drawImage(currentHuman, human.x, human.y, human.width, human.height);
}

function loadZombieSprites(basePath, numColors) {
  const sprites1 = [];
  const sprites2 = [];
  for (let i = 1; i <= numColors; i++) {
    sprites1.push(`${basePath}/sprite1/${i}.png`);  
    sprites2.push(`${basePath}/sprite2/${i}.png`);  
  }
  return { sprites1, sprites2 };
}

const { sprites1: zombieSprites1, sprites2: zombieSprites2 } = loadZombieSprites('../assets/zombies', 10);

const randomIndex = Math.floor(Math.random() * zombieSprites1.length);
const randomZombie1 = new Image();
randomZombie1.src = zombieSprites1[randomIndex];

const randomZombie2 = new Image();
randomZombie2.src = zombieSprites2[randomIndex];

const roads = [];
for (let i = 1; i <= 5; i++) {
  const road = new Image();
  road.src = `../assets/roads/${i}.png`;  
  roads.push(road);
}


//variables
let currentBackground = backgroundCity;
let nextBackground = backgroundCity;
let bgX = 0;  
let minBgChangeDist = 9000;
let maxBgChangeDist = 10000;
let distanceUntilSwitch = getRandomDistance(minBgChangeDist, maxBgChangeDist); 
let nextBgX = canvas.width;
let bgSpeed = 3; 
let roadY = 380;
let obstaclesX = 500;
let cityTrees1Y = 250;
let cityTrees2Y = 350;
let beachTrees1Y = 250;
let beachTrees2Y = 300;
let beachTrees1Height = 200;
let beachTrees2Height = 400;
let zombieYVelocity = 0.5;
let zombieXVelocity = 3;
const zombieOffset = 30;
let frameCount = 0;  
let currentZombieImage = randomZombie1; 



function getRandomDistance(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


let zombie = {
  x: 100,
  y: 380 - zombieOffset,  
  width: 100,
  height: 100,
  dy: 0,
  dx:0,
  jumping: false
};

 

function drawBackground() {
  ctx.drawImage(currentBackground, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(currentBackground, bgX + canvas.width, 0, canvas.width, canvas.height);
  ctx.drawImage(nextBackground, nextBgX, 0, canvas.width, canvas.height);
  ctx.drawImage(nextBackground, nextBgX + canvas.width, 0, canvas.height, canvas.height);
}



const gapWidth = 150;
let roadSegments = [];  
let numRoads = 5;
let currentRoadIndex = 0;

function getRandomRoad() {
  return roads[Math.floor(Math.random() * roads.length)];
}

function initializeRoads() {
  let x = 0;
  for (let i = 0; i < numRoads; i++) {
    let randomRoad = getRandomRoad();
    roadSegments.push({
      x: x,
      image: randomRoad,
      width: randomRoad.naturalWidth || canvas.width,
      hasGap: true
    });
    x += roadSegments[i].width + gapWidth;  
  }
}

initializeRoads();

function checkIfZombieOnGap() {
  let zombieBottom = zombie.y + zombie.height;  

  for (let i = 0; i < roadSegments.length; i++) {
    const road = roadSegments[i];

    if (zombie.x + zombie.width > road.x && zombie.x < road.x + road.width) {

      if (zombieBottom >= roadY && zombieBottom <= roadY +200) {
        return false;
      }
      return true;
    }
  }
  return true;  
}


function drawRoads() {
  for (let i = 0; i < roadSegments.length; i++) {
    const road = roadSegments[i];
    ctx.drawImage(road.image, road.x, roadY, road.width, 200);
    road.x -= bgSpeed;

    if (road.x + road.width <= 0) {  
      let newRoad = getRandomRoad();  
      road.x = roadSegments[(i + roadSegments.length - 1) % roadSegments.length].x + 
               roadSegments[(i + roadSegments.length - 1) % roadSegments.length].width + gapWidth;  
      road.image = newRoad;
      road.width = newRoad.naturalWidth || canvas.width;
    }
  }
}



function drawUpperTrees(){
    if(currentBackground === nextBackground){
        if(currentBackground === backgroundCity){
            ctx.drawImage(backgroundTreesCity1, bgX, cityTrees1Y, canvas.width, beachTrees1Height); 
            ctx.drawImage(backgroundTreesCity1, nextBgX, cityTrees1Y, canvas.width, beachTrees1Height);
        }else{
            ctx.drawImage(backgroundTreesBeach1, bgX, beachTrees1Y, canvas.width, beachTrees1Height); 
            ctx.drawImage(backgroundTreesBeach1, nextBgX, beachTrees1Y, canvas.width, beachTrees1Height);
        }
    }else{
        if(currentBackground === backgroundCity){
            ctx.drawImage(backgroundTreesCity1, bgX, cityTrees1Y, canvas.width, beachTrees1Height); 
            ctx.drawImage(backgroundTreesBeach1, nextBgX, beachTrees1Y, canvas.width, beachTrees1Height);
        }else{
            ctx.drawImage(backgroundTreesBeach1, bgX, beachTrees1Y, canvas.width, beachTrees1Height); 
            ctx.drawImage(backgroundTreesCity1, nextBgX, cityTrees1Y, canvas.width, beachTrees1Height);
        }
    }
}

function drawLowerTrees(){
    if(currentBackground === nextBackground){
        if(currentBackground === backgroundCity){
            ctx.drawImage(backgroundTreesCity2, bgX, cityTrees2Y, canvas.width , beachTrees2Height);
            ctx.drawImage(backgroundTreesCity2, nextBgX , cityTrees2Y, canvas.width , beachTrees2Height);
        }else{
            ctx.drawImage(backgroundTreesBeach2, bgX, beachTrees2Y, canvas.width , beachTrees2Height);
            ctx.drawImage(backgroundTreesBeach2, nextBgX , beachTrees2Y, canvas.width , beachTrees2Height);
        }
    }else{
        if(currentBackground === backgroundCity){
            ctx.drawImage(backgroundTreesCity2, bgX, cityTrees2Y, canvas.width , beachTrees2Height);
            ctx.drawImage(backgroundTreesBeach2, nextBgX , beachTrees2Y, canvas.width , beachTrees2Height);
        }else{
            ctx.drawImage(backgroundTreesBeach2, bgX, beachTrees2Y, canvas.width , beachTrees2Height);
            ctx.drawImage(backgroundTreesCity2, nextBgX , cityTrees2Y, canvas.width , beachTrees2Height);
        }
    }
}
function drawPlayer(z) {
  ctx.drawImage(currentZombieImage, z.x, z.y, z.width, z.height);
}


function drawEntities() {
  drawBackground();
  drawCloud();
  drawUpperTrees();
  drawRoads();
  drawHuman();
  drawZombies(); 
  drawLowerTrees();
}

function drawCloud(){
    ctx.drawImage(backgroundCloud, bgX, 0, canvas.width, 200);
    ctx.drawImage(backgroundCloud, bgX + canvas.width, 0, canvas.width, 200);
}

document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' && !zombie.jumping) {
    zombie.jumping = true;
    zombie.dy = -12;
  }
});

let zombies = [zombie]; 
let humanTurnedIntoZombie = false;
function detectCollision(human, zombies) {
  for (let i = 0; i < zombies.length; i++) {
    const z = zombies[i];
    if (
      human.x < z.x + z.width &&
      human.x + human.width > z.x &&
      human.y < z.y + z.height &&
      human.y + human.height > z.y
    ) {
      return true; 
    }
  }
  return false; 
}

function turnHumanIntoZombie() {
  if (!humanTurnedIntoZombie && detectCollision(human, zombies)) {
    const newZombie = {
      x: human.x,
      y: human.y,
      width: 100, 
      height: 100, 
      image: randomZombie1 
    };
    zombies.push(newZombie); 
    humanTurnedIntoZombie = true; 
    human.x = -200; 
  }
}
function drawZombies() {
  for (let i = 0; i < zombies.length; i++) {
    drawPlayer(zombies[i]);
  }
}

function changeBackground(){
    // console.log(distanceUntilSwitch);
    if(distanceUntilSwitch <= 0){
        nextBackground = (currentBackground === backgroundCity) ? backgroundBeach : backgroundCity;
        distanceUntilSwitch = getRandomDistance(minBgChangeDist, maxBgChangeDist); 
        nextBgX = distanceUntilSwitch;
    }
}

function checkBackgroundAndRoads(){
  if (bgX <= -canvas.width) {
    bgX = 0;
    currentBackground = nextBackground; 
    nextBgX=canvas.width;
  }
}


function zombieJump(){
  zombie.y += zombie.dy;
  zombie.x += zombie.dx;

  if (zombie.y + zombie.height < roadY + zombieOffset || checkIfZombieOnGap()) {
    bgSpeed = 0;
    zombie.dy += zombieYVelocity;  
  } else {
    zombie.y = roadY - zombie.height + zombieOffset;  
    zombie.dy = 0;  
    zombie.jumping = false;
  }

  if(zombie.x < zombie.width){
    zombie.dx = zombieXVelocity;
  }else{
    zombie.dx = 0;
  }
}

function checkZombieFalling(){
  if (checkIfZombieOnGap() && !zombie.jumping) {
    zombie.dy += zombieYVelocity;  
    bgSpeed = 0;  
  } else {
    bgSpeed = 3;  
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawEntities();
  
  turnHumanIntoZombie(); 
  zombieJump();
  
  frameCount++;
  if (frameCount % 10 === 0) {  
    currentZombieImage = (currentZombieImage === randomZombie1) ? randomZombie2 : randomZombie1;
    currentHuman = (currentHuman === currentHumanImage1) ? currentHumanImage2 : currentHumanImage1;
  }
  
  checkZombieFalling();
  
  bgX -= bgSpeed;
  nextBgX -= bgSpeed;
  10
  
  distanceUntilSwitch -= bgSpeed;
  requestAnimationFrame(gameLoop);
}

gameLoop();


