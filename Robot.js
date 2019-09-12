class Robot {

  constructor(radius, color, screenWidth, screenHeight, position){
    this.radius = radius;
    this.color = color;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.position = position;
  }

  setAngle(angle){
    this.angle = angle;
  }

  draw(ctx){
    ctx.save();

    ctx.translate(this.screenWidth/2,this.screenHeight/2);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.arc(0,this.position,this.radius,0,Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }
}

class Light{

  constructor(color, screenWidth, screenHeight){
    this.color = color;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
  }

  setAngle(angle){
    this.angle = angle;
  }

  draw(ctx){
    ctx.save();

    ctx.translate(this.screenWidth/2,this.screenHeight/2);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.lineTo(-500,this.screenWidth+100);
    ctx.lineTo(500,this.screenWidth+100);
    ctx.lineTo(0,0);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }

}