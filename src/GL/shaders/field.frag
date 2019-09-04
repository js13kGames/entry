#version 300 es

#include fdefs

precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

uniform vec2 uField;

in vec2 vQuadCoord;

out vec4 outColor;

#include futil

void fieldColor(out vec4 col, vec2 p) {
  
  float force = uField.x;
  float angle = uField.y;

  float c = cos(angle);
  float s = sin(angle);

  float circle = sdCircle(p, 0.8);

  vec2 pO = translate(p, vec2(c * 0.2, s * 0.2));
  float mask = sdCircle(pO, 1.0);

  float field = opSubtraction(mask, circle);

  col = mix(col, vec4(0.0, 1.0, 1.0, 1.0), 1.0-smoothstep(0.0, force * 0.1, abs(field)));
}

void main() {

  vec2 p = vQuadCoord;

  vec4 col = vec4(0.5, 0.5, 0.5, 0.0);

  fieldColor(col, p);

  outColor = col;
}
