import { roadY } from "./roads.js";
import { speed } from "./script.js";

let interval;
class Coin {
    constructor(x, y, width, height, imagePath) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imagePath;
        this.collected = false;
    }

    draw(ctx) {
        if(speed===0){
            clearInterval(interval);
        }
        if (!this.collected) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    update() {
        if (!this.collected) {
            this.x -= speed; 
        }
    }

    checkCollision(zombie) {
        if (!this.collected) {
            const zombieRight = zombie.x + zombie.width;
            const zombieBottom = zombie.y + zombie.height;

            const coinRight = this.x + this.width;
            const coinBottom = this.y + this.height;

            if (zombie.x < coinRight &&
                zombieRight > this.x &&
                zombie.y < coinBottom &&
                zombieBottom > this.y) {
                this.collected = true;
                return true;
            }
        }
        return false;
    }
}
export function spawnCoins(ctx) {
    const coins = [];
    let randomTime = Math.floor(Math.random() * 10) + 3; 
    interval = setInterval(() => {
        const coinWidth = 50;
        const coinHeight = 50;
        const randomX = ctx.canvas.width + Math.random() * 100; 
        const randomY = roadY-70;
        const newCoin = new Coin(randomX, randomY, coinWidth, coinHeight, "../assets/coin.png");
        coins.push(newCoin);
        randomTime = Math.floor(Math.random() * 10) + 3; 
    }, randomTime * 927); 

    return coins;
}
