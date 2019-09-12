class Player {

  constructor(width,height,color,x,y){
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
  }

  setAngle(angle){
    this.angle = angle;
  }

  draw(ctx, gameStarted, animating){
    ctx.save();

    ctx.translate(this.x,this.y);
    ctx.rotate(this.angle);

    if(gameStarted){
      ctx.beginPath();
      ctx.lineTo(0,0);
      ctx.lineTo(0,-1000);
      ctx.strokeStyle='red';
      ctx.stroke();
      ctx.closePath();
    }
    
    ctx.beginPath();
    ctx.lineTo(-(this.width/2),(this.height/2));
    ctx.lineTo((this.width/2),(this.height/2));
    ctx.lineTo(0,-(this.height));
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.closePath();

    ctx.restore();

  }

}

class Bullet{

  constructor(x,y,vx,vy){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  draw(ctx){
    ctx.save();

    ctx.translate(this.x,this.y);

    ctx.beginPath();
    ctx.arc(0,0,35,0,Math.PI*2);
    ctx.fillStyle = '#F9E4B7';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0,0,5,0,Math.PI*2);
    ctx.fillStyle = 'blue';
    ctx.fill();

    ctx.restore();
    this.x+=this.vx;
    this.y+=this.vy;
  }

}