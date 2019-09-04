// https://www.shadertoy.com/view/3llSz4
void vsprites(out vec4 col, vec2 p) {

  p.y += uTime * 0.001;

  vec4 col1 = vec4(255., 255., 0., 1.0);
  vec4 col2 = vec4(0., 255., 255., 1.0);
  vec4 col3 = vec4(255., 0., 180., 1.0);

  float d = mod(floor(p.y * 8.0), 3.0);

  if (d == 0.0) {
    col = col1;
  } else if (d == 1.0) {
    col = col2;
  } else {
    col = col3;
  }

}


// https://www.shadertoy.com/view/3tj3Rw
void hsprites(out vec4 col, vec2 p) {

  float res = 2.0;

  float t= uTime * 0.005;
  t += sin(t) + 1.0;
  float offset = t * .5;
  // offset *= ceil(p.y * res) * .25;

  float flip = round(fract(p.y));
  p.x += (flip-.5) * offset;

  vec2 u = p * res;

  int i = int(ceil(u.x) + ceil(u.y));

  float k = 0.0;

  if (i % 6 == 0) {
    k += 1.0;
  }

  vec4 front = vec4(1.0, 1.0, 0.3, 1.0),
    back = vec4(0.2, 0.1, 0.2, 1.0);

  col = mix(front, back, clamp(k, 0.0, 1.0));
}

// https://www.shadertoy.com/view/tdjXWW
float sdHalfCircle(vec2 p) {
  p *= 0.7;
  p.y += floor(p.y);
  return sdCircle(p, 0.2);
}

void colHalfCircle(out vec4 col, vec2 p) {
  float d = sdHalfCircle(p);

  col = colYellow;

  col = mix(col, colBlack, 1.0 - smoothstep(0.0, 0.01, d));
}


// https://www.shadertoy.com/view/ldyyzV
void colPulsingRotations(out vec4 col, vec2 p) {

  float area = 1.2;
  float size = 0.03;

  float dist = length(p);

  float way = 0.0;

  float max = 28.0;

  float speed = sin(uTime * 0.001);

  if (dist <= area + size) {

    for (float i = 0.0; i < max; i++) {
      float radius = area - size * 2.0 * i;
      float angle = speed * (i + 1.0);
      if (dist > radius && dist < radius + size &&
          sin(angle) * p.x + cos(angle) * p.y > 0.0) {
        way = //smoothstep(radius, radius + size / 4.5, dist); //*
          smoothstep(radius + size, radius + size / 1.2, dist);
      }
    }
  }


  col = mix(colBlue, colWhite, way);
  
}

// https://www.shadertoy.com/view/4lVXzK
void colGlowyCircle(out vec4 col, vec2 p) {

  float timer = usin(uTime * 0.005);

  float radius = 2.0/timer;

  float ring = length(p)*4.0 - radius;
  ring = min(3.0, abs(1.0/(10.0*ring)));
  ring = max(0.0, ring-timer);
    

  col = vec4(ring * 0.3, ring+ 0.05, ring - 0.05, 1.0);
  
}
