#version 300 es

#include fdefs
 
precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

uniform vec2 uSqueeze;

in vec2 vQuadCoord;

out vec4 outColor;

#include futil

float sdHeroBubble(vec2 p, vec2 trans, float rot) {
  vec2 pBubbles = 
    transform(p, trans, rot, 1.0);
  float bubbles = sdCircle(pBubbles, 0.5);

  return bubbles;
}


void heroColor(out vec4 col, vec2 p) {

  vec2 p2 = rotate(p, uSqueeze.x);
  float wedgeBox = sdRoundedBox(p2, vec2(0.5, 0.01), 0.2);

  vec2 pSmall = transform(p, vec2(0.0, 0.0), 0.0, 1.0);
  float wedgeCircle = sdCircle(pSmall, 0.4);


  pSmall = transform(p, vec2(0.0, 0.0), uSqueeze.x, 0.2);
  float hBox = sdRoundedBox(pSmall, vec2(0.2, 0.001), 0.1);

  pSmall = translate(pSmall, vec2(0.0, 0.1));
  float hCircle = sdCircle(pSmall, 0.01);


  float highlight = opBlend(hBox, hCircle,
                            uSqueeze.y);
  // highlight = hCircle;
  
  float wedge = opBlend(wedgeBox, wedgeCircle, 
                        uSqueeze.y);

  float hero = wedge;
  // hero = wedgeBox;

  col = mix(col, vec4(0.0, 1.0, 0.0, 1.0), 1.0-smoothstep(0.0, 0.1, abs(hero)));

  col = mix(col, vec4(1.0, 0.0, 0.0, 1.0), 1.0-smoothstep(0.0, 0.08, hero));

  col = mix(col, vec4(1.0, 1.0, 1.0, 1.0), 1.0-smoothstep(0.0, 0.18, highlight));

}

void wallColor(out vec4 col, vec2 p) {
  float wall = sdLine(p, vec2(0.0), vec2(-1.0));

  col = mix(col, vec4(1.0, 0.0, 1.0, 1.0), 1.0-smoothstep(0.0, 0.1,wall));
}

void sceneColor(out vec4 col, vec2 p) {

  heroColor(col, p);
  wallColor(col, p);
}


void main() {

  vec2 p = vQuadCoord;

  vec4 col = vec4(0.5, 0.5, 0.5, 0.0);

  sceneColor(col, p);

  outColor = col;
}
