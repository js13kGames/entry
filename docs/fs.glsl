precision lowp float;
// OUT Texture Coordinates
varying vec2 uv;

// OUT Vertex Color
varying vec4 col;

// CONST Single Sampler2D
uniform sampler2D s;

void main() {
  gl_FragColor = texture2D(s, uv) * col;
}