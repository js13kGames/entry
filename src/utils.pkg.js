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
const noop = () => null;