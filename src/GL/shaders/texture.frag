#version 300 es

precision mediump float;

uniform sampler2D uTexture;

in vec2 vQuadCoord;

out vec4 outColor;

void main() {
  outColor = texture(uTexture, vQuadCoord);
  //outColor = vec4(1.0, 0.0, 0.0, 1.0);
}
