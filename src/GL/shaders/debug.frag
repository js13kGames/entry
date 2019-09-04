#version 300 es

#include fcolors
#include fdefs

#define statePlay 0.0
#define stateOver 1.0
 
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uState;

in vec2 vQuadCoord;

out vec4 outColor;

#include futil
#include feffects

void main() {

  vec2 p = vQuadCoord;
  p.x *= uResolution.x/uResolution.y;

  float y = abs(p.y);

  vec4 col = colCrocTooth;

  col = mix(col, colBlack, 1.0-smoothstep(0.0, 0.01, y));

  y = abs(p.x);
  col = mix(col, colBlack, 1.0-smoothstep(0.0, 0.01, y));

  outColor = col;
}
