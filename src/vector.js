export function vec3(x, y = x, z = x) {
  return [x, y, z];
}

export function add(v1, v2) {
  return [v1[0] + v2[0],
          v1[1] + v2[1],
          v1[2] + v2[2]];
}

export function scale(v1, s) {
  return [v1[0] * s,
          v1[1] * s,
          v1[2] * s];
};

export function inverse(v) {
  return scale(v, -1);
};

export function addScale(v1, v2, s) {
  return add(v1, scale(v2, s));
}

export function copy(v) {
  return [v[0], v[1], v[2]];
}
