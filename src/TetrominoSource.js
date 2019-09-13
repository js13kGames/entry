import { TetrominoBag } from './TetrominoBag';

export class TetrominoSource {
  constructor () {
    this.bag = new TetrominoBag()
  }

  getNext() {
    const Type = this.bag.pick()
    if (!Type) {
      this.bag = new TetrominoBag()
      return this.getNext()
    }

    return new Type()
  }
}
