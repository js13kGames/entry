export const HAPPY = 1;
export const NEUTRAL = 0;
export const SAD = -1;
export const ANGRY = -2;

class Slime
{
  constructor(g, parentSprite) {
    this.g = g;
    this.jumping = false;
    this.mood = NEUTRAL;
    this.parentSprite = parentSprite;
    this.onDoneJumping = () => {};
    this.drawSprite();
  }

  setMood(mood) {
    this.mood = mood;
    this.drawSprite();
  }

  resetMood() {
    this.mood = NEUTRAL;
    this.drawSprite();
  }

  improveMood() {
    if (this.mood === ANGRY) {
      // Stay angry
      return;
    }
    if (this.mood < HAPPY) {
      this.mood++;
      this.drawSprite();
    }
  }

  worsenMood() {
    if (this.mood > ANGRY) {
      this.mood--;
      this.drawSprite();
    }
  }

  drawSprite() {
    let image;
    switch (this.mood) {
      case HAPPY:
        image = 'assets/happy-slime.png';
        break;
      case NEUTRAL:
        image = 'assets/neutral-slime.png';
        break;
      case SAD:
        image = 'assets/sad-slime.png';
        break;
      case ANGRY:
        image = 'assets/angry-slime.png';
        break;
      default:
        throw new Error('Unknown mood');
    }
    if (this.sprite) {
      this.sprite.setTexture(image);
    } else {
      this.sprite = this.g.sprite(image);
    }
    if (this.parentSprite) {
      this.parentSprite.putTop(this.sprite);
    }
    this.sprite.y -= 3;
    this.sprite.scaleX = 1.25;
    this.sprite.scaleY = 1.25;
  }

  jump(onDoneJumping) {
    this.onDoneJumping = onDoneJumping ? onDoneJumping : () => {};
    if (!this.jumping && !this.falling) {
      this.jumping = true;
      this.sprite.vy = -5;
      this.jumpFrames = 0.2 * this.g.fps;
    }
  }

  shake(onDoneShaking) {
    let shakes = 8; // must be even number
    const shakeAmount = 2;
    const shakeInterval = 50;
    let shakeDirection = 1;
    const shake = () => {
      this.sprite.x += shakeAmount * shakeDirection;
      shakeDirection *= -1;
      if (shakes > 0) {
        shakes--;
        setTimeout(
          shake,
          shakeInterval
        );
      } else {
        onDoneShaking();
      }
    }
    shake();
  }

  update() {
    if (this.jumping) {
      if (this.jumpFrames === 0) {
        this.jumping = false;
        this.falling = true;
        this.sprite.vy = 10;
        this.fallFrames = 0.1 * this.g.fps;
      } else {
        this.jumpFrames -= 1;
      }
    }
    if (this.falling) {
      if (this.fallFrames === 0) {
        this.falling = false;
        this.sprite.vy = 0;
        this.onDoneJumping();
      } else {
        this.fallFrames -= 1;
      }
    }
    this.g.move(this.sprite);
  }
}

export default Slime;
