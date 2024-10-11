import { zombie } from "./script.js";
import { obsroad } from "./obstacle.js";

const keys = {}; 

window.addEventListener('keydown', (event) => {
    keys[event.key] = true; 
});
window.addEventListener('keyup', (event) => {
    keys[event.key] = false; 
});

export function detectCollision() {
    const obstacleWidth = 200; 
    const obstacleHeight = 200;

    if (
        zombie.x < obsroad.obsX + obstacleWidth &&
        zombie.x + zombie.width > obsroad.obsX &&
        zombie.y < obsroad.obsY + obstacleHeight &&
        zombie.y + zombie.height > obsroad.obsY
    ) {
        motionAbovecar(); 
        return true; 
    }
    return true; 
}
function motionAbovecar() {
    if (keys['ArrowUp']) {
        zombie.y =zombie.y-15;
     
    } else {
        zombie.x -= 3; 
        if (zombie.x <= -200) {
            return; 
        }
    }
} 

