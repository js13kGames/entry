import { objMap } from './util2';
import * as u from './util';

import mat3 from './matrix';

export default function Graphics(state, gl) {

  const { width, height } = state.game;

  gl.clearColor(0, 0, 0, 1);
  // https://stackoverflow.com/questions/57612782/how-to-render-objects-without-blending-with-transparency-enabled-in-webgl/57613578#57613578
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);

  this.gl = gl;

  this.minibatch = [];

  this.prCache = {};

  this.makePrograms = (prs) => {
    
    Object.keys(prs).forEach(key => {
      let { vSource, fSource } = prs[key];

      this.prCache[key] = makeProgram(gl, vSource, fSource);
    });

  };

  this.addTexture = (quad, props = {}, uniforms = {}) => {
    addQuad(quad, {
      uTexture: [],
      ...uniforms,
      ...baseUniforms(props, quad)
    });
  };

  this.addQuad = (quad, props = {}, uniforms = {}, numVertices) => {
    addQuad(quad, {
      ...uniforms,
      ...baseUniforms(props, quad)
    }, numVertices);
  };

  const baseUniforms = ({
    width : w,
    height : h,
    pivot,
    translation,
    rotation,
    scale
  }, quad) =>
  {
    w = w || width;
    h = h || height;
    pivot = pivot || [w * 0.5, h * 0.5];
    translation = translation || [0, 0];
    rotation = rotation || 0;
    scale = scale || [1.0, 1.0];

    const uMatrix = mat3.transform([width, height],
                                  translation,
                                  rotation,
                                  scale,
                                  pivot);

    return {
      uResolution: [gl.canvas.width, gl.canvas.height],
      uMatrix: [uMatrix]
    };
  };

  const addQuad = (quad, uniformArgs, numVertices = 6) => {
    const cookUniforms = Object.keys(quad.uniforms).map(key => {
      let setter = quad.uniforms[key];
      let args = uniformArgs[key];
      return () => {
        if (!args) {
          throw new Error("undefined uniform " + key);
        }
        setter(...args);
      };
    });
    this.minibatch.push({...quad, uniforms: cookUniforms, numVertices });
  };

  this.makeQuad = (drawInfo,
                   width,
                   height) =>
  {

    let left = 0,
        right = width,
        down = 0,
        up = height;
    let positionPoss = [left, down,
                        left, up,
                        right, down,
                        left, up,
                        right, down,
                        right, up];

    left = -1;
    right = 1;
    down = -1;
    up = 1;
    
    let texCoordPoss = [left, down,
                        left, up,
                        right, down,
                        left, up,
                        right, down,
                        right, up];

    const posInfo = new makeBufferInfoForAttribute("aPosition", 2),
          texInfo = new makeBufferInfoForAttribute("aTexCoord", 2);

    let bufferInfos = [
      posInfo,
      texInfo
    ];

    let res = this.makeDraw({...drawInfo, bufferInfos });

    posInfo.set(positionPoss, gl.STATIC_DRAW);
    texInfo.set(texCoordPoss, gl.STATIC_DRAW);

    return res;
  };

  this.makeDraw = ({
    name,
    program,
    uniforms,
    textureInfos,
    bufferInfos
  }) => {

    program = this.prCache[program];
    textureInfos = textureInfos || [];

    let vao = makeVao(gl, bufferInfos.map(_ => _.apply(gl, program)));

    return {
      name,
      program,
      vao,
      textureInfos: textureInfos.map(_ => _.apply(gl, program)),
      uniforms: objMap(uniforms, (_, v) => v(gl, program))
    };
  };

  this.render = () => {

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.minibatch.forEach(({
      program,
      uniforms,
      textureInfos,
      vao,
      numVertices
    }) => {

      gl.useProgram(program);

      gl.bindVertexArray(vao);

      textureInfos.forEach(({ glTexture, index }) => {
        gl.uniform1i(index, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
      });

      uniforms.forEach(_ => _());

      gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    });

    this.minibatch = [];
  };
}

const makeVao = (gl, bufferInfos) => {
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  bufferInfos.forEach(({
    buffer,
    size,
    index
  }) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.vertexAttribPointer(index,
                           size,
                           gl.FLOAT,
                           false,
                           0,
                           0);
    gl.enableVertexAttribArray(index);

  });

  gl.bindVertexArray(null);

  return vao;
};


export function makeTextureInfoForUniform(name) {

  let gl, glTexture;

  this.apply = (_gl, program) => {
    gl = _gl;
    glTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, glTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

    return {
      glTexture,
      index: gl.getUniformLocation(program, name)
    };

  };

  this.set = (texture) => {
    gl.bindTexture(gl.TEXTURE_2D, glTexture);

    const format = gl.RGBA,
          type = gl.UNSIGNED_BYTE;
    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, type, texture);

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  };
}

export function makeBufferInfoForAttribute(name, size) {
  let gl, buffer;

  this.set = (array, drawType) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), drawType);
  },

  this.apply = (_gl, program) => {
    gl = _gl;
    buffer = gl.createBuffer();
    return {
      buffer,
      size,
      index: gl.getAttribLocation(program, name)
    };
  };
};


const withGLLocation = f => name => (gl, program) => {
  return f(gl, gl.getUniformLocation(program, name));
};

export const makeUniform1fSetter = withGLLocation((gl, location) => (...args) => gl.uniform1f(location, ...args));


export const makeUniform2fSetter = withGLLocation((gl, location) => (...args) => gl.uniform2f(location, ...args));

export const makeUniform2fvSetter = withGLLocation((gl, location) => (vec) => gl.uniform2fv(location, vec));

export const makeUniform3fvSetter = withGLLocation((gl, location) => (matrix) => gl.uniformMatrix3fv(location, false, matrix));


const makeProgram = (gl, vSource, fSource) => {
  let vShader = createShader(gl, gl.VERTEX_SHADER, vSource);
  let fShader = createShader(gl, gl.FRAGMENT_SHADER, fSource);

  let program = createProgram(gl, vShader, fShader);

  return program;
};

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.error('Cannot create shader: [' + source + '] ' + gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
};

function createProgram(gl, vShader, fShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}
