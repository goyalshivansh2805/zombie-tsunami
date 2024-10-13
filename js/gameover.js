const totalCoins = sessionStorage.getItem("totalCoins")||0;
const score = sessionStorage.getItem("score")||0;
const zombies = sessionStorage.getItem("zombies") || 0;

const scoreDiv = document.getElementById("totalscore");
const coinDiv = document.getElementById("totalcoins");
const zombieDiv = document.getElementById("zombies");

scoreDiv.innerHTML = score;
coinDiv.innerHTML = totalCoins;
zombieDiv.innerHTML = zombies;
