precision lowp float;             
     
// IN Vertex Position and
// IN Texture Coordinates
attribute vec2 v, t;

// IN Vertex Color
attribute vec4 c;

// OUT Texture Coordinates
varying vec2 uv;

// OUT Vertex Color
varying vec4 col;

// CONST View Matrix
uniform mat4 m;

void main() {
    gl_Position = m * vec4(v, 1.0, 1.0);
    uv = t;
    col = c;
}