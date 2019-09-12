type EasingFn = (t: number) => number;

const easeInBack: EasingFn = (t: number): number => {
  const s: number = 1.70158;
  return (t) * t * ((s + 1) * t - s);
};

function* Interpolator(duration: number, easingFn: EasingFn = (t: number) => t): IterableIterator<number> {
  const start: number = yield 0;
  let now: number = start;
  while (now - start < duration) {
    const val: number = easingFn((now - start) / duration);
    now = yield val;
  }
  if (now - start >= duration) {
    return 1;
  }
}
