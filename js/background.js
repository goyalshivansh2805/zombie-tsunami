const backgroundCity = new Image();
backgroundCity.src = '../assets/background/city/background.png';  
const backgroundBeach = new Image();
backgroundBeach.src = '../assets/background/beach/background.png';
const backgroundCloud = new Image();
backgroundCloud.src = '../assets/background/backgroundCloud.png';  
const backgroundTreesCity1 = new Image();
backgroundTreesCity1.src = '../assets/background/city/backgroundTrees1.png';  
const backgroundTreesCity2 = new Image();
backgroundTreesCity2.src = '../assets/background/city/backgroundTrees2.png';  
const backgroundTreesBeach1 = new Image();
backgroundTreesBeach1.src = '../assets/background/beach/backgroundTrees1.png'; 
const backgroundTreesBeach2 = new Image();
backgroundTreesBeach2.src = '../assets/background/beach/backgroundTrees2.png'; 

let currentBackground = backgroundCity;
let nextBackground = backgroundCity;
let minBgChangeTime = 120;
let maxBgChangeTime = 150;
export let timeUntilSwitch = getRandomTime(minBgChangeTime, maxBgChangeTime); 
export let bgX = 0; 
export let nextBgX = 1200;
let cityTrees1Y = 250;
let cityTrees2Y = 350;
let beachTrees1Y = 250;
let beachTrees2Y = 300;
let trees1Height = 200;
let beachTrees2Height = 400;

function getRandomTime(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  

  
  function drawUpperTrees(canvas,ctx) {
  if (currentBackground === nextBackground) {
    if (currentBackground === backgroundCity) {
      ctx.drawImage(backgroundTreesCity1, bgX, cityTrees1Y, canvas.width, trees1Height); 
      ctx.drawImage(backgroundTreesCity1, nextBgX, cityTrees1Y, canvas.width, trees1Height);
    } else {
      ctx.drawImage(backgroundTreesBeach1, bgX, beachTrees1Y, canvas.width, trees1Height); 
      ctx.drawImage(backgroundTreesBeach1, nextBgX, beachTrees1Y, canvas.width, trees1Height);
    }
  } else {
    if (currentBackground === backgroundCity) {
        ctx.drawImage(backgroundTreesCity1, bgX, cityTrees1Y, canvas.width, trees1Height); 
      ctx.drawImage(backgroundTreesBeach1, nextBgX, beachTrees1Y, canvas.width, trees1Height);
    } else {
        ctx.drawImage(backgroundTreesBeach1, bgX, beachTrees1Y, canvas.width, trees1Height); 
        ctx.drawImage(backgroundTreesCity1, nextBgX, cityTrees1Y, canvas.width, trees1Height);
    }
}
}

function drawLowerTrees(canvas, ctx) {
  if (currentBackground === nextBackground) {
    if (currentBackground === backgroundCity) {
      ctx.drawImage(backgroundTreesCity2, bgX, cityTrees2Y, canvas.width, beachTrees2Height);
      ctx.drawImage(backgroundTreesCity2, nextBgX, cityTrees2Y, canvas.width, beachTrees2Height);
    } else {
      ctx.drawImage(backgroundTreesBeach2, bgX, beachTrees2Y, canvas.width, beachTrees2Height);
      ctx.drawImage(backgroundTreesBeach2, nextBgX, beachTrees2Y, canvas.width, beachTrees2Height);
    }
  } else {
      if (currentBackground === backgroundCity) {
          ctx.drawImage(backgroundTreesCity2, bgX, cityTrees2Y, canvas.width, beachTrees2Height);
          ctx.drawImage(backgroundTreesBeach2, nextBgX, beachTrees2Y, canvas.width, beachTrees2Height);
        } else {
            ctx.drawImage(backgroundTreesBeach2, bgX, beachTrees2Y, canvas.width, beachTrees2Height);
            ctx.drawImage(backgroundTreesCity2, nextBgX, cityTrees2Y, canvas.width, beachTrees2Height);
        }
    }
}

function drawBackground(canvas, ctx) {
  ctx.drawImage(currentBackground, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(currentBackground, bgX + canvas.width, 0, canvas.width, canvas.height);
  ctx.drawImage(nextBackground, nextBgX, 0, canvas.width, canvas.height);
  ctx.drawImage(nextBackground, nextBgX + canvas.width, 0, canvas.width, canvas.height);
}


function changeBackground(canvas) {
  setTimeout(()=>{  //changing background between city and beach and calling change background after cetain time 
    currentBackground = nextBackground;
    nextBackground = currentBackground === backgroundCity ? backgroundBeach : backgroundCity;
    nextBgX = canvas.width+100;
    timeUntilSwitch = getRandomTime(minBgChangeTime, maxBgChangeTime);
    changeBackground(canvas);
  }, timeUntilSwitch*1000);
}

export function setBgX(value) {
    bgX = value;
  }
  
  export function setNextBgX(value) {
    nextBgX = value;
  }


function checkBackgroundAndRoads(canvas, ctx) {
  if (bgX <= -canvas.width) {
    bgX = 0;
    currentBackground = nextBackground; 
    nextBgX = canvas.width;
  }
}

function drawCloud(canvas,ctx){
    ctx.drawImage(backgroundCloud, bgX, 0, canvas.width, 200);
    ctx.drawImage(backgroundCloud, bgX + canvas.width, 0, canvas.width, 200);
}

export {
  drawBackground,
  drawUpperTrees,
  drawLowerTrees,
  changeBackground,
  checkBackgroundAndRoads,
  drawCloud,
};
