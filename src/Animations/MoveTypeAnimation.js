import {
  T_SPIN_MINI,
  T_SPIN,
  T_SPIN_SINGLE,
  T_SPIN_MINI_SINGLE,
  T_SPIN_DOUBLE,
  T_SPIN_TRIPLE,
  TETRIS_CLEAR,
  ALL_CLEAR
} from '../constants';
import { TextsSprite } from '../Assets';
import { drawSprite } from '../Graphics';
import { EnvelopeSampler } from '../utils';
import { AnimationBase } from './Animation';

export class MoveTypeAnimation extends AnimationBase {
  constructor (type) {
    super(120)

    this.type = type
    this.isMini = [T_SPIN_MINI, T_SPIN_MINI_SINGLE].includes(type)
    this.textIndex = {
      [T_SPIN]: 2,
      [T_SPIN_MINI]: 2,
      [T_SPIN_MINI_SINGLE]: 2,
      [T_SPIN_SINGLE]: 2,
      [T_SPIN_DOUBLE]: 2,
      [T_SPIN_TRIPLE]: 2,
      // [SINGLE_CLEAR]: 'SINGLE',
      // [DOUBLE_CLEAR]: 'DOUBLE',
      // [TRIPLE_CLEAR]: 'TRIPLE',
      [TETRIS_CLEAR]: 0,
      [ALL_CLEAR]: 1,
    }[type]

    this.bottomTextIndex = {
      [T_SPIN_MINI_SINGLE]: 4,
      [T_SPIN_SINGLE]: 4,
      [T_SPIN_DOUBLE]: 5,
      [T_SPIN_TRIPLE]: 6,
    }[type]

    if (this.textIndex === undefined) {
      this.done = true
    }

    this.scaleSampler = new EnvelopeSampler([
      [0.0, 0.0, 2],
      [0.1, 1.75, 1.5],
      [0.2, 1.0],
      [0.9, 1.0, 2],
      [1.0, 1.4],
    ])

    this.scale2Sampler = new EnvelopeSampler([
      [0.0, 0.0, 6],
      [0.2, 1.2, 1.5],
      [0.3, 1.0],
    ])

    this.rotationSampler = new EnvelopeSampler([
      [0, this.textIndex === 2 ? Math.PI * 2 : 0, 0.04],
      [1, 0]
    ])
  }

  render () {
    if (this.done) {
      return
    }

    let t = this.relativeT

    let scale1 = this.scaleSampler.sample(t)
    let scale2 = this.scale2Sampler.sample(t)
    let rotation = this.rotationSampler.sample(t)

    if (this.isMini) {
      drawSprite(TextsSprite, 0, 100, 3, scale1, scale1)
    }
    drawSprite(TextsSprite, 0, 112, this.textIndex, scale1, scale1, rotation)
    if (this.bottomTextIndex) {
      drawSprite(TextsSprite, 0, 130, this.bottomTextIndex, scale2, scale2)
    }
  }
}
