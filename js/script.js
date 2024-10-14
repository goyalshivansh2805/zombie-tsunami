// import * as Background from './background.js';
import * as Roads from './roads.js';
import Zombie from './zombie.js';
import {spawnHumans} from './human.js';
import {  spawnObstacles } from './obstacles.js';
import { spawnCoins } from './coins.js';
import BackgroundManager from './background.js';
import { spawnPowerUps, updatePowerUps } from './powerUps.js';
import {spawnLights} from './trafficLight.js';





const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
export let speed = 3;

const scoreImage = new Image();
const homeImage = new Image();
homeImage.src = "../assets/home.png";
const backgroundManager = new BackgroundManager(canvas, ctx);
scoreImage.src = "../assets/score.png";
const audio = new Audio('../assets/music.mp3');
audio.loop = true;
const audioImage = new Image();
audioImage.src = "../assets/audiomuted.png";
const powerUps = spawnPowerUps(ctx);
let totalZombies = 0;
export let score = 0;
export let totalCoins = 0;
const trafficLights = spawnLights(ctx);
const brainImage = new Image();
brainImage.src = "../assets/brainAndCoin.png";
const bloodImage = new Image();
bloodImage.src = "../assets/blood.png";
let bloodEffectActive = false; 
let bloodEffectStartTime = 0;
const bloodEffectDuration = 100;
export function setSpeed(value){
  speed = value;
}



const humans = spawnHumans(ctx);
let zombies = [];
let coins = spawnCoins(ctx);
const obstacles = spawnObstacles(ctx);
let stopFrames=100;

function init() {
    Roads.initializeRoads(canvas,ctx);
    addZombie();
    // addZombie();
    gameLoop();
}



export function addZombie(zombie) {
    let x;
    if(!zombie){
      x=Math.floor(Math.random() * 150) + 50;
    }else{
      x = zombie.x + Math.random() *10 - 5;
      bloodEffectActive = true;
      bloodEffectStartTime = Date.now(); 
    }
    let randomZombie = Math.floor(Math.random() * 9) +1;
    zombies.push(new Zombie(x,380,100,100,`../assets/zombies/sprite1/${randomZombie}.png`,`../assets/zombies/sprite2/${randomZombie}.png`));
    totalZombies++;
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

    backgroundManager.updateBackground(speed);
    backgroundManager.drawBackground();
    backgroundManager.drawUpperTrees();
    backgroundManager.drawCloud();
    Roads.drawRoads(canvas,ctx);

    trafficLights.forEach((trafficLight) => {
      trafficLight.update(zombies); 
      trafficLight.draw();
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
    backgroundManager.drawLowerTrees();
    drawOverlay();

    humans.forEach((human, index) => {
        human.update();
        human.draw(ctx);
        zombies.forEach((zombie) => {
          if (isZombieEatingHuman(zombie, human) && !human.isEaten) {
            human.isEaten = true;
            zombie.startEating(); 
            humans.splice(index, 1); 
            score += Math.floor(Math.random() * 50) + 50;
            setTimeout(()=>{
              zombie.stopEating(); 
            }, 1000);
            addZombie(zombie); 
        } 
        });
    });
    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].update();
      coins[i].draw(ctx);

      for (const zombie of zombies) {
          if (coins[i].checkCollision(zombie)) {
              // console.log("Coin");
          }
      }

      if (coins[i].collected) {
          totalCoins++;
          score+=Math.floor(Math.random() * 10);
          coins.splice(i, 1);
      }
  }

    if (bloodEffectActive) {
      ctx.drawImage(bloodImage, 0, 0, canvas.width, canvas.height);
      
      if (Date.now() - bloodEffectStartTime > bloodEffectDuration) {
          bloodEffectActive = false; 
      }
  }
    for (let i = 0; i < obstacles.length; i++) {
      const obstacle = obstacles[i];
      obstacle.update();
      zombies.forEach((zombie) => {
        if (obstacle.checkCollision(zombie)) {
            if (obstacle.isStatic && obstacle.checkDestruction() && !obstacle.isDestroyed) {
                obstacle.isDestroyed  = true;
                obstacle.destroy(obstacles, zombies);
            }else{
              zombie.x -= speed;
              zombie.x-=zombie.speed;
            }
        }
      });
      obstacle.draw(ctx);
      if (obstacle.x + obstacle.width < 0) {
        obstacles.splice(i, 1);
    }
  }


    if(zombies.length === 0){
        stopFrames--;
        if(stopFrames === 0){
          speed = 0;
          endGame();
        }
    }
    updatePowerUps(ctx, powerUps, zombies);
    requestAnimationFrame(gameLoop);
}

