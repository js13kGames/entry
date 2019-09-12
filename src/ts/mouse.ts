/// <reference path="./v2.ts" />
/// <reference path="./events.ts" />

namespace mouse {
  export const _position: V2 = { x: 400, y: 225 };
  export const _over: Map<number, SceneNode> = new Map();
  export let _inputDisabled: boolean = true;
  let mdown: boolean = false;

  export function _initialize(canvas: HTMLCanvasElement): void {
    canvas.addEventListener("click", (event: MouseEvent) => {
      if (document.pointerLockElement === null) {
        canvas.requestPointerLock();
      } else if (!_inputDisabled) {
        emit("mclick", V2.copy(_position));
      }
    });

    canvas.addEventListener("mousedown", () => {
      if (!_inputDisabled) {
        mdown = true;
        emit("mdown", V2.copy(_position));
      }
    });

    canvas.addEventListener("mouseup", () => {
      if (!_inputDisabled) {
        mdown = false;
        emit("mup", V2.copy(_position));
      }
    });

    const POLL_RATE: number = 1000 / 60;
    let now: number;
    let then: number = 0;
    let timer: number = 0;
    function updatePosition(e: MouseEvent): void {
      now = performance.now();
      const delta: number = now - then;
      timer += delta;
      then = now;
      _position.x += e.movementX;
      _position.y += e.movementY;
      if (_position.x >= 800) {
        _position.x = 800 - 1;
      }
      if (_position.y >= 349) {
        _position.y = 349 - 1;
      }
      if (_position.x < 0) {
        _position.x = 0;
      }
      if (_position.y < 0) {
        _position.y = 0;
      }
      if (timer >= POLL_RATE) {
        timer = 0;
        emit("mmove", V2.copy(_position), mdown);
      }
    }

    document.addEventListener("pointerlockchange", () => {
      if (document.pointerLockElement === canvas) {
        document.addEventListener("mousemove", updatePosition, false);
        _inputDisabled = false;
      } else {
        document.removeEventListener("mousemove", updatePosition, false);
        _inputDisabled = true;
      }
    }, false);
  }
}
