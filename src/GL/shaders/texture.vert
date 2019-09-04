#version 300 es

precision mediump float;

in vec2 aPosition;

in vec2 aTexCoord;

out vec2 vQuadCoord;

uniform vec2 uResolution;

uniform mat3 uMatrix;

void main() {

  vec2 position = (uMatrix * vec3(aPosition, 1)).xy;

  vQuadCoord = (aTexCoord + 1.0) / 2.0;

  gl_Position = vec4(position, 0, 1);

}
