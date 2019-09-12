import { Graphics, Canvas } from '../Graphics';
import { LogoSprite } from '../Assets';
import { currentLevel } from '../globals';
import { approach } from '../utils';

function shortAngleDist(a0, a1) {
  const max = Math.PI * 2
  const da = (a1 - a0) % max
  return 2 * da % max - da
}

export class Background {
  constructor () {
    this.x = 0
    this.y = 0
    this.direction = this.targetDirection = Math.PI / 3
    this.speed = 1
  }

  initImage () {
    if (this.image) {
      return
    }

    this.image = document.createElement('canvas')
    this.image.width = Canvas.width + 80
    this.image.height = Canvas.height + 80
    const ctx = this.image.getContext('2d')
    for (let x = 0; x < this.image.width; x += 80) {
      for (let y = 0; y < this.image.height; y += 80) {
        ctx.save()
        ctx.translate(x + 28, y + 20)
        ctx.rotate(-Math.PI / 4)
        ctx.drawImage(LogoSprite.renderable, -25, -20)
        ctx.restore()
      }
    }
    ctx.fillStyle = 'rgba(0,0,0,0.85)'
    ctx.fillRect(0, 0, this.image.width, this.image.height)
  }

  step (isGameOver) {
    const targetSpeed = isGameOver ? 0.5 : 1.08 ** currentLevel
    this.speed = approach(this.speed, targetSpeed, 1 / 30)
    let dist = shortAngleDist(this.direction, this.targetDirection)
    this.direction += dist / 500
    if (Math.abs(dist) < 0.1) {
      this.targetDirection = Math.random() * Math.PI * 2
    }

    this.x += Math.cos(this.direction) * this.speed
    this.y += Math.sin(this.direction) * this.speed

    if (this.x <= -80) {
      this.x += 80
    }
    if (this.y <= -80) {
      this.y += 80
    }
    if (this.x > 0) {
      this.x -= 80
    }
    if (this.y > 0) {
      this.y -= 80
    }
  }

  render () {
    Graphics.drawImage(this.image, this.x, this.y)
  }
}

export const TheBackground = new Background()
