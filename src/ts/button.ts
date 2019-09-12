/// <reference path="./events.ts" />
/// <reference path="./v2.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./scene-node.ts" />
/// <reference path="./zzfx.d.ts" />
/// <reference path="./util.ts" />

class Button extends SceneNode {
  public _text: string;
  public _onClick: (self: Button) => void;
  private _down: boolean = false;
  private _hover: boolean = false;
  public _colour: number;
  public _colourNormal: number;
  public _colourHover: number;
  public _colourPressed: number;
  public _shadow: number;
  constructor(
    text: string,
    x: number, y: number,
    w: number, h: number,
    onClick: (self: Button) => void,
    colourNormal: number = 0xFF3326be,
    colourHover: number = 0xFF3d2bd9,
    colourPressed: number = 0xFF271c8c,
    shadow: number = 0x99000000) {
    super();
    this._text = text;
    this._rel = { x, y };
    this._size = { x: w, y: h };
    this._onClick = onClick;
    this._colour = colourNormal;
    this._colourNormal = colourNormal;
    this._colourHover = colourHover;
    this._colourPressed = colourPressed;
    this._shadow = shadow;

    subscribe("mmove", `btn_${this._id}`, (pos: V2, mdown: boolean): void => {
      if (this._enabled && !mdown && (!this._parent || this._parent._enabled)) {
        if (mouse._over.has(this._id)) {
          this._colour = this._colourHover;
          if (!this._hover) {
            zzfx(1, .02, 440, .05, .55, 0, 0, 0, .1);
          }
          this._hover = true;
        }
        else {
          this._colour = this._colourNormal;
          this._hover = false;
        }
      }
    });

    subscribe("mdown", `btn_${this._id}`, (pos: V2): void => {
      if (this._enabled && (!this._parent || this._parent._enabled)) {
        if (mouse._over.has(this._id)) {
          this._colour = this._colourPressed;
          this._rel.x += 1;
          this._rel.y += 1;
          if (!this._down) {
            zzfx(1, .02, 220, .05, .55, 0, 0, 0, .1); // ZzFX 0
          }
          this._down = true;
        }
      }
    });

    subscribe("mup", `btn_${this._id}`, (pos: V2): void => {
      if (this._enabled && (!this._parent || this._parent._enabled)) {
        if (this._down) {
          this._colour = this._colourNormal;
          this._rel.x -= 1;
          this._rel.y -= 1;
          this._down = false;
        }
        if (mouse._over.has(this._id)) {
          zzfx(1, .02, 330, .05, .55, 0, 0, 0, .1); // ZzFX 0
          this._onClick(this);
          this._colour = this._colourHover;
        }
      }
    });
  }
  public _destroy(): void {
    unsubscribe("mmove", `btn_${this._id}`);
    unsubscribe("mdown", `btn_${this._id}`);
    unsubscribe("mup", `btn_${this._id}`);
    super._destroy();
  }

  public _draw(delta: number, now: number): void {
    if (this._visible) {
      if (!this._down) {
        gl._col(this._shadow);
        drawTexture("solid", this._abs.x + 1, this._abs.y + 1, this._size.x + 1, this._size.y + 1);
      }
      gl._col(this._colour);
      drawTexture("solid", this._abs.x, this._abs.y, this._size.x, this._size.y);
      gl._col(white);
      drawText(this._text, this._abs.x + ~~(this._size.x / 2), this._abs.y - 2 + ~~(this._size.y / 2), { _textAlign: Align.C });
      super._draw(delta, now);
    }
  }
}
