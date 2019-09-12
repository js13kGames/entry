/// <reference path="./util.ts" />

namespace gl {
  let ctx: WebGLRenderingContext;
  let width: number;
  let height: number;

  // xy + uv + argb
  const VERTEX_SIZE: number = (4 * 2) + (4 * 2) + (4);
  const MAX_BATCH: number = 10922;
  const VERTICES_PER_QUAD: number = 6;
  const VERTEX_DATA_SIZE: number = VERTEX_SIZE * MAX_BATCH * 4;
  const INDEX_DATA_SIZE: number = MAX_BATCH * (2 * VERTICES_PER_QUAD);

  const vertexData: ArrayBuffer = new ArrayBuffer(VERTEX_DATA_SIZE);
  const vPositionData: Float32Array = new Float32Array(vertexData);
  const vColorData: Uint32Array = new Uint32Array(vertexData);
  const vIndexData: Uint16Array = new Uint16Array(INDEX_DATA_SIZE);

  const mat: Float32Array = new Float32Array([1, 0, 0, 1, 0, 0]);
  const stack: Float32Array = new Float32Array(60);

  let indexBuffer: WebGLBuffer;
  let vertexBuffer: WebGLBuffer;
  let count: number = 0;
  let stackp: number = 0;
  let currentTexture: WebGLTexture = null;
  let vertexAttr: number;
  let textureAttr: number;
  let colourAttr: number;
  let c: number = white; // AABBGGRR

  export function _init(canvas: HTMLCanvasElement): void {
    width = canvas.width;
    height = canvas.height;
    ctx = canvas.getContext("webgl");

    function compileShader(source: string, type: number): WebGLShader {
      const glShader: WebGLShader = ctx.createShader(type);
      ctx.shaderSource(glShader, source);
      ctx.compileShader(glShader);
      return glShader;
    }

    function createShaderProgram(vsSource: string, fsSource: string): WebGLProgram {
      const program: WebGLProgram = ctx.createProgram();
      const vShader: WebGLShader = compileShader(vsSource, ctx.VERTEX_SHADER);
      const fShader: WebGLShader = compileShader(fsSource, ctx.FRAGMENT_SHADER);
      ctx.attachShader(program, vShader);
      ctx.attachShader(program, fShader);
      ctx.linkProgram(program);
      return program;
    }

    function createBuffer(bufferType: number, size: number, usage: number): WebGLBuffer {
      const buffer: WebGLBuffer = ctx.createBuffer();
      ctx.bindBuffer(bufferType, buffer);
      ctx.bufferData(bufferType, size, usage);
      return buffer;
    }

    const shader: WebGLShader = createShaderProgram(
      `precision lowp float;attribute vec2 v,t;attribute vec4 c;varying vec2 uv;varying vec4 col;uniform mat4 m;void main() {gl_Position = m * vec4(v, 1.0, 1.0);uv = t;col = c;}`,
      `precision lowp float;varying vec2 uv;varying vec4 col;uniform sampler2D s;void main() {gl_FragColor = texture2D(s, uv) * col;}`
    );

    indexBuffer = createBuffer(ctx.ELEMENT_ARRAY_BUFFER, vIndexData.byteLength, ctx.STATIC_DRAW);
    vertexBuffer = createBuffer(ctx.ARRAY_BUFFER, vertexData.byteLength, ctx.DYNAMIC_DRAW);

    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
    ctx.enable(ctx.BLEND);
    ctx.useProgram(shader);
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, indexBuffer);
    for (let indexA: number = 0, indexB: number = 0; indexA < MAX_BATCH * VERTICES_PER_QUAD; indexA += VERTICES_PER_QUAD, indexB += 4) {
      vIndexData[indexA + 0] = indexB;
      vIndexData[indexA + 1] = indexB + 1;
      vIndexData[indexA + 2] = indexB + 2;
      vIndexData[indexA + 3] = indexB + 0;
      vIndexData[indexA + 4] = indexB + 3;
      vIndexData[indexA + 5] = indexB + 1;
    }

