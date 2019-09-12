/// <reference path="./scene-node.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./interpolator.ts" />
/// <reference path="./util.ts" />

class ActionSlot extends SceneNode {
  public _parent: ActionCard;
  public _condition: () => boolean;
  public _text: string = "";
  constructor(text: string, condition: () => boolean) {
    super();
    this._text = text;
    this._condition = condition;
    this._size = { x: 32, y: 32 };
  }

  public get _total(): number {
    const values: number[] = Array.from(this._nodes, ([id, die]) => (die as Dice)._value);
    return sum(...values);
  }

  public _reset(): void {
    const dice: Dice[] = Array.from(this._nodes, ([id, die]) => (die as Dice));
    for (const die of dice) {
      gameState._tray._add(die);
      die._used = false;
    }
  }

  public _onDrop(): boolean {
    if (this._condition && this._condition()) {
      return this._parent._onDrop();
    }
    zzfx(1, .1, 281, .3, .2, 0, .4, 31.1, .56);
    return false;
  }

  public _update(delta: number, now: number): void {

  }

  public _draw(delta: number, now: number): void {
    gl._col(white);
    drawTexture("d_s", this._abs.x, this._abs.y, 2, 2);
    drawText(this._text, this._abs.x + 17, this._abs.y + 34, { _textAlign: Align.C, _colour: 0Xffeeeeee });
    super._draw(delta, now);
  }
}

class ActionCard extends SceneNode {
  public _name: string = "";
  public _cost: string = "";
  public _desc: string[] = [];
  public _colour: number = 0xFF000000;
  private _numSlots: number = 0;
  public _condition: () => boolean;
  public _onComplete: () => void;
  public _parent: Encounter;

  constructor(name: string, desc: string[], cost: string, colour: number, condition: () => boolean, onComplete: () => void) {
    super();
    this._name = name;
    this._desc = desc;
    this._cost = cost;
    this._colour = colour;
    this._condition = condition;
    this._onComplete = onComplete;
    this._size = { x: 260, y: 64 };
  }

  public _add(...nodes: SceneNode[]): void {
    for (const node of nodes) {
      if (node instanceof ActionSlot) {
        this._numSlots++;
        node._rel = { x: this._size.x - (this._numSlots * 37), y: 16 };
      }
    }
    super._add(...nodes);
  }

  public get _dice(): Dice[] {
    return this._slots
      .reduce((a, s) => {
        a.push(...Array.from(s._nodes, ([id, n]) => n));
        return a;
      }, new Array<SceneNode>())
      .filter((d): d is Dice => d instanceof Dice);
  }

  public get _slots(): ActionSlot[] {
    return Array.from(this._nodes, ([id, node]) => node).filter((s): s is ActionSlot => s instanceof ActionSlot);
  }

  public get _total(): number {
    const values: number[] = Array.from(this._nodes, ([id, s]) => (s as ActionSlot)._total);
    return sum(...values);
  }

  public get _full(): boolean {
    const values: number[] = Array.from(this._nodes, ([id, s]) => (s as ActionSlot)._total);
    return values.reduce((acc, cur) => acc && (cur > 0), true);
  }

  public _onDrop(): boolean {
    if (this._full) {
      if (this._condition && this._condition()) {
        this._onComplete();
        for(const die of this._dice) {
          die._used = true;
        }
        return true;
      }
      zzfx(1, .1, 281, .3, .2, 0, .4, 31.1, .56);
      return false;
    }
    return true;
  }
  public _reset(): void {
    const slots: ActionSlot[] = Array.from(this._nodes, ([id, s]) => (s as ActionSlot));
    for (const slot of slots) {
      for (const [id, child] of slot._nodes) {
        child._destroy();
      }
    }
    this._enabled = true;
  }
  public _hide(reset: boolean): void {
    this._moveTo({ x: -265, y: this._rel.y }, 250, () => { this._enabled = false; if (reset) { this._reset(); } }, easeInBack);
  }
  public _destroy(): void {
    this._moveTo({ x: -265, y: this._rel.y }, 250, () => { super._destroy(); }, easeInBack);
  }
  public _update(delta: number, now: number): void {
    super._update(delta, now);
  }
  public _draw(delta: number, now: number): void {
    // Shadow
    gl._col(0x99000000);
    drawTexture("solid", this._abs.x + 1, this._abs.y + 1, this._size.x, this._size.y);

    // Box
    gl._col(this._colour);
    drawTexture("solid", this._abs.x, this._abs.y, this._size.x, this._size.y);

    // Body
    gl._col(white);
    drawText(this._name, this._abs.x + 5, this._abs.y + 3, { _scale: 2 });
    drawTexture("solid", this._abs.x + 5, this._abs.y + 14, this._size.x - 10, 1);
    drawText(`cost: ${this._cost}`, this._abs.x + 5, this._abs.y + 16);
    let dy: number = this._abs.y + 22;
    for(const d of this._desc) {
      drawText(d, this._abs.x + 5, dy, { _wrap: 160 });
      dy += 6;
    }
    super._draw(delta, now);
  }
}
