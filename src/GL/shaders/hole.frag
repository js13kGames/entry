#version 300 es

#include fdefs

precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;

uniform vec2 uPos;
uniform float uImpact;

in vec2 vQuadCoord;

out vec4 outColor;

#include futil


// https://stackoverflow.com/questions/57615117/how-to-wrap-space-to-make-a-black-hole-using-uv-textures-in-webgl/57615510?noredirect=1#comment101686369_57615510
void main() {

  vec2 vQ = vQuadCoord * 2.0 - 1.0;
  // vQ = sign(vQ) * (1.0 - (1.0 - abs(vQ)) * (1.0 - abs(vQ)));

  
  // vQ = normalize(vQ) * (1.0 - (1.0 - length(vQ)) * (1.0 - length(vQ)));

  vQ += uPos;

  vec2 vIn = normalize(vQ) * (1.0 - (1.0 - length(vQ)) * (1.0 - length(vQ)));

  vec2 vOut = normalize(vQ) * length(vQ) * length(vQ);

  float impact = uImpact;

  vQ = mix(vIn, vOut, impact);
;    

  vec2 holeCoord = vQ * 0.5 + 0.5;

  vec4 tColor = texture(uTexture, holeCoord);

  tColor.a *= 0.2;

  vec4 white = mix(tColor, vec4(0.5, 0.5, 0.5, 0.2), 0.5);
  vec4 black = mix(tColor, vec4(0.0, 0.0, 0.0, 0.2), 0.5);

  float maxDist = max(abs(vQ.x), abs(vQ.y));
  float circular = length(vQ);
  float square = maxDist;
  
  outColor = mix(white, black, mix(circular, square, maxDist));

  outColor = mix(outColor, vec4(0.0, 0.0, 0.0, 1.0), 
                 1.0 - smoothstep(0.0, 0.4, abs(impact - 0.5)));
}
