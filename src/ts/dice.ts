/// <reference path="./scene-node.ts" />
/// <reference path="./util.ts" />
/// <reference path="./events.ts" />

type DiceDef = {
  _values: number[];
  _colour: number;
  _lock?: boolean;
};

class Dice extends SceneNode {
  public _values: number[];
  public _colour: number;
  public _value: number = 1;
  private _rolling: boolean = false;
  private _rollStart: number = 0;
  private _rollDuration: number = 0;
  private _held: boolean = false;
  public _used: boolean = false;
  public _lock: boolean = false;
  public _scale: number;
  constructor(values: number[] = [1, 2, 3, 4, 5, 6], colour: number = white, scale: number = 2) {
    super();
    this._values = values;
    this._colour = colour;
    this._scale = scale;
    this._size = { x: 16 * scale, y: 16 * scale };
    subscribe("mdown", `dice_${this._id}`, (pos: V2): void => {
      if (!this._used && !this._lock &&
        mouse._over.has(this._id) && !this._rolling) {
        this._scene._cursor._add(this);
        this._rel = { x: -8 * scale, y: -8 * scale };
        this._held = true;
      }
    });
    subscribe("mup", `dice_${this._id}`, (pos: V2): void => {
      if (this._held) {
        this._held = false;
        for (const [id, node] of mouse._over) {
          if (node instanceof ActionSlot && node._nodes.size === 0) {
            this._rel = { x: 0, y: 0 };
            node._add(this);
            if (node._onDrop()) {
              return;
            }
          }
        }
        gameState._tray._add(this);
      }
    });
  }
  public _destroy(): void {
    unsubscribe("mdown", `dice_${this._id}`);
    unsubscribe("mup", `dice_${this._id}`);
    super._destroy();
  }

  public _update(delta: number, now: number): void {
    if (this._rolling) {
      this._roll(now);
    }
  }

  public _roll(now: number): void {
    if (!this._rolling) {
      this._rolling = true;
      this._rollStart = now;
      this._rollDuration = rand(222, 1111);
    }
    if (this._rolling && now - this._rollStart >= this._rollDuration) {
      this._rolling = false;
      zzfx(1, .02, 330, .05, .55, 0, 0, 0, .1); // ZzFX 0
      return;
    }
    this._value = this._values[rand(0, 5)];
  }

  public _draw(delta: number, now: number): void {
    gl._col(this._colour);
    drawTexture(`d_${this._value}`, this._abs.x, this._abs.y, this._scale, this._scale);
    gl._col(white);
    if (this._lock) {
      drawTexture(`d_l`, this._abs.x, this._abs.y, this._scale, this._scale);
    }
    super._draw(delta, now);
  }
}

class DiceTray extends SceneNode {
  public _dice: DiceDef[] = [];
  public _onDrop: () => void;
  public constructor() {
    super();
    this._size.x = 40;
    this._size.y = 40;
  }
  public _lock(num: number): void {
    for (let i: number = 0; i < num; i++) {
      if (this._dice[i]) {
        this._dice[i]._lock = true;
      }
    }
  }
  public _restock(now: number): void {
    this._nodes.clear();
    for (const def of this._dice) {
      const die: Dice = new Dice(def._values, def._colour);
      die._roll(now + 500);
      die._lock = def._lock || false;
      def._lock = false;
      this._add(die);
    }
  }
  public _update(delta: number, now: number): void {
    let xOff: number = 4;
    for (const [id, child] of this._nodes) {
      if (child instanceof Dice) {
        child._rel = { x: xOff, y: 4 };
        xOff += 36;
      }
    }
    this._size.x = this._dice.length * 36 + 4;
    super._update(delta, now);
  }
  public _draw(delta: number, now: number): void {
    gl._col(white);
    super._draw(delta, now);
  }
}
