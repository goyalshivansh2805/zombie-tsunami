 const obstacles = [
    "../assets/obstacles/trafficLight/light.png",
    "../assets/obstacles/trafficLight/pole.png",
    "../assets/obstacles/dustbin.png",
    "../assets/obstacles/carsWithoutHumans/1.1.png",
    "../assets/obstacles/carsWithoutHumans/2.1.png"
];
import  {zombie} from "./script.js";
let bgObsSpeed = 3;
let obsroad = { obsX: 200, obsY: 200 }; 
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');


const images = {};
obstacles.forEach(src => {
    const img = new Image();
    img.src = src;
    images[src] = img;
});

let index = Math.floor(Math.random() * 5);

export function obstacle() {

    if (index === 0 || index === 1) {
        index=0;
        obsroad.obsY = 200;
        ctx.drawImage(images[obstacles[index + 1]], obsroad.obsX, obsroad.obsY, 200, 200); // Pole
        ctx.drawImage(images[obstacles[index]], obsroad.obsX + 170, obsroad.obsY + 20, 100, 100); // Light
    } else {
        obsroad.obsY = 250;
        ctx.drawImage(images[obstacles[index]], obsroad.obsX, obsroad.obsY, 200, 200);
        }

    obsroad.obsX -= bgObsSpeed; 
    if (obsroad.obsX <=-200) { 
        obsroad.obsX = canvas.width;
        index = Math.floor(Math.random() * 5); 
    }
}
