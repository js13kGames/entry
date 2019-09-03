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
const rAF = window.requestAnimationFrame;
const cancelAF = window.cancelAnimationFrame;
const noop = () => null;
const createProgressBar = (barId, label) => {
  const wrap = createElement('div');
  const meter = createElement('div');
  const bar = createElement('span');
  const p = createElement('p');
  p.innerHTML = label;
  bar.classList.add('bar');
  bar.classList.add(barId);
  bar.id = barId;
  meter.classList.add('progress');
  meter.classList.add(barId);
  wrap.classList.add('progress-box');
  meter.appendChild(bar);
  wrap.appendChild(meter);
  wrap.appendChild(p);
  return [wrap, bar];
}
const createCanvas = () => {
  const canvas = createElement('canvas');
  return [canvas, canvas.getContext('2d')];
}