window.onload=()=>{
  init();
  
  
}
window.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    zombies.sort((a, b) => b.x - a.x);
    let leadZombieX = zombies[0].x;
    zombies[0].jump();
    zombies.slice(1).forEach((zombie, index) => {
      const distance = leadZombieX - zombie.x; 
      // console.log(distance)
      const effectiveSpeed = speed + (zombie.speed);

      if (effectiveSpeed > 0) {
        const timeToCatchUp = distance / effectiveSpeed;
        // console.log(timeToCatchUp) 
        const jumpDelay = timeToCatchUp*15; 

        setTimeout(() => {
          zombie.jump();
        }, jumpDelay);
      } 
    });
  }
});

const pauseImageX = canvas.width - 140;
const pauseImageY = 10;
const pauseImageWidth = 70;
const pauseImageHeight = 70;

const audioImageX = canvas.width - 70;
const audioImageY = 10;
const audioImageWidth = 70;
const audioImageHeight = 70;

function drawOverlay(){
  ctx.drawImage(brainImage, 10, 10, 100, 100);
  ctx.drawImage(scoreImage, canvas.width/2 -100, 10, 200, 100);
    ctx.drawImage(homeImage, pauseImageX, pauseImageY, pauseImageWidth, pauseImageHeight);
    ctx.drawImage(audioImage, audioImageX, audioImageY, audioImageWidth, audioImageHeight);
    drawNoOfZombies();
    drawScore();
}

function drawNoOfZombies(){
  ctx.beginPath();
    ctx.font = "50px Arial";
    ctx.fillStyle = "#f867fe";
    ctx.strokeStyle = "black";
    ctx.strokeText(totalZombies, 150, 100);
    ctx.fillText(totalZombies, 150,100);
    ctx.fillStyle = "orange";
  ctx.strokeStyle = "yellow";
    ctx.strokeText(zombies.length, canvas.width/2+40, 65);
    ctx.fillText(zombies.length, canvas.width/2+40, 65);
    ctx.closePath();
}

function drawScore(){
  ctx.beginPath();
  ctx.font = "50px Arial";
  ctx.fillStyle = "#fcf002";
  ctx.strokeStyle = "black";
  ctx.strokeText(totalCoins, 150, 50);
  ctx.fillText(totalCoins, 150,50);
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.strokeText(score, canvas.width/2+20, 105);
  ctx.fillText(score, canvas.width/2+20, 105);
  ctx.closePath();
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  if (
      clickX >= pauseImageX &&
      clickX <= pauseImageX + pauseImageWidth &&
      clickY >= pauseImageY &&
      clickY <= pauseImageY + pauseImageHeight
  ) {
      toggleHome();
  }

  if (
      clickX >= audioImageX &&
      clickX <= audioImageX + audioImageWidth &&
      clickY >= audioImageY &&
      clickY <= audioImageY + audioImageHeight
  ) {
      if (audio.paused) {
          audio.play();
          audioImage.src = "../assets/audioplaying.png";
      } else {
          audio.pause();
          audioImage.src = "../assets/audiomuted.png";
      }
  }
});

function toggleHome() {
  window.location.href = "index.html";
}

function endGame() {
  sessionStorage.setItem("totalCoins", totalCoins);
  sessionStorage.setItem("score", score);
  sessionStorage.setItem("zombies", totalZombies);
  window.location.href = "gameover.html";
}