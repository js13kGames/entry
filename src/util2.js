export function memoize(fn) {
  let cache = {};

  return function(arg) {
    const key = arg;

    if (!cache.hasOwnProperty(key)) {
      cache[key] = fn(arg);
    }
    return cache[key];
  };
}

export function memoize2(fn) {
  let cache = {};

  return function(a, b, c, d) {
    const key = `${a}-${b}-${c}-${d}`;

    if (!cache.hasOwnProperty(key)) {
      cache[key] = fn(a, b, c, d);
    }
    return cache[key];
  };
}

export function objForeach(obj, f) {
  Object.keys(obj).forEach(key => f(key, obj[key]));
};

export function objMap(obj, f) {
  return Object.keys(obj).reduce((acc, _) => ({
    [_]: f(_, obj[_]),
    ...acc }), {});
};

export function objFilter(obj, filter) {
  const res = {};
  for (let key of Object.keys(obj)) {
    if (filter(key, obj[key])) {
      res[key] = obj[key];
    }
  }
  return res;
}

export function objFind(obj, p) {
  return Object.keys(obj).find(key => p(key, obj[key]));
}