    ctx.bufferSubData(ctx.ELEMENT_ARRAY_BUFFER, 0, vIndexData);
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);

    vertexAttr = ctx.getAttribLocation(shader, "v");
    textureAttr = ctx.getAttribLocation(shader, "t");
    colourAttr = ctx.getAttribLocation(shader, "c");

    ctx.enableVertexAttribArray(vertexAttr);
    ctx.vertexAttribPointer(vertexAttr, 2, ctx.FLOAT, false, VERTEX_SIZE, 0);
    ctx.enableVertexAttribArray(textureAttr);
    ctx.vertexAttribPointer(textureAttr, 2, ctx.FLOAT, false, VERTEX_SIZE, 8);
    ctx.enableVertexAttribArray(colourAttr);
    ctx.vertexAttribPointer(colourAttr, 4, ctx.UNSIGNED_BYTE, true, VERTEX_SIZE, 16);
    ctx.uniformMatrix4fv(ctx.getUniformLocation(shader, "m"), false, new Float32Array([2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 1, 1, -1, 1, 0, 0]));
    ctx.activeTexture(ctx.TEXTURE0);
  }

  export function _createTexture(image: HTMLImageElement): WebGLTexture {
    const texture: WebGLTexture = ctx.createTexture();
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    ctx.bindTexture(ctx.TEXTURE_2D, null);
    return texture;
  }

  export function _col(AABBGGRR: number): void {
    c = AABBGGRR;
  }

  export function _bkg(r: number, g: number, b: number): void {
    ctx.clearColor(r, g, b, 1);
  }

  export function _cls(): void {
    ctx.clear(ctx.COLOR_BUFFER_BIT);
  }

  export function _tran(x: number, y: number): void {
    mat[4] = mat[0] * x + mat[2] * y + mat[4];
    mat[5] = mat[1] * x + mat[3] * y + mat[5];
  }

  export function _scale(x: number, y: number): void {
    mat[0] = mat[0] * x;
    mat[1] = mat[1] * x;
    mat[2] = mat[2] * y;
    mat[3] = mat[3] * y;
  }

  export function _rot(r: number): void {
    const sr: number = Math.sin(r);
    const cr: number = Math.cos(r);

    mat[0] = mat[0] * cr + mat[2] * sr;
    mat[1] = mat[1] * cr + mat[3] * sr;
    mat[2] = mat[0] * -sr + mat[2] * cr;
    mat[3] = mat[1] * -sr + mat[3] * cr;
  }

  export function _push(): void {
    stack[stackp + 0] = mat[0];
    stack[stackp + 1] = mat[1];
    stack[stackp + 2] = mat[2];
    stack[stackp + 3] = mat[3];
    stack[stackp + 4] = mat[4];
    stack[stackp + 5] = mat[5];
    stackp += 6;
  }

  export function _pop(): void {
    stackp -= 6;
    mat[0] = stack[stackp + 0];
    mat[1] = stack[stackp + 1];
    mat[2] = stack[stackp + 2];
    mat[3] = stack[stackp + 3];
    mat[4] = stack[stackp + 4];
    mat[5] = stack[stackp + 5];
  }

  export function _draw(texture: WebGLTexture, x: number, y: number, w: number, h: number, u0: number, v0: number, u1: number, v1: number): void {
    const x0: number = x;
    const y0: number = y;
    const x1: number = x + w;
    const y1: number = y + h;
    const x2: number = x;
    const y2: number = y + h;
    const x3: number = x + w;
    const y3: number = y;
    const mat0: number = mat[0];
    const mat1: number = mat[1];
    const mat2: number = mat[2];
    const mat3: number = mat[3];
    const mat4: number = mat[4];
    const mat5: number = mat[5];
    const argb: number = c;

    if (texture !== currentTexture || count + 1 >= MAX_BATCH) {
      ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, vertexData);
      ctx.drawElements(4, count * VERTICES_PER_QUAD, ctx.UNSIGNED_SHORT, 0);
      count = 0;
      if (currentTexture !== texture) {
        currentTexture = texture;
        ctx.bindTexture(ctx.TEXTURE_2D, currentTexture);
      }
    }

    let offset: number = count * VERTEX_SIZE;

    // Vertex Order
    // Vertex Position | UV | ARGB
    // Vertex 1
    vPositionData[offset++] = x0 * mat0 + y0 * mat2 + mat4;
    vPositionData[offset++] = x0 * mat1 + y0 * mat3 + mat5;
    vPositionData[offset++] = u0;
    vPositionData[offset++] = v0;
    vColorData[offset++] = argb;

    // Vertex 2
    vPositionData[offset++] = x1 * mat0 + y1 * mat2 + mat4;
    vPositionData[offset++] = x1 * mat1 + y1 * mat3 + mat5;
    vPositionData[offset++] = u1;
    vPositionData[offset++] = v1;
    vColorData[offset++] = argb;

    // Vertex 3
    vPositionData[offset++] = x2 * mat0 + y2 * mat2 + mat4;
    vPositionData[offset++] = x2 * mat1 + y2 * mat3 + mat5;
    vPositionData[offset++] = u0;
    vPositionData[offset++] = v1;
    vColorData[offset++] = argb;

    // Vertex 4
    vPositionData[offset++] = x3 * mat0 + y3 * mat2 + mat4;
    vPositionData[offset++] = x3 * mat1 + y3 * mat3 + mat5;
    vPositionData[offset++] = u1;
    vPositionData[offset++] = v0;
    vColorData[offset++] = argb;

    if (++count >= MAX_BATCH) {
      ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, vertexData);
      ctx.drawElements(4, count * VERTICES_PER_QUAD, ctx.UNSIGNED_SHORT, 0);
      count = 0;
    }
  }

  export function _flush(): void {
    if (count === 0) {
      return;
    }
    ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, vPositionData.subarray(0, count * VERTEX_SIZE));
    ctx.drawElements(4, count * VERTICES_PER_QUAD, ctx.UNSIGNED_SHORT, 0);
    count = 0;
  }
}
