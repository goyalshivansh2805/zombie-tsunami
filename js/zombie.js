import {roadSegments,roadY} from "./roads.js";
import { speed} from "./script.js";

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
        this.speed = 0;  
        this.jumpHeight = 20;
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
        if(this.jumpHeight<=25){
            this.dy = -this.jumpHeight; 
        }else{
            this.dy = -25;
        }
        }
    }

    startEating() {
        this.eating = true;
        this.eatingFrame = 0;
    }

    stopEating() {
        this.eating = false;
    }


    update(obstacles) {
        this.y += this.dy;
        this.x +=this.dx;
        // console.log(this.speed)
        if(this.x <= 300){
            this.x +=  this.speed;
        }
        // console.log(this.speed)
        if (this.speed === 0 && this.x > 200) {
            this.x -=  speed; 
        }
    
    
        let onTopOfObstacle = false;
    
        for (const obstacle of obstacles) {
            if (this.y + this.height <= obstacle.y && this.y + this.height + this.dy >= obstacle.y) {
                if (this.x + this.width > obstacle.x && this.x < obstacle.x + obstacle.width) {
                    this.y = obstacle.y - this.height ;
                    this.dy = 0; 
                    this.jumping = false; 
                    onTopOfObstacle = true;
    
                    if (!obstacle.isStatic) {
                        this.x -= obstacle.speed; 
                    }else{
                        this.x -= speed;
                    }
                    this.x-=this.speed;
                }
            }
            if (!this.jumping && obstacle.checkCollision(this)) {
                console.log("hit");
                this.x -= (obstacle.isStatic ? speed : obstacle.speed); 
                return;
            }
        }
    
        if (!onTopOfObstacle && (this.y + this.height < roadY + this.zombieOffset || this.checkIfOnGap())) {
            this.dy += zombieYVelocity; 
        } else if (!onTopOfObstacle) {
            this.y = roadY - this.height + this.zombieOffset;
            this.dy = 0; 
            this.jumping = false; 
        }

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
        const onGap = this.checkIfOnGap();
        const belowRoad = this.y + this.height > roadY + this.zombieOffset;
        let onTopOfObstacle = false;
        for (const obstacle of obstacles) {
            if (obstacle.isOnTop(this)) {
                onTopOfObstacle = true;
                break; 
            }
        }

        return (onGap && !this.jumping && !onTopOfObstacle) || (belowRoad && !onTopOfObstacle);
    }
    
    fall(){
        this.dy += 10;
    }
}

export default Zombie;