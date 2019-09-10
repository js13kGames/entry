import { AnimationBase } from './Animation';
import { sampleNoise } from '../Audio/SoundGeneration';
import { drawSprite, Graphics } from '../Graphics';
import { EyesSprite } from '../Assets';

export class FallingEyePair extends AnimationBase {
  constructor (x, y) {
    super(120)

    this.x = x
    this.y = y

    this.dy = sampleNoise()
    this.dx = sampleNoise()
  }

  step () {
    super.step()

    this.dy += 0.5

    this.y += this.dy
    this.x += this.dx
  }

  render () {
    drawSprite(EyesSprite, this.x - 4, this.y, 0)
    drawSprite(EyesSprite, this.x + 4, this.y, 0)
  }
}
