/// <reference path="./scene-node.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./enemy.ts" />
/// <reference path="./dice.ts" />
/// <reference path="./sprite.ts" />
/// <reference path="./consts.ts" />
/// <reference path="./game-state.ts" />
/// <reference path="./util.ts" />

enum EncounterType {
  Empty,
  Camp,
  Loot,
  Fight,
  Boss
}

class Encounter extends SceneNode {
  public _type: EncounterType;
  public _name: string;
  public _tips: string[] = [];
  public _enemy: Enemy;
  public _isComplete: boolean = false;
  public _onComplete: () => void = (): void => { };
  constructor() {
    super();
    this._rel = { x: 0, y: 0 };
    this._size = { x: 800, y: 350 };
  }
  public _empty(): void {
    for (const [id, child] of this._nodes) {
      if (child instanceof ActionCard) {
        child._destroy();
      }
    }
    if (this._enemy) {
      this._remove(this._enemy);
      this._enemy = null;
    }
  }

  public _removeActionCards(name: string): void {
    for (const [id, child] of this._nodes) {
      if (child instanceof ActionCard && child._name === name) {
        child._visible = false;
        child._destroy();
      }
    }
  }

  public _update(delta: number, now: number): void {
    let actionCount: number = 0;
    let row: number = 0;
    let col: number = 0;
    for (const [id, child] of this._nodes) {
      if (child instanceof ActionCard) {
        actionCount++;
        if (child._enabled && !child._anim) {
          if (row > 2) {
            row = 0;
            col++;
          }
          child._moveTo({ x: 6 + (child._size.x + 4) * col, y: 2 + row * (child._size.y + 4) }, 250);
          row++;
        }
      }
    }
    if (!this._isComplete) {
      if ((actionCount === 0 && !this._enemy) ||
        (this._enemy && this._enemy._isDead)) {
        this._isComplete = true;
        this._onComplete();
      }
    }
    super._update(delta, now);
  }
  public _draw(delta: number, now: number): void {
    drawText("tips", 400, 210, { _textAlign: Align.C, _scale: 2, _colour: 0xFF262417 });
    let tipY: number = 222;
    for (const tip of this._tips) {
      drawText(tip, 400, tipY, { _textAlign: Align.C, _colour: 0xFF262417 });
      tipY += 12;
    }
    super._draw(delta, now);
  }
}

class EncounterMap extends SceneNode {
  public _playerNode: EncounterNode;
  public _player: Sprite;
  constructor() {
    super();
    this._rel.x = 0;
    this._rel.y = 350;
    this._size.x = 800;
    this._size.y = 100;
    for (let x: number = 0; x < 100; x++) {
      for (let y: number = 0; y < 13; y++) {
        this._add(
          new Sprite(
            [
              { _tex: `gr_${rand(0, 3)}`, _duration: 0 }
            ],
            { x: x * 8, y: y * 8 },
            { x: 1, y: 1 },
            0xFF33aa33)
        );
      }
    }
    for (let t: number = 0; t < 100; t++) {
      this._add(new Sprite(
        [
          { _tex: `tree`, _duration: 0 }
        ],
        { x: rand(0, 800), y: rand(0, 25) })
      );
    }
    this._player = new Sprite(
      [
        { _tex: "g_0", _duration: 250 },
        { _tex: "g_1", _duration: 250 }
      ],
      { x: 0, y: 26 });
    this._add(this._player);
    for (let t: number = 0; t < 100; t++) {
      this._add(new Sprite(
        [
          { _tex: `tree`, _duration: 0 }
        ],
        { x: rand(0, 800), y: rand(55, 100) })
      );
    }
  }
  public _destroy(): void { }

  public _update(delta: number, now: number): void {
    this._player._rel.x = this._playerNode._rel.x;
    super._update(delta, now);
  }

  public _draw(delta: number, now: number): void {
    super._draw(delta, now);
    gl._col(white);
    drawTexture("solid", this._abs.x, this._abs.y, 800, 1);
    gl._col(0Xaa000000);
    drawTexture("solid", this._abs.x + this._size.x / 2 - 100, this._abs.y + 2, 200, 12);
    if (this._playerNode._encounter) {
      drawText(this._playerNode._encounter._name, this._abs.x + this._size.x / 2, this._abs.y + 2, { _textAlign: Align.C, _scale: 2 });
    } else {
      drawText("forest entrance", this._abs.x + this._size.x / 2, this._abs.y + 2, { _textAlign: Align.C, _scale: 2 });
    }
  }
}

class EncounterNode extends SceneNode {
  public _next: EncounterNode = null;
  public _previous: EncounterNode = null;
  public _encounter: Encounter = null;
  constructor(encounter: Encounter = emptyEncounter()) {
    super();
    this._size = { x: 16, y: 16 };
    this._encounter = encounter;
  }
  public _destroy(): void { }

  public _draw(delta: number, now: number): void {
    if (this._next) {
      gl._col(white);
      const origin: V2 = V2.add(this._abs, { x: 8, y: 8 });
      drawLine(origin, V2.add(origin, { x: 16, y: 0 }));
    }
    if (!this._encounter || this._encounter._type === EncounterType.Empty) {
      gl._col(0xFFff8888);
    } else if (this._encounter._type === EncounterType.Camp) {
      //gl._col(0xFF22ff22);
      gl._col(0xFFff8888);
    } else if (this._encounter._type === EncounterType.Loot) {
      gl._col(0xFF22ffff);
    } else if (this._encounter._type === EncounterType.Fight) {
      //gl._col(0xFF3399ff);
      gl._col(0xFFff8888);
    } else if (this._encounter._type === EncounterType.Boss) {
      gl._col(0xFF2222ff);
    }
    drawTexture("node", this._abs.x, this._abs.y);
    gl._col(white);
    super._draw(delta, now);
  }
}
