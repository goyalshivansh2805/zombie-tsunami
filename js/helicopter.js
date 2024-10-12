let helicopter=new Image();
helicopter.src='../assets/obstacles/helicoper/1.png';
let air={
    x:500,
    y:200,
    l:256
}
export function heli(){
    ctx.drawImage(helicopter,0,0,256,256,air.x,air.y, 200, 200);
}