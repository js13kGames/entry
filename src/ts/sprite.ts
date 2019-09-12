/// <reference path="./scene-node.ts" />
/// <reference path="./assets.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./v2.ts" />
/// <reference path="./util.ts" />

type Frame = {
  _tex: string;
  _duration: number;
};

class Sprite extends SceneNode {
  private _frames: Frame[];
  private _scale: V2;
  private _colour: number;
  constructor(frames: Frame[], position: V2, scale: V2 = { x: 1, y: 1 }, colour: number = white) {
    super();
    const texture: Texture = TEXTURE_STORE.get(frames[0]._tex);
    this._frames = frames;
    this._rel = V2.copy(position);
    this._scale = V2.copy(scale);
    this._size = { x: texture.w * this._scale.x, y: texture.h * this._scale.y };
    this._colour = colour;
  }

  public _destroy(): void {
    super._destroy();
  }
  public _progress: number = 0;
  public _loop: boolean = false;
  get _currentFrame(): Frame {
    if (this._duration === 0) {
      return this._frames[0];
    } else {
      let totalDuration: number = 0;
      for (const frame of this._frames) {
        totalDuration += frame._duration;
        if (this._progress <= totalDuration) {
          return frame;
        }
      }
      return this._frames[this._frames.length - 1];
    }
  }

  private _durationTimer: number = -1;
  get _duration(): number {
    if (this._durationTimer === -1) {
      this._durationTimer = 0;
      for (const frame of this._frames) {
        this._durationTimer += frame._duration;
      }
    }
    return this._durationTimer;
  }

  public _update(delta: number, now: number): void {
    if (this._duration === 0) {
      return;
    } else {
      this._progress += delta;
      if (this._progress > this._duration) {
        if (this._loop) {
          this._progress = 0;
        } else {
          this._progress = 0;
        }
      }
    }
  }

  public _draw(delta: number, now: number): void {
    gl._col(this._colour);
    drawTexture(this._currentFrame._tex, this._abs.x, this._abs.y, this._scale.x, this._scale.y);
    gl._col(white);
    super._draw(delta, now);
  }
}
