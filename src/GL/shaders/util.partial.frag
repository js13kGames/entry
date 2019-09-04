float usin(float v) {
  return (sin(v) + 1.0) / 2.0;
}

float sdEquilateralTriangle( in vec2 p ) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - 1.0;
  p.y = p.y + 1.0/k;
  if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
  p.x -= clamp( p.x, -2.0, 0.0 );
  return -length(p)*sign(p.y);
}

float sdLine( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float sdBox( in vec2 p, in vec2 b )
{
  vec2 d = abs(p)-b;
  return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

float sdRoundedBox(vec2 p, vec2 b, float r )
{
  return sdBox(p, b) - r;
}

float opBlend(float d1, float d2, float a)
{
 return a * d1 + (1.0 - a) * d2;
}

float opUnion(float d1, float d2) {
  return min(d1, d2);
}

float opSubtraction(float d1, float d2) {
  return max(-d1, d2);
}

float opIntersection(float d1, float d2) {
  return max(d1, d2);
}

vec2 opRep(vec2 p, vec2 c)
{
  vec2 q = mod(p,c)-0.5*c;
  return q;
}

// vec2 screenToWorld(vec2 screen) {
//   vec2 result = 2.0 * (screen/uResolution.xy - 0.5);
//   result.x *= uResolution.x/uResolution.y;
//   return result;
// }

// vec2 screenToWorld2(vec2 screen) {
//   screen.x *= uResolution.x/uResolution.y;
//   return screen;
// }

mat3 affineMatrix(vec2 translation, float rotation, float scale) {
  return mat3(scale * cos(rotation), -sin(rotation), 0.0,
              sin(rotation), scale * cos(rotation), 0.0,
              translation.x, translation.y, 1.0);
}

vec2 transform(vec2 p, vec2 trans, float rotate, float scale) {
  return (-inverse(affineMatrix(trans, rotate, scale)) * vec3(p, 1.0)).xy;
}


vec2 translate(vec2 p, vec2 trans) {
  return transform(p, trans, 0.0, 1.0);
}

vec2 rotate(vec2 p, float angle) {
  return transform(p, vec2(0.0), angle, 1.0);
}
