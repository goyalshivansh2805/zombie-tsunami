import { speed } from "./script.js";

//loading images of roads in a array
const roads = [];
for (let i = 1; i <= 5; i++) {
    const road = new Image();
    road.src = `../assets/roads/${i}.png`;  
    roads.push(road);
}
  // roadsegments
let roadSegments=[];
let gapWidth = Math.floor(Math.random() * 30) + 100;
let numRoads = 5;
export let roadY = 380;

function getRandomRoad() {
  return roads[Math.floor(Math.random() * roads.length)];
}
//initializing segments of random roads 
function initializeRoads(canvas,ctx) {
    let x = 0;
    for (let i = 0; i < numRoads; i++) {
      let randomRoad = getRandomRoad();
      roadSegments.push({
        x: x,
        image: randomRoad,
        width: randomRoad.naturalWidth || canvas.width, 
        hasGap: true
      });
      x += roadSegments[i].width + gapWidth;  //next road image appearing after certain gap
    }
  }
  

function drawRoads(canvas,ctx) {
  for (let i = 0; i < roads.length; i++) {
    const road = roadSegments[i];
    ctx.drawImage(road.image, road.x, roadY, road.width, 200);
    road.x -= speed;

    if (road.x + road.width <= 0) {  
      gapWidth = Math.floor(Math.random() * 30) + 100;
      let newRoad = getRandomRoad();  
      road.x = roadSegments[(i + roadSegments.length - 1) % roadSegments.length].x + 
                roadSegments[(i + roadSegments.length - 1) % roadSegments.length].width + gapWidth;  
      road.image = newRoad;
      road.width = newRoad.naturalWidth || canvas.width;
    }
  }
}

export {
  initializeRoads,
  drawRoads,
  roadSegments
};
