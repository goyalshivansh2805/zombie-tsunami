import { speed} from "./script.js";
import { roadY,roadSegments } from "./roads.js";
import { addZombie } from "./script.js";

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
        height: 150, 
        speed: 7, 
        yPosition: 100 
    }
];


const staticObstacleTypes = [
    { 
        spritePaths: ["../assets/obstacles/carsWithHumans/1.png", "../assets/obstacles/carsWithHumans/2.png"], 
        width: 150, 
        height: 150, 
        isStatic: true,
        yPosition: roadY - 90,
        requiredZombiesToDestroy: 3, 
        zombiesToSpawn: 1,
        zombieCountImages: ["../assets/zombieCount/cars/0.png", "../assets/zombieCount/cars/1.png", "../assets/zombieCount/cars/2.png","../assets/zombieCount/cars/3.png"]         
    },
    { 
        spritePaths: ["../assets/obstacles/dustbin.png"], 
        width: 170, 
        height: 170, 
        isStatic: true,
        yPosition: roadY-120,
        requiredZombiesToDestroy: Infinity, 
        zombiesToSpawn: 0
    },
    { 
        spritePaths: ["../assets/obstacles/tanks/1.png", "../assets/obstacles/tanks/2.png"], 
        width: 200, 
        height: 200, 
        isStatic: true,
        yPosition: roadY - 150,
        requiredZombiesToDestroy: 7,  
        zombiesToSpawn: 2,
        zombieCountImages: ["../assets/zombieCount/tank/0.png","../assets/zombieCount/tank/1.png","../assets/zombieCount/tank/2.png","../assets/zombieCount/tank/3.png","../assets/zombieCount/tank/4.png","../assets/zombieCount/tank/5.png","../assets/zombieCount/tank/6.png","../assets/zombieCount/tank/7.png",]                      
    },
    { 
        spritePaths: ["../assets/obstacles/phoneBooth/1.png", "../assets/obstacles/phoneBooth/2.png"], 
        width: 150, 
        height: 150, 
        isStatic: true,
        yPosition: roadY - 100,
        requiredZombiesToDestroy: 2,  
        zombiesToSpawn: 1,
        zombieCountImages: ["../assets/zombieCount/phoneBooth/0.png", "../assets/zombieCount/phoneBooth/1.png", "../assets/zombieCount/phoneBooth/2.png"]               
    }
];



let interval;
export class Obstacle {
    constructor(x, y, width, height, spritePaths, speed = 0, isStatic = false, requiredZombiesToDestroy = Infinity, zombiesToSpawn = 0,zombieCountImages) {
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
        this.isDestroyed = false;
        this.requiredZombiesToDestroy = requiredZombiesToDestroy;
        this.zombiesToSpawn = zombiesToSpawn;
        this.collidingZombies = new Set();  
        this.zombieCountImages = this.requiredZombiesToDestroy !== Infinity?zombieCountImages.map(path => {
            let img = new Image();
            img.src = path;
            return img;
        }) : null;
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
        if(this.requiredZombiesToDestroy !== Infinity && this.requiredZombiesToDestroy !== 0){

            ctx.drawImage(this.zombieCountImages[this.collidingZombies.size], this.x -70, this.y - 70, 150, 150);
        }
        ctx.drawImage(this.sprites[this.currentSpriteIndex], this.x, this.y, this.width, this.height);
    }

    update() {
        if(this.speed === 7){
            this.x -= this.speed;
            return;
        }
        this.checkNearGap();
        if (this.isStatic || this.nearGap){
            this.x -= speed;
        }else{
            this.x -= this.speed;
        }
    }

    checkCollision(zombie) {
        const isColliding = zombie.x < this.x + this.width &&
               zombie.x + zombie.width > this.x &&
               zombie.y < this.y + this.height &&
               zombie.y + zombie.height > this.y;

        if (isColliding && !this.collidingZombies.has(zombie)) {
            this.collidingZombies.add(zombie);
            console.log(this.collidingZombies)
        } else if (!isColliding && this.collidingZombies.has(zombie)) {
            this.collidingZombies.delete(zombie);
        }

        return isColliding;
    }

    checkDestruction() {
        if (this.collidingZombies.size >= this.requiredZombiesToDestroy) {
            // console.log("h")
            return true;
            
        }
        return false;
    }

    destroy(obstacles) {
        if (this.checkDestruction()) {
            for (let i = 0; i < this.zombiesToSpawn; i++) {
                addZombie([...this.collidingZombies][0]); 
            }

            const index = obstacles.indexOf(this);
            if (index > -1) {
                obstacles.splice(index, 1);
            }
        }
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
    // const obstacleType = isMoving 
    //     ? movingObstacleTypes[Math.floor(Math.random() * movingObstacleTypes.length)] 
    //     : staticObstacleTypes[Math.floor(Math.random() * staticObstacleTypes.length)];
    const obstacleType = staticObstacleTypes[2];
    // const obstacleType = movingObstacleTypes[2];
    const obstacle = new Obstacle(
        ctx.canvas.width, 
        obstacleType.yPosition, 
        obstacleType.width, 
        obstacleType.height,
        obstacleType.spritePaths, 
        isMoving ? obstacleType.speed : 0,
        obstacleType.isStatic,
        obstacleType.requiredZombiesToDestroy,
        obstacleType.zombiesToSpawn,
        obstacleType.zombieCountImages
    );
    
    if (obstacleType.yPosition===100 || obstacle.isOnRoad()) {
        obstacles.push(obstacle);
    }
    },9321)
    
    return obstacles;
}

