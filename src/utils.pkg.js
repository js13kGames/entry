const uid = ((id) =>
  () => ++id
)(0);
const ceil = Math.ceil;
const floor = Math.floor;
const random = Math.random;
const body = document.body;
const createElement = type => document.createElement(type);
const addEventListener = (target, event, handler) => {
  target.addEventListener(event, handler);
  return () => target.removeEventListener(event, handler);
}

function makeCancellable (p) {
  let isCancelled = false;
  const promise = new Promise((resolve, reject) => {
    p.then(
      res => !isCancelled && resolve(res),
      err => !isCancelled && reject(err)
    );
  });

  return {
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    cancel: () => { isCancelled = true; }
  };
}

function CancellablePromise (fn) {
  return makeCancellable(new Promise(fn));
}

const wait = (ms) => new CancellablePromise(res => setTimeout(res, ms * 1.5));
