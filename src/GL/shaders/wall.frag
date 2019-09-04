#version 300 es

#include fcolors
#include fdefs

precision mediump float;

uniform vec2 uResolution;
uniform float uTime;

in vec2 vQuadCoord;

out vec4 outColor;

#include futil
#include feffects

void main() {
  
  outColor = colYellowG;
  
}
