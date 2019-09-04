#version 300 es

precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

uniform vec2 uSqueeze;

in vec2 vQuadCoord;

out vec4 outColor;

void main() {

  outColor = vec4(1.0, 0.0, 0.0, 1.0);
}
