import * as Background from './background.js';
import * as Roads from './roads.js';
import Zombie from './zombie.js';
import {spawnHumans} from './human.js';
import {  spawnObstacles } from './obstacles.js';




const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreImage = new Image();
scoreImage.src = "../assets/score.png";

export let speed = 3;
export function setSpeed(value){
  speed = value;
}



const humans = spawnHumans(ctx);
let zombies = [];
const obstacles = spawnObstacles(ctx);
let stopFrames=100;

function init() {
    Roads.initializeRoads(canvas,ctx);
    addZombie();
    addZombie();
    Background.changeBackground(canvas);
    gameLoop();
}

function addZombie() {
    let x = Math.floor(Math.random() * (200 - 50) + 50);
    let randomZombie = Math.floor(Math.random() * 9) +1;
    zombies.push(new Zombie(x,380,100,100,`../assets/zombies/sprite1/${randomZombie}.png`,`../assets/zombies/sprite2/${randomZombie}.png`));
}

function isZombieEatingHuman(zombie, human) {
  return (
      zombie.x < human.x + human.width &&
      zombie.x + zombie.width > human.x &&
      zombie.y < human.y + human.height &&
      zombie.y + zombie.height > human.y
  );
}


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Background.drawBackground(canvas,ctx);
    Background.drawCloud(canvas,ctx);
    Background.drawUpperTrees(canvas,ctx);
    Roads.drawRoads(canvas,ctx);
    ctx.drawImage(scoreImage, canvas.width/2 -100, 10, 200, 100);

    humans.forEach((human, index) => {
        human.update();
        human.draw(ctx);
        zombies.forEach((zombie) => {
          if (isZombieEatingHuman(zombie, human)) {
            zombie.startEating(); 
            setTimeout(()=>{
              zombie.stopEating(); 
            }, 1000);
            addZombie(); 
            humans.splice(index, 1); 
        } 
        });
    });

    zombies.sort((a, b) => a.y - b.y);
    zombies.forEach((zombie,index) => {
        zombie.update(obstacles);
        zombie.draw(ctx);
        if(zombie.checkIsFalling(obstacles)){
          zombie.fall();
          if(zombie.y > canvas.height){
            zombies.splice(index,1);
          }
        };
        if(zombie.x < -zombie.width){
          zombies.splice(index,1);
        }
    });
    console.log(obstacles)
    for (let i = 0; i < obstacles.length; i++) {
      const obstacle = obstacles[i];
      obstacle.update();
      obstacle.draw(ctx);
      if (obstacle.x + obstacle.width < 0) {
        obstacles.splice(i, 1);
    }
  }


    if(zombies.length === 0){
        stopFrames--;
        if(stopFrames === 0){
          speed = 0;
        }
    }
    Background.setBgX(Background.bgX  -speed);
    Background.setNextBgX(Background.nextBgX- speed);
    Background.drawLowerTrees(canvas,ctx);
    Background.checkBackgroundAndRoads(canvas,ctx);
    requestAnimationFrame(gameLoop);
}

window.onload=()=>{
  init();
  
}

window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
      let jumpDelay = 0; 

      zombies.sort((a, b) => b.x - a.x);
      zombies.forEach((zombie, index) => {
          setTimeout(() => {
              zombie.jump();
              jumpDelay += 100;
          }, index*100 + jumpDelay); 
      });
  }
});
