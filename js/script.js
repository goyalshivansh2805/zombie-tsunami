const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

import  {obstacle} from "./obstacle.js";
//background ki image load krne k liye
const backgroundImage = new Image();
backgroundImage.src = '../assets/background/city/background.png';  
const backgroundCloud = new Image();
backgroundCloud.src = '../assets/background/backgroundCloud.png';  
const backgroundTrees1 = new Image();
backgroundTrees1.src = '../assets/background/city/backgroundTrees1.png';  
const backgroundTrees2 = new Image();
backgroundTrees2.src = '../assets/background/city/backgroundTrees2.png'; 
const backgroundRoad = new Image();
backgroundRoad.src = '../assets/background/backgroundRoad.png'; 

// zombie ki sprites load karne ke liye
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

//choosing random zombie
const randomIndex = Math.floor(Math.random() * zombieSprites1.length);
const randomZombie1 = new Image();
randomZombie1.src = zombieSprites1[randomIndex];

const randomZombie2 = new Image();
randomZombie2.src = zombieSprites2[randomIndex];

let bgX = 0;  
let bgSpeed =3; 

const gravity = 0.5;
let roadY = 380;  

export let zombie = {
  x: 100,
  y: roadY + 30,  
  width: 100,
  height: 100,
  dy: 0,
  jumping: false
};

let frameCount = 0;  
let currentZombieImage = randomZombie1;  

//drawing bg
function drawBackground() {
  ctx.drawImage(backgroundImage, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, bgX + canvas.width, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundCloud, bgX, 0, canvas.width, 200);
  ctx.drawImage(backgroundCloud, bgX + canvas.width, 0, canvas.width, 200);
  ctx.drawImage(backgroundTrees1, bgX, 250, canvas.width, 200);
  ctx.drawImage(backgroundTrees1, bgX + canvas.width, 250, canvas.width, 200);
  ctx.drawImage(backgroundRoad, bgX, roadY, canvas.width, 200);
  ctx.drawImage(backgroundRoad, bgX + canvas.width, roadY, canvas.width, 200);
  ctx.drawImage(backgroundTrees2, bgX, 430, canvas.width, 200);
  ctx.drawImage(backgroundTrees2, bgX + canvas.width, 430, canvas.width, 200);
  bgX -= bgSpeed;

  if (bgX <= -canvas.width) {
    bgX = 0;
  }
}

//space pe jump karne ke liye
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' && !zombie.jumping) {
    zombie.jumping = true;
    zombie.dy = -12;
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  
  // agar space dabaya hoga to zombie jump karega
  zombie.y += zombie.dy;

  // agar zombie road se upar hai to gravity apply hogi
  if (zombie.y + zombie.height < roadY + 30) {
    zombie.dy += gravity; 
  } else {
    zombie.y = roadY - zombie.height + 30;
    zombie.dy = 0;  // Stop the vertical movement
    zombie.jumping = false;
  }

  //har 10 frames ke baad zombie ki image change hogi to show ki vo moving hai
  frameCount++;
  if (frameCount % 10 === 0) {  
    if (currentZombieImage === randomZombie1) {
      currentZombieImage = randomZombie2;
    } else {
      currentZombieImage = randomZombie1;
    }
  }

  //zombie draw karne ke liye
  obstacle();
  ctx.drawImage(currentZombieImage, zombie.x, zombie.y, zombie.width, zombie.height);
  requestAnimationFrame(gameLoop);
}
gameLoop()
