import { roadY,roadSegments } from "./roads.js";
import { speed } from "./script.js";

let interval;
export default class TrafficLight {
    constructor(ctx, x, y, width, height) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.redLightImage = new Image();
        this.greenLightImage = new Image();
        this.poleImage = new Image();
        this.redLightImage.src = "../assets/obstacles/trafficLight/red.png";
        this.greenLightImage.src = "../assets/obstacles/trafficLight/green.png";
        this.poleImage.src ="../assets/obstacles/trafficLight/pole.png";
        this.lightState = "red"; 
    }

    draw() {
        if(speed === 0){
            clearInterval(interval);
        }
        this.ctx.drawImage(this.poleImage, this.x, this.y, this.width, this.height);
        // console.log("s")
        if (this.lightState === "red") {
            this.ctx.drawImage(this.redLightImage, this.x + this.width / 4 + 50, this.y - this.height / 2 + 100, this.width / 2, this.height / 4);
        } else if (this.lightState === "green") {
            this.ctx.drawImage(this.greenLightImage, this.x + this.width / 4 +50, this.y - this.height / 2 + 100, this.width / 2, this.height / 4);
        }
    }

    update(zombies) {
        this.x -= speed; 
        
        for (let zombie of zombies) {
            if (zombie.x > this.x + 100) {
                this.lightState = "green"; 
                break;
            }
        }
    }
    isOnRoad() {
        const lightBottom = this.y + this.height; 
        const edgeMargin = 300; 

        for (const road of roadSegments) {
            const roadBottom = roadY + 100; 

            const isWithinHorizontalBounds = (
                this.x + this.width - edgeMargin > road.x && 
                this.x + edgeMargin < road.x + road.width
            );

            const isAboveRoad = lightBottom >= roadY; 
            const isBelowRoad = lightBottom <= roadBottom; 

            if (isWithinHorizontalBounds && isAboveRoad && isBelowRoad) {
                return true; 
            }
        }
        return false;
    }
}

export function spawnLights(ctx){
    const lights = [];
    let randomTime = Math.floor(Math.random() * 10) + 3; 
    interval = setInterval(() => {
        const lightWidth = 150;
        const lightHeight = 200;
        const randomX = ctx.canvas.width + Math.random() * 100; 
        const randomY = roadY - 180;
        const newLight = new TrafficLight(ctx, randomX, randomY, lightWidth, lightHeight);
        if (newLight.isOnRoad()){
            lights.push(newLight);
        }
        randomTime = Math.floor(Math.random() * 10) + 10; 
    },randomTime* 1000);
    return lights;
}