import AbstractKey from './AbstractKey';
import colors from '../colors';
import { KEY_WIDTH as WHITE_KEY_WIDTH } from './WhiteKey';
import { scale } from '../config';

const KEY_WIDTH = 40 * scale;
const KEY_HEIGHT = 200 * scale;

class BlackKey extends AbstractKey
{
  constructor(g, index, controlKey) {
    super(g, index, controlKey);
  }

  getWidth() {
    return KEY_WIDTH;
  }

  getHeight() {
    return KEY_HEIGHT;
  }

  getFill() {
    return colors.black;
  }

  getStroke() {
    return '#777777';
  }

  getKeyX(index) {
    let x = 22 + (KEY_WIDTH + WHITE_KEY_WIDTH * index);
    if (index > 1) {
      x += WHITE_KEY_WIDTH;
    }
    return x;
  }

  getKeyY() {
    return 210;
  }

  getLabelX() {
    return this.sprite.x + 19;
  }

  getTextColor() {
    return colors.white;
  }
}

export default BlackKey;