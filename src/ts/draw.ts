/// <reference path="./gl.ts" />
/// <reference path="./assets.ts" />
/// <reference path="./util.ts" />

function drawTexture(textureName: string, x: number, y: number, sx: number = 1, sy: number = 1): void {
  const t: Texture = TEXTURE_STORE.get(textureName);
  gl._push();
  gl._tran(x, y);
  gl._scale(sx, sy);
  gl._draw(t.atlas, 0, 0, t.w, t.h, t.u0, t.v0, t.u1, t.v1);
  gl._pop();
}

enum Align {
  L,
  C,
  R
}

type TextParams = {
  _colour?: number,
  _textAlign?: Align,
  _scale?: number,
  _wrap?: number
};

function drawText(text: string, x: number, y: number,
  params: TextParams = { _colour: white, _textAlign: Align.L, _scale: 1, _wrap: 0 }): void {
  params._colour = params._colour || white;
  params._textAlign = params._textAlign || Align.L;
  params._scale = params._scale || 1;
  params._wrap = params._wrap || 0;

  const words: string[] = text.toLowerCase().split(" ");
  const orgx: number = x;
  let offx: number = 0;
  const lineLength: number = params._wrap === 0 ? text.split("").length * 6 : params._wrap;
  let alignmentOffset: number = 0;
  if (params._textAlign === Align.C) {
    alignmentOffset = ~~(-lineLength / 2);
  } else if (params._textAlign === Align.R) {
    alignmentOffset = ~~-lineLength;
  }

  gl._col(params._colour);
  for (const word of words) {
    if (params._wrap !== 0 && offx + word.length * 6 > params._wrap) {
      y += 6 * params._scale;
      offx = 0;
    }
    for (const letter of word.split("")) {
      const t: Texture = TEXTURE_STORE.get(letter);
      x = orgx + offx;

      gl._push();
      gl._tran(x, y);
      gl._scale(params._scale, params._scale);
      gl._draw(t.atlas, alignmentOffset, 0, t.w, t.h, t.u0, t.v0, t.u1, t.v1);
      gl._pop();
      offx += 6 * params._scale;
    }
    offx += 6 * params._scale;
  }
  gl._col(white);
}

function drawLine(start: V2, end: V2, color: number = white): void {
  let dx: number = Math.abs(end.x - start.x);
  let dy: number = Math.abs(end.y - start.y);
  let x: number = start.x;
  let y: number = start.y;
  let n: number = 1 + dx + dy;
  const xInc: number = (start.x < end.x ? 1 : -1);
  const yInc: number = (start.y < end.y ? 1 : -1);
  let e: number = dx - dy;
  dx *= 2;
  dy *= 2;
  gl._col(color);
  while (n > 0) {
    drawTexture("solid", x, y);
    if (e > 0) {
      x += xInc;
      e -= dy;
    } else {
      y += yInc;
      e += dx;
    }
    n -= 1;
  }
  gl._col(white);
}
