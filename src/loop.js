const perf = window.performance !== undefined ? window.performance : Date;

const now = () => perf.now();

const raf = window.requestAnimationFrame;

export default function Loop(fn) {

  let running = false,
      lastUpdate = now(),
      frame = 0;

  this.start = () => {
    if (running) {
      return this;
    }
    running = true;
    lastUpdate = now();
    frame = raf(tick);
    return this;
  };

  this.stop = () => {
    running = false;
    if (frame != 0) {
      raf.cancel(frame);
    }
    frame = 0;
    return this;
  };

  const tick = () => {
    frame = raf(tick);
    const time = now();
    const dt = time - lastUpdate;
    fn(dt);
    lastUpdate = time;
  };

}
