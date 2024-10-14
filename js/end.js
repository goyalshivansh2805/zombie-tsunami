let canvas1=document.getElementById("gameover");
let context=canvas1.getcontext("2d");
let score=new Image();
score.src="../assets/score.png";
export function gameover(){
     ctx.drawImage(score,0,0,200,300);
}