import { speed } from "./script.js";
import { roadY,roadSegments } from "./roads.js";

const movingObstacleTypes = [
    { 
        spritePaths: ["../assets/obstacles/carsWithoutHumans/1.png"], 
        width: 150, 
        height: 150, 
        speed: 5, 
        yPosition: roadY - 100 
    },
    { 
        spritePaths: ["../assets/obstacles/carsWithoutHumans/2.png"], 
        width: 150, 
        height: 150, 
        speed: 5, 
        yPosition: roadY - 100 
    },
    { 
        spritePaths: ["../assets/obstacles/carsWithoutHumans/3.png"], 
        width: 150, 
        height: 150, 
        speed: 5, 
        yPosition: roadY - 100 
    },
    { 
        spritePaths: ["../assets/obstacles/helicopter/1.png", "../assets/obstacles/helicopter/2.png"], 
        width: 200, 
        height: 80, 
        speed: 7, 
        yPosition: 150 
    }
];

const staticObstacleTypes = [
    { 
        spritePaths: ["../assets/obstacles/carsWithHumans/1.png", "../assets/obstacles/carsWithHumans/2.png"], 
        width: 150, 
        height: 150, 
        isStatic: true,
        yPosition: roadY - 90 
    },
    { 
        spritePaths: ["../assets/obstacles/dustbin.png"], 
        width: 170, 
        height: 170, 
        isStatic: true,
        yPosition: roadY-120
    },
    { 
        spritePaths: ["../assets/obstacles/tanks/1.png", "../assets/obstacles/tanks/2.png"], 
        width: 200, 
        height: 200, 
        isStatic: true,
        yPosition: roadY - 150 
    },
    { 
        spritePaths: ["../assets/obstacles/phoneBooth/1.png", "../assets/obstacles/phoneBooth/2.png"], 
        width: 150, 
        height: 150, 
        isStatic: true,
        yPosition: roadY - 100 
    }
];




let interval;
export class Obstacle {
    constructor(x, y, width, height, spritePaths, speed = 0, isStatic = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprites = spritePaths.map(path => {
            let img = new Image();
            img.src = path;
            return img;
        });
        this.currentSpriteIndex = 0;
        this.isStatic = isStatic; 
        this.speed = speed;
        this.frameCount = 10;
        this.dy = 0;
        this.nearGap = false; 
    }

    draw(ctx) {
        if(speed === 0){
            clearInterval(interval);
        }
        this.frameCount--;
        if (this.frameCount === 0) {
            this.currentSpriteIndex = (this.currentSpriteIndex + 1) % this.sprites.length;
            this.frameCount = 10;
        }
        ctx.drawImage(this.sprites[this.currentSpriteIndex], this.x, this.y, this.width, this.height);
    }

    update() {
        if(this.speed === 7){
            // console.log(this.x);
            this.x -= this.speed;
            return
        }
        this.checkNearGap();
        if (this.isStatic || this.nearGap){
            // console.log("s")
            this.x -= speed;
        }else{
            this.x -= this.speed;
        }
    }

    checkCollision(zombie) {
        return zombie.x < this.x + this.width &&
               zombie.x + zombie.width > this.x &&
               zombie.y < this.y + this.height &&
               zombie.y + zombie.height > this.y;
    }

    isOnTop(zombie) {
        const zombieBottom = zombie.y + zombie.height;
        return zombieBottom >= this.y && zombieBottom <= this.y + 20 &&
               zombie.x + zombie.width > this.x && zombie.x < this.x + this.width;
    }

    isOnRoad() {
        const obstacleBottom = this.y + this.height; 
        const edgeMargin = 300; 

        for (const road of roadSegments) {
            const roadBottom = roadY + 100; 

            const isWithinHorizontalBounds = (
                this.x + this.width - edgeMargin > road.x && 
                this.x + edgeMargin < road.x + road.width
            );

            const isAboveRoad = obstacleBottom >= roadY; 
            const isBelowRoad = obstacleBottom <= roadBottom; 

            if (isWithinHorizontalBounds && isAboveRoad && isBelowRoad) {
                return true; 
            }
        }
        return false;
    }

    checkNearGap() {
    
        for (const road of roadSegments) {
            
            const isWithinHorizontalBounds = (
                this.x < road.x + road.width &&
                this.x + this.width > road.x
            );
    
            if (isWithinHorizontalBounds && !this.isStatic) {
                const gapStart = road.x; 
                if (road.hasGap) {
                    const distanceToGapStart = gapStart - this.x;

                    if (distanceToGapStart < 50 && distanceToGapStart > -this.width + 50 && this.y!==150) { 
                        this.speed = speed; 
                    } 
                }
            }
        }
    }
    
    
    
}

export function spawnObstacles(ctx) {
    const obstacles =[];
    interval = setInterval(()=>{
        const isMoving = Math.random() > 0.5; 
    const obstacleType = isMoving 
        ? movingObstacleTypes[Math.floor(Math.random() * movingObstacleTypes.length)] 
        : staticObstacleTypes[Math.floor(Math.random() * staticObstacleTypes.length)];
    // const obstacleType = movingObstacleTypes[3];
    const obstacle = new Obstacle(
        ctx.canvas.width, 
        obstacleType.yPosition, 
        obstacleType.width, 
        obstacleType.height, 
        obstacleType.spritePaths, 
        isMoving ? obstacleType.speed : 0,
        obstacleType.isStatic
    );
    
    if (obstacleType.yPosition===150 || obstacle.isOnRoad()) {
        obstacles.push(obstacle);
    }
    },5000)
    
    return obstacles;
}

