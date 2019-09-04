#version 300 es

#include fcolors
#include fdefs

precision mediump float;

uniform vec2 uResolution;
uniform float uTime;

uniform float uState;

in vec2 vQuadCoord;

out vec4 outColor;

#include futil
#include feffects

#define stEmpty 0.0
#define stHilight 1.0

#define colEmpty colWhiteSwan
#define colHilight colSummerSky

void main() {

  vec2 p = vQuadCoord;

  // p = translate(p, vec2(0.5, 0.5));
  float sd = sdRoundedBox(p, vec2(0.8), 0.2);

  vec4 bgColor = colEmpty;

  if (uState == stHilight) {
    bgColor = colHilight;
  }

  vec4 col = vec4(0.0);

  col = mix(col, bgColor, 1.0-smoothstep(0.0, 0.1, sd));  

  outColor = col;
  
}
