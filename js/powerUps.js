import { speed } from "./script.js";
import { roadY } from "./roads.js";

const powerUpTypes = [
    {
        name: "speedBoost",
        spritePath: "../assets/powerUps/speedBoost.png",
        width: 80,
        height: 80,
        boostDuration: 5000, 
        effect: (zombies) => {
            zombies.forEach(zombie => {
                zombie.speed += 2; 
            });
        },
        resetEffect: (zombies) => {
            zombies.forEach(zombie => {
                zombie.speed -= 2; 
            });
        }
    },
    {
        name: "jumpBoost",
        spritePath: "../assets/powerUps/jumpBoost.png",
        width: 80,
        height: 80,
        boostDuration: 5000, 
        effect: (zombies) => {
            zombies.forEach(zombie => {
                console.log(zombie.jumpHeight);
                zombie.jumpHeight += 5; 
                console.log(zombie.jumpHeight);
            });
        },
        resetEffect: (zombies) => {
            zombies.forEach(zombie => {
                zombie.jumpHeight -= 5;
            });
        }
    },
];


export class PowerUp {
    constructor(x, y, width, height, spritePath, effect, resetEffect, boostDuration) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = new Image();
        this.sprite.src = spritePath;
        this.effect = effect;
        this.resetEffect = resetEffect;
        this.boostDuration = boostDuration;
        this.active = true;
    }

    draw(ctx) {
        if (this.active) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
    }

    update() {
        this.x -= speed; 
    }

    checkCollision(zombie) {
        return zombie.x < this.x + this.width &&
               zombie.x + zombie.width > this.x &&
               zombie.y < this.y + this.height &&
               zombie.y + zombie.height > this.y;
    }

    applyEffect(zombies, powerUps) {
        this.effect(zombies);
        setTimeout(() => {
            this.resetEffect(zombies);
        }, this.boostDuration);

        this.active = false;

        const index = powerUps.indexOf(this);
        if (index > -1) {
            powerUps.splice(index, 1);
        }
    }
}

export function spawnPowerUps(ctx) {
    const powerUps = [];

    setInterval(() => {
        // const powerUpType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        const powerUpType = powerUpTypes[0];
        const powerUp = new PowerUp(
            ctx.canvas.width, 
            roadY - 250, 
            powerUpType.width,
            powerUpType.height,
            powerUpType.spritePath,
            powerUpType.effect,
            powerUpType.resetEffect,
            powerUpType.boostDuration
        );
        powerUps.push(powerUp);
    }, 11292); 

    return powerUps;
}

export function updatePowerUps(ctx, powerUps, zombies) {
    powerUps.forEach((powerUp) => {
        powerUp.update();
        powerUp.draw(ctx);

        zombies.forEach((zombie) => {
            if (powerUp.checkCollision(zombie)) {
                powerUp.applyEffect(zombies, powerUps);
            }
        });
    });
}
