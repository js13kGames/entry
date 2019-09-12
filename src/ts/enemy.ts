/// <reference path="./dice.ts" />
/// <reference path="./scene-node.ts" />
/// <reference path="./interpolator.ts" />
/// <reference path="./util.ts" />

class Enemy extends SceneNode {
  constructor(die: number[]) {
    super();
    this._size = { x: 80, y: 80 };
    const dice: Dice = new Dice(die, white, 1);
    dice._used = true;
    dice._rel.x = -16;
    this._add(dice);
  }
  public get _dice(): Dice[] {
    return Array.from(this._nodes, ([id, die]) => die).filter((d): d is Dice => d instanceof Dice);
  }
  public _roll(now: number): void {
    for (const die of this._dice) {
      die._roll(now);
    }
  }
  public get _dmg(): number {
    return this._dice.reduce((acc, die) => acc + die._value, 0);
  }
  public get _isDead(): boolean {
    return this._hp <= 0;
  }
  public _name: string = "";
  public _desc: string[] = [];
  public _maxHp: number = 0;
  public _hp: number = 0;
  public _turn: () => void;

  public _draw(delta: number, now: number): void {
    drawText(this._name, this._abs.x, this._abs.y + 17, { _textAlign: Align.R, _scale: 2 });
    for (let i: number = 0; i < this._desc.length; i++) {
      drawText(this._desc[i], this._abs.x, this._abs.y + 28 + i * 6, { _textAlign: Align.R });
    }
    drawText(`${this._hp <= 0 ? 0 : this._hp}/${this._maxHp}`, 600, 330, { _textAlign: Align.R, _scale: 2 });
    super._draw(delta, now);
  }
}
