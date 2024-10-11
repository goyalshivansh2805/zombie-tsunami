import * as Background from './background.js';
import * as Roads from './roads.js';
import Zombie from './zombie.js';


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


export let speed = 3;
export function setSpeed(value){
    speed = value;
}



let zombies = [];
let stopFrames=100;

function init() {
    Roads.initializeRoads(canvas,ctx);
    addZombie();
    addZombie();
    gameLoop();
}

function addZombie() {
    let x = Math.floor(Math.random() * (200 - 50) + 50);
    let randomZombie = Math.floor(Math.random() * 10);
    zombies.push(new Zombie(x,380,100,100,`../assets/zombies/sprite1/${randomZombie}.png`,`../assets/zombies/sprite2/${randomZombie}.png`));
}


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Background.drawBackground(canvas,ctx);
    Background.drawCloud(canvas,ctx);
    Background.drawUpperTrees(canvas,ctx);
    Roads.drawRoads(canvas,ctx);
    zombies.sort((a, b) => a.y - b.y);
    zombies.forEach((zombie,index) => {
        zombie.update();
        zombie.draw(ctx);
        if(zombie.checkIsFalling()){
          zombie.fall();
          if(zombie.y > canvas.height){
            zombies.splice(index,1);
          }
        };
    });
    if(zombies.length === 0){
        stopFrames--;
        if(stopFrames === 0){
          speed = 0;
        }
    }
    Background.setBgX(Background.bgX  -speed);
    Background.setNextBgX(Background.nextBgX- speed);
    Background.drawLowerTrees(canvas,ctx);


    Background.changeBackground();
    Background.checkBackgroundAndRoads(canvas,ctx);
    Background.setDistanceUntilSwitch(Background.distanceUntilSwitch - speed);
    requestAnimationFrame(gameLoop);
}

window.onload=()=>{
  init();
}

window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
      const jumpDelay = 300; 

      zombies.forEach((zombie, index) => {
          setTimeout(() => {
              zombie.jump();
          }, index * jumpDelay); 
      });
  }
});
