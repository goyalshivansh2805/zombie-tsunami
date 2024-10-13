import { speed } from "./script.js";
import { roadSegments,roadY } from "./roads.js";

let interval;
class Human {
    constructor(x, y, width, height, imagePaths) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.images = imagePaths.map((path,index) => {
            const img = new Image();
            img.src = path;
            img.onerror = () => {
                console.error(`Error loading image: ${path}`);
                img.src = `../assets/humans/sprites${index+1}/1.png`;
            };
            return img;
        });
        this.help = new Image();
        this.help.src = "../assets/humans/help.png";
        this.currentImage = this.images[0];
        this.frameCount = 10;
        this.currentFrame = 0;
    }

    draw(ctx) {
        // console.log(this.currentImage);
        if(speed === 0){
            clearInterval(interval);
        }
        this.frameCount--;
        if (this.frameCount === 0) {
            this.currentImage = this.currentImage === this.images[0] ? this.images[1] : this.images[0];
            this.frameCount = 10;
        }
        ctx.drawImage(this.help, this.x-50, this.y - 100, this.width, this.height);
        ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
    }

    checkCollision(zombie) {
        return (
            this.x < zombie.x + zombie.width &&
            this.x + this.width > zombie.x &&
            this.y < zombie.y + zombie.height &&
            this.y + this.height > zombie.y
        );
    }

    update(){
        this.x -= speed;
    }
}

export function spawnHumans(ctx) {
    const humans = [];
    const humanTypes = [
        ["../assets/humans/sprites1/1.png", "../assets/humans/sprites2/1.png"],
        ["../assets/humans/sprites1/2.png", "../assets/humans/sprites2/2.png"],
        ["../assets/humans/sprites1/3.png", "../assets/humans/sprites2/3.png"],
    ];
    let randomTime = Math.floor(Math.random() * 10) +5 ; //randomtime
    interval = setInterval(() => {
        const x = ctx.canvas.width + Math.random() * 100;
        let randomIndex = Math.floor(Math.random() * humanTypes.length);
        let newHuman = new Human(x, 280, 140, 140, humanTypes[randomIndex]);
        if (isOnRoad(newHuman)) {
            humans.push(newHuman);
        }
    }, randomTime * 1000); 


    return humans;
}

function isOnRoad(human) {
    const humanBottom = human.y + human.height;
    const edgeMargin = 100;

    for (const road of roadSegments) {
        const roadBottom = roadY + 100;

        const isWithinHorizontalBounds = (
            human.x + human.width - edgeMargin > road.x && 
            human.x + edgeMargin < road.x + road.width
        );

        const isAboveRoad = humanBottom >= roadY;
        const isBelowRoad = humanBottom <= roadBottom;

        if (isWithinHorizontalBounds && isAboveRoad && isBelowRoad) {
            return true; 
        }
    }
    return false; 
}
