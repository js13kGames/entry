const uid = ((id) =>
  () => ++id
)(0);
const ceil = Math.ceil;
const floor = Math.floor;
const random = Math.random;

const addEventListener = (target, event, handler) => {
  target.addEventListener(event, handler);
  return () => target.removeEventListener(event, handler);
}