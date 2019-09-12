class Monster{

  constructor(size,color,x,y,vx,vy){
    this.size = size;
    this.color = color;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  draw(ctx){

    ctx.save();

    ctx.translate(this.x,this.y);

    ctx.beginPath();
    ctx.rect(-this.size/2,-this.size/2, this.size,this.size);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    ctx.restore();

    this.x+=this.vx;
    this.y+=this.vy;

  }

}