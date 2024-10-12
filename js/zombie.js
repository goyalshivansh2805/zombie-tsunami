import {roadSegments,roadY} from "./roads.js";
import { speed } from "./script.js";

let zombieYVelocity = 1;
const eatingImages = ["../assets/zombies/zombieEating/1.png", "../assets/zombies/zombieEating/2.png"];
class Zombie {
    constructor(x, y, width, height, image1Path,image2Path) {
        this.zombieOffset = Math.floor(Math.random() * (45-10)) +10;
        this.x = x;
        this.y = y - this.zombieOffset;
        this.frameCount = 10;
        this.initialX = x;
        this.width = width;
        this.height = height;
        this.image1 = new Image();
        this.image1.src = image1Path;
        this.image1.onerror = () => {
            console.error(`Error loading image: ${image1Path}`);
            this.image1.src = `../assets/zombies/sprites1/1.png`;
        };
        this.currentImage = this.image1;
        this.image2 = new Image();
        this.image2.src = image2Path;
        this.image2.onerror = () => {
            console.error(`Error loading image: ${image2Path}`);
            this.image2.src = `../assets/zombies/sprites2/1.png`;
        };

        this.eatingImages = eatingImages.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });

        this.eating = false;
        this.eatingFrame = 0;
        this.eatingFrameCount = 5; 
        this.dy = 0;
        this.dx = 0;
        this.jumping = false;
    }

    draw(ctx) {
        ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.height);

        if (this.eating) {
            const eatingImage = this.eatingImages[Math.floor(this.eatingFrame / this.eatingFrameCount) % this.eatingImages.length];
            ctx.drawImage(eatingImage, this.x, this.y, this.width, this.height); // Draw on top of the zombie
            this.eatingFrame++;
        } else {
            this.frameCount--;
            if (this.frameCount === 0) {
                this.currentImage = this.currentImage === this.image1 ? this.image2 : this.image1;
                this.frameCount = 10;
            }
        }
    }

    jump() {
        if (!this.jumping) {
        this.jumping = true;
        this.dy = -20; 
        }
    }

    startEating() {
        this.eating = true;
        this.eatingFrame = 0;
    }

    stopEating() {
        this.eating = false;
    }

    // update() {
    //     this.y += this.dy;
    //     this.x += this.dx;
    //     if (this.y + this.height < roadY+ this.zombieOffset|| this.checkIfOnGap()) {
    //     this.dy += zombieYVelocity;
    //     } else {
    //     this.y = roadY - this.height+this.zombieOffset; 
    //     this.dy = 0;
    //     this.jumping = false;
    //     }


    //     if (this.x < this.initialX) {
    //     this.dx = 3; 
    //     } else {
    //     this.dx = 0; 
    //     }
    // }

    // update(obstacles) {
    //     this.y += this.dy;
    //     this.x += this.dx;
    
    //     let onTopOfObstacle = false;
    
    //     for (const obstacle of obstacles) {
    //         if (!this.jumping && obstacle.checkCollision(this)) {
    //             console.log("hit");
    //             if(this.y + this.height < obstacle.y + obstacle.height){
    //                 if(obstacle.isStatic){
    //                     this.x -=  speed; 
    //                 }else{
    //                     this.x -= obstacle.speed; 
    //                 }
    //             }
    //             return;
    //         }
    //         if (this.jumping && obstacle.isStatic && obstacle.isOnTop(this)) {
    //             this.y = obstacle.y - this.height + this.zombieOffset; 
    //             this.dy = 0;
    //             this.jumping = false; 
    //             onTopOfObstacle = true; 
    //         }
    //     }
    //     if (!onTopOfObstacle && (this.y + this.height < roadY + this.zombieOffset || this.checkIfOnGap())) {
    //         this.dy += zombieYVelocity; 
    //     } else if (!onTopOfObstacle) {
    //         this.y = roadY - this.height + this.zombieOffset; 
    //         this.dy = 0; 
    //         this.jumping = false; 
    //     }
    
    //     if (this.x < this.initialX) {
    //         this.dx = 3; 
    //     } else {
    //         this.dx = 0; 
    //     }
    // }

    update(obstacles) {
        this.y += this.dy; // Apply vertical velocity
        this.x += this.dx; // Apply horizontal velocity
    
        let onTopOfObstacle = false;
    
        for (const obstacle of obstacles) {

            // Check for collision with any obstacle (static or moving)
            if (this.y + this.height <= obstacle.y && this.y + this.height + this.dy >= obstacle.y) {
                // Zombie is falling or jumping and will land on top of the obstacle
                if (this.x + this.width > obstacle.x && this.x < obstacle.x + obstacle.width) {
                    // Zombie lands on top of the obstacle
                    this.y = obstacle.y - this.height ; // Set the zombie on top of the obstacle
                    this.dy = 0; // Stop downward movement
                    this.jumping = false; // Reset jumping status
                    onTopOfObstacle = true; // Zombie is on top of an obstacle
    
                    // If the obstacle is moving, move the zombie along with the obstacle
                    if (!obstacle.isStatic) {
                        this.x += obstacle.speed; // Move zombie with the moving obstacle
                    }else{
                        this.x -= speed;
                    }
                }
            }
            if (!this.jumping && obstacle.checkCollision(this)) {
                console.log("hit");
                if(this.y + this.height < obstacle.y + obstacle.height){
                    if(obstacle.isStatic){
                        this.x -=  speed; 
                    }else{
                        this.x -= obstacle.speed; 
                    }
                }
                return;
            }
        }
    
        // If the zombie is not on any obstacle, apply gravity or keep on the road
        if (!onTopOfObstacle && (this.y + this.height < roadY + this.zombieOffset || this.checkIfOnGap())) {
            this.dy += zombieYVelocity; // Apply gravity to the zombie if not on an obstacle
        } else if (!onTopOfObstacle) {
            // If no obstacle, the zombie is on the road
            this.y = roadY - this.height + this.zombieOffset;
            this.dy = 0; // Stop falling
            this.jumping = false; // Reset jumping status
        }
    
        // Move zombie to the right if it's been pushed left by an obstacle collision
        if (this.x < this.initialX) {
            this.dx = 3;
        } else {
            this.dx = 0;
        }
    }
    
    


    checkIfOnGap() {
        const zombieBottom = this.y + this.height; 
        const edgeMargin = 25; 
        for (const road of roadSegments) {
            if (this.x + this.width - edgeMargin > road.x && this.x < road.x + road.width - edgeMargin) {
                if (zombieBottom >= roadY && zombieBottom <= roadY + 100) {
                    return false; 
                }
                return true; 
            }
        }
        return true; 
    }

    checkIsFalling(obstacles) {
        // Check if the zombie is on a gap (not on the road) and not jumping
        const onGap = this.checkIfOnGap();
        
        // Check if the zombie is below the road level
        const belowRoad = this.y + this.height > roadY + this.zombieOffset;
    
        // Check if the zombie is on top of any obstacle
        let onTopOfObstacle = false;
        for (const obstacle of obstacles) {
            if (obstacle.isOnTop(this)) {
                onTopOfObstacle = true;
                break; // Once on top of an obstacle, we don't need to check further
            }
        }
    
        // Zombie is falling if it's on a gap and not on an obstacle, or if it's below the road
        return (onGap && !this.jumping && !onTopOfObstacle) || (belowRoad && !onTopOfObstacle);
    }
    
    fall(){
        this.dy += 10;
    }
}

export default Zombie;