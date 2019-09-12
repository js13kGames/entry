/// <reference path="./scene-node.ts" />
/// <reference path="./mouse.ts" />
/// <reference path="./util.ts" />

namespace SceneManager {
  const scenes: Map<string, Scene> = new Map();
  const stack: Scene[] = [];

  export function _register(scene: Scene): void {
    scenes.set(scene._name, scene);
  }

  export function _push(name: string): void {
    const newScene: Scene = scenes.get(name);
    if (stack.length > 0) {
      stack[stack.length - 1]._transitionOut();
    }
    stack.push(newScene);
    stack[stack.length - 1]._transitionIn();
  }

  export function _pop(): void {
    stack[stack.length - 1]._transitionOut();
    stack.pop();
    if (stack.length > 0) {
      stack[stack.length - 1]._transitionIn();
    }
  }

  export function _update(delta: number, now: number): void {
    stack[stack.length - 1]._update(delta, now);
  }
  export function _draw(delta: number, now: number): void {
    stack[stack.length - 1]._draw(delta, now);
  }
}

class Scene {
  public _name: string;
  public _root: SceneNode;
  public _cursor: Sprite;
  private _updateFn: (delta: number, now: number) => void;
  private _drawFn: (delta: number, now: number) => void;
  private _tranIn: () => void;
  private _tranOut: () => void;

  constructor(
    name: string,
    transitionIn: () => void = null,
    transitionOut: () => void = null,
    update: (delta: number, now: number) => void = null,
    draw: (delta: number, now: number) => void = null) {
    this._name = name;
    this._tranIn = transitionIn;
    this._tranOut = transitionOut;
    this._updateFn = update;
    this._drawFn = draw;
  }

  public _transitionIn(): void {
    this._root = new SceneNode(this);
    this._root._rel = { x: 0, y: 0 };
    this._root._size = { x: SCREEN_WIDTH, y: SCREEN_HEIGHT };
    this._cursor = new Sprite(
      [
        { _tex: "cursor", _duration: 0 }
      ],
      V2.copy(mouse._position));
    this._root._add(this._cursor);

    if (this._tranIn) {
      this._tranIn();
    }
    subscribe("mmove", this._name, (pos: V2) => {
      if (this._cursor._enabled) {
        V2.set(this._cursor._rel, pos);
        mouse._over.clear();
        const nodes: SceneNode[] = this._root._nodesAt(pos);
        for (let i: number = 0; i < nodes.length; i++) {
          mouse._over.set(nodes[i]._id, nodes[i]);
        }
      }
    });
    emit("mmove", V2.copy(mouse._position), false);
  }

  public _transitionOut(): void {
    unsubscribe("mmove", this._name);
    mouse._over.clear();
    if (this._tranOut) {
      this._tranOut();
    }
    this._root._destroy();
  }

  public _update(delta: number, now: number): void {
    if (this._updateFn) {
      this._updateFn(delta, now);
    }
    this._root._update(delta, now);
  }

  public _draw(delta: number, now: number): void {
    this._root._draw(delta, now);
    if (this._drawFn) {
      this._drawFn(delta, now);
    }
    this._cursor._draw(delta, now);
    // @ifdef DEBUG
    drawText(`${this._cursor._abs.x}, ${this._cursor._abs.y}`, this._cursor._abs.x + 16, this._cursor._abs.y + 16);
    // @endif
  }
}
