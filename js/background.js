class BackgroundManager {
  constructor(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.backgroundCity = this.loadImage('../assets/background/city/background.png');
      this.backgroundBeach = this.loadImage('../assets/background/beach/background.png');
      this.backgroundCloud = this.loadImage('../assets/background/backgroundCloud.png');
      this.backgroundTreesCity1 = this.loadImage('../assets/background/city/backgroundTrees1.png');
      this.backgroundTreesCity2 = this.loadImage('../assets/background/city/backgroundTrees2.png');
      this.backgroundTreesBeach1 = this.loadImage('../assets/background/beach/backgroundTrees1.png');
      this.backgroundTreesBeach2 = this.loadImage('../assets/background/beach/backgroundTrees2.png');
      this.currentBackground = this.backgroundCity;
      this.nextBackground = this.backgroundCity;
      this.bgX = 0;
      this.nextBgX = this.canvas.width; 
      this.minBgChangeTime = 150;
      this.maxBgChangeTime = 180
      this.timeUntilSwitch = this.getRandomTime(this.minBgChangeTime, this.maxBgChangeTime);
      this.cityTrees1Y = 250;
      this.cityTrees2Y = 350;
      this.beachTrees1Y = 250;
      this.beachTrees2Y = 300;
      this.trees1Height = 200;
      this.beachTrees2Height = 400;
      this.speed = 5;
      this.changeBackground();
  }

  loadImage(src) {
      const img = new Image();
      img.src = src;
      return img;
  }

  getRandomTime(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
  }


  drawBackground() {

      this.ctx.drawImage(this.currentBackground, this.bgX, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.currentBackground, this.bgX + this.canvas.width, 0, this.canvas.width, this.canvas.height);

      this.ctx.drawImage(this.nextBackground, this.nextBgX, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.nextBackground, this.nextBgX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
  }

  drawUpperTrees() {
      if (this.currentBackground === this.nextBackground) {
          if (this.currentBackground === this.backgroundCity) {
              this.ctx.drawImage(this.backgroundTreesCity1, this.bgX, this.cityTrees1Y, this.canvas.width, this.trees1Height);
              this.ctx.drawImage(this.backgroundTreesCity1, this.nextBgX, this.cityTrees1Y, this.canvas.width, this.trees1Height);
          } else {
              this.ctx.drawImage(this.backgroundTreesBeach1, this.bgX, this.beachTrees1Y, this.canvas.width, this.trees1Height);
              this.ctx.drawImage(this.backgroundTreesBeach1, this.nextBgX, this.beachTrees1Y, this.canvas.width, this.trees1Height);
          }
      } else {
          if (this.currentBackground === this.backgroundCity) {
              this.ctx.drawImage(this.backgroundTreesCity1, this.bgX, this.cityTrees1Y, this.canvas.width, this.trees1Height);
              this.ctx.drawImage(this.backgroundTreesBeach1, this.nextBgX, this.beachTrees1Y, this.canvas.width, this.trees1Height);
          } else {
              this.ctx.drawImage(this.backgroundTreesBeach1, this.bgX, this.beachTrees1Y, this.canvas.width, this.trees1Height);
              this.ctx.drawImage(this.backgroundTreesCity1, this.nextBgX, this.cityTrees1Y, this.canvas.width, this.trees1Height);
          }
      }
  }
  drawLowerTrees() {
      if (this.currentBackground === this.nextBackground) {
          if (this.currentBackground === this.backgroundCity) {
              this.ctx.drawImage(this.backgroundTreesCity2, this.bgX, this.cityTrees2Y, this.canvas.width, this.beachTrees2Height);
              this.ctx.drawImage(this.backgroundTreesCity2, this.nextBgX, this.cityTrees2Y, this.canvas.width, this.beachTrees2Height);
          } else {
              this.ctx.drawImage(this.backgroundTreesBeach2, this.bgX, this.beachTrees2Y, this.canvas.width, this.beachTrees2Height);
              this.ctx.drawImage(this.backgroundTreesBeach2, this.nextBgX, this.beachTrees2Y, this.canvas.width, this.beachTrees2Height);
          }
      } else {
          if (this.currentBackground === this.backgroundCity) {
              this.ctx.drawImage(this.backgroundTreesCity2, this.bgX, this.cityTrees2Y, this.canvas.width, this.beachTrees2Height);
              this.ctx.drawImage(this.backgroundTreesBeach2, this.nextBgX, this.beachTrees2Y, this.canvas.width, this.beachTrees2Height);
          } else {
              this.ctx.drawImage(this.backgroundTreesBeach2, this.bgX, this.beachTrees2Y, this.canvas.width, this.beachTrees2Height);
              this.ctx.drawImage(this.backgroundTreesCity2, this.nextBgX, this.cityTrees2Y, this.canvas.width, this.beachTrees2Height);
          }
      }
  }

  drawCloud() {
      this.ctx.drawImage(this.backgroundCloud, this.bgX, 0, this.canvas.width, 200);
      this.ctx.drawImage(this.backgroundCloud, this.bgX + this.canvas.width, 0, this.canvas.width, 200);
  }

  checkBackgroundAndRoads() {
      if (this.bgX <= -this.canvas.width) {
          this.bgX = 0;
          this.currentBackground = this.nextBackground;
          this.nextBgX = this.canvas.width;
      }
  }

  changeBackground() {
      setTimeout(() => {
          
          this.nextBackground = this.currentBackground === this.backgroundCity ? this.backgroundBeach : this.backgroundCity;
          this.nextBgX = this.canvas.width;
          this.timeUntilSwitch = this.getRandomTime(this.minBgChangeTime, this.maxBgChangeTime);
          this.changeBackground(); 
      }, this.timeUntilSwitch * 1000);
  }

  updateBackground(speed) {
      this.bgX -= speed;
      this.nextBgX -= speed;
      this.checkBackgroundAndRoads();
  }
}

export default BackgroundManager;
