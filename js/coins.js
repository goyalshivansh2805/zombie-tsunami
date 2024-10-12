const CoinGame = {
    coinCount: 0,
    coinCountDisplay: null,
    addCoinBtn: null,
    canvas: null,
    ctx: null,
    spriteImage: null,
    spriteWidth: 32, // Adjust according to your sprite width
    spriteHeight: 32, // Adjust according to your sprite height
    coins: [],
}    
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
 export  function coins(){
        let coin= new Image();
        coin.src="../assets/coin.png";
        ctx.drawImage(coin,200+200,200,50,50);
        ctx.drawImage(coin,250+10,200,50,50);
        ctx.drawImage(coin,200,250+10,50,50);
        ctx.drawImage(coin,250+10,250+10,50,50);
        }
        obsroad.obsX -= bgObsSpeed; 
        if (obsroad.obsX <=-200) { 
            obsroad.obsX = canvas.width;
            index = Math.floor(Math.random() * 5); 


//     init() {
//         this.coinCountDisplay = document.getElementById('coinCount');
//         this.addCoinBtn = document.getElementById('addCoinBtn');
//         this.canvas = document.getElementById('gameCanvas');
//         this.ctx = this.canvas.getContext('2d');
//         this.spriteImage = new Image();
//         this.spriteImage.src = 'path/to/your/spritesheet.png'; // Update the path

//         this.addCoinBtn.addEventListener('click', () => this.addCoin());
//         this.spriteImage.onload = () => {
//             this.updateDisplay(); // Initialize display after the image loads
//         };
//     },

//     addCoin() {
//         this.coins.push({ x: Math.random() * (this.canvas.width - this.spriteWidth), y: Math.random() * (this.canvas.height - this.spriteHeight) });
//         this.coinCount++;
//         this.updateDisplay();
//     },

//     updateDisplay() {
//         this.coinCountDisplay.textContent = this.coinCount;
//         this.drawCoins();
//     },

//     drawCoins() {
//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
//         this.coins.forEach(coin => {
//             this.ctx.drawImage(this.spriteImage, 0, 0, this.spriteWidth, this.spriteHeight, coin.x, coin.y, this.spriteWidth, this.spriteHeight);
//         });
//     }


// // Initialize the game once the DOM is fully loaded
// document.addEventListener('DOMContentLoaded', () => {
//     CoinGame.init();
// });