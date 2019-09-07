import colors from '../colors';
import AbstractKey from './AbstractKey';
import { scale } from '../config';

export const KEY_WIDTH = 80 * scale;
const KEY_HEIGHT = 300 * scale;

class WhiteKey extends AbstractKey
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
    return colors.white;
  }

  getStroke() {
    return colors.black;
  }

  getKeyX(index) {
    return 2 + (KEY_WIDTH * index);
  }

  getKeyY() {
    return 210;
  }

  getLabelX() {
    return this.sprite.x + 42;
  }

  getTextColor() {
    return colors.black;
  }
}

export default WhiteKey;