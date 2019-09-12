/// <reference path="./interpolator.ts" />
/// <reference path="./util.ts" />

let idGen: number = 0;

class SceneNode {
  public _id: number;
  private _SCENE: Scene;
  public get _scene(): Scene {
    if (this._SCENE === null) {
      return this._parent._scene;
    }
    return this._SCENE;
  }
  public _parent: SceneNode;
  public _nodes: Map<number, SceneNode> = new Map();
  public _rel: V2 = { x: 0, y: 0 };
  public _anchor: V2 = { x: 0, y: 0 };
  public _anim: (now: number) => boolean = null;
  public get _abs(): V2 {
    return {
      x: this._anchor.x + (this._parent ? this._parent._abs.x + this._rel.x : this._rel.x),
      y: this._anchor.y + (this._parent ? this._parent._abs.y + this._rel.y : this._rel.y)
    };
  }
  public _size: V2 = { x: 0, y: 0 };
  public _enabled: boolean = true;
  public _visible: boolean = true;

  constructor(scene: Scene = null) {
    this._id = idGen++;
    this._SCENE = scene;
  }

  public _add(...nodes: SceneNode[]): void {
    for (const node of nodes) {
      if (node._parent) {
        node._parent._remove(node);
      }
      this._nodes.set(node._id, node);
      node._parent = this;
    }
  }

  public _remove(node: SceneNode): void {
    node._parent = null;
    this._nodes.delete(node._id);
  }

  public _destroy(): void {
    // Remove this from it's parent
    if (this._parent) {
      this._parent._remove(this);
    }

    // Destroy all chidlren
    if (this._nodes) {
      for (const [id, node] of this._nodes) {
        node._destroy();
      }
    }

    // Wipe internals
    this._id = null;
    this._parent = null;
    this._nodes = null;
    this._rel = null;
    this._size = null;
    this._enabled = false;
    this._visible = false;
  }

  public _nodesAt(pt: V2): SceneNode[] {
    const result: SceneNode[] = [];
    if (this._rel && inside(pt, this._abs, this._size)) {
      result.push(this);
      for (const [id, child] of this._nodes) {
        result.push(...child._nodesAt(pt));
      }
    }
    return result;
  }
  
  public _moveTo(dest: V2, duration: number = 0, callback: () => void = null, easingFn: EasingFn = (t: number) => t): void {
    const o: V2 = V2.copy(this._rel);
    const d: V2 = V2.copy(dest);
    if(o.x === d.x && o.y === d.y) {
      return;
    }
    if (duration === 0) {
      this._rel = V2.copy(dest);
      return;
    }
    const interp: IterableIterator<number> = Interpolator(duration, easingFn);
    this._anim = (now: number): boolean => {
      const i: IteratorResult<number> = interp.next(now);
      this._rel.x = o.x + Math.round((d.x - o.x) * i.value);
      this._rel.y = o.y + Math.round((d.y - o.y) * i.value);
      if (i.done) {
        this._rel.x = d.x;
        this._rel.y = d.y;
        if (callback) {
          window.setTimeout(callback,0);
        }
      }
      return i.done;
    };
  }

  public _update(delta: number, now: number): void {
    if (this._anim) {
      if (this._anim(now)) {
        this._anim = null;
      }
    }
    if (this._enabled) {
      for (const [id, node] of this._nodes) {
        node._update(delta, now);
      }
    }
  }

  public _draw(delta: number, now: number): void {
    if (this._visible && this._enabled) {
      for (const [id, node] of this._nodes) {
        node._draw(delta, now);
      }
      // @ifdef DEBUG
      if (mouse._over.has(this._id)) {
        gl._col(0xFF00FF00);
        drawTexture("solid", this._abs.x, this._abs.y, 1, this._size.y);
        drawTexture("solid", this._abs.x + this._size.x - 1, this._abs.y, 1, this._size.y);
        drawTexture("solid", this._abs.x, this._abs.y, this._size.x, 1);
        drawTexture("solid", this._abs.x, this._abs.y + this._size.y - 1, this._size.x, 1);
        gl._col(white);
      }
      // @endif
    }
  }
}
