// import * as Background from './background.js';
import * as Roads from './roads.js';
import Zombie from './zombie.js';
import {spawnHumans} from './human.js';
import {  spawnObstacles } from './obstacles.js';
import { spawnCoins } from './coins.js';
import BackgroundManager from './background.js';
import { spawnPowerUps, updatePowerUps } from './powerUps.js';





const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
export let speed = 3;

const scoreImage = new Image();
const backgroundManager = new BackgroundManager(canvas, ctx);
scoreImage.src = "../assets/score.png";
const powerUps = spawnPowerUps(ctx);
let totalZombies = 0;
let score = 0;
let totalCoins = 0;
const brainImage = new Image();
brainImage.src = "../assets/brainAndCoin.png";

export function setSpeed(value){
  speed = value;
}



const humans = spawnHumans(ctx); //generation of random humans in game
let zombies = [];
let coins = spawnCoins(ctx);
const obstacles = spawnObstacles(ctx);
let stopFrames=100;

function init() { //initializing all elements of a frame
    Roads.initializeRoads(canvas,ctx);
    addZombie();
    addZombie();
    // Background.changeBackground(canvas);
    gameLoop();
}



export function addZombie(zombie) {
    let x;
    if(!zombie){
      x=Math.floor(Math.random() * 150) + 50;
    }else{
      x = zombie.x + Math.random() *20 - 10;
    }
    let randomZombie = Math.floor(Math.random() * 9) +1;
    zombies.push(new Zombie(x,380,100,100,`../assets/zombies/sprite1/${randomZombie}.png`,`../assets/zombies/sprite2/${randomZombie}.png`));
    totalZombies++;
}

function isZombieEatingHuman(zombie, human) { //collision detection between human and zombie 
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
    Roads.drawRoads(canvas,ctx);
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
    backgroundManager.drawCloud();
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
              console.log("Coin collected!");
          }
      }

      if (coins[i].collected) {
          totalCoins++;
          score+=Math.floor(Math.random() * 10);
          coins.splice(i, 1);
      }
  }

    // console.log(obstacles)
    for (let i = 0; i < obstacles.length; i++) {
      const obstacle = obstacles[i];
      obstacle.update();
      zombies.forEach((zombie) => {
        if (obstacle.checkCollision(zombie)) {
            if (obstacle.isStatic && obstacle.checkDestruction() && !obstacle.isDestroyed) {
                obstacle.isDestroyed  = true;
                obstacle.destroy(obstacles, zombies);
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


function drawOverlay(){
  ctx.drawImage(brainImage, 10, 10, 100, 100);
  ctx.drawImage(scoreImage, canvas.width/2 -100, 10, 200, 100);
   
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