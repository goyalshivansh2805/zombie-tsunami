import {roadSegments,roadY} from "./roads.js";

let zombieYVelocity = 1;
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
        this.currentImage = this.image1;
        this.image2 = new Image();
        this.image2.src = image2Path;
        this.dy = 0;
        this.dx = 0;
        this.jumping = false;
    }

    draw(ctx) {
        this.frameCount--;
        if (this.frameCount === 0) {
            this.currentImage = this.currentImage === this.image1 ? this.image2 : this.image1;
            this.frameCount = 10;
        }
        ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
    }

    jump() {
        if (!this.jumping) {
        this.jumping = true;
        this.dy = -20; 
        }
    }

    update() {
        this.y += this.dy;
        this.x += this.dx;
        if (this.y + this.height < roadY+ this.zombieOffset|| this.checkIfOnGap()) {
        this.dy += zombieYVelocity;
        } else {
        this.y = roadY - this.height+this.zombieOffset; 
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

    checkIsFalling(){
        return this.checkIfOnGap() && !this.jumping || this.y + this.height > roadY + this.zombieOffset;
    }

    fall(){
        this.dy += 10;
    }
}

export default Zombie;