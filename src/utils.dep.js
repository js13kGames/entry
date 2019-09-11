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
const PI2 = Math.PI * 2;
const rAF = window.requestAnimationFrame;
const cancelAF = window.cancelAnimationFrame;
const noop = () => null;
const createProgressBar = (label) => {
  const wrap = createElement('div');
  const meter = createElement('div');
  const bar = createElement('span');
  const p = createElement('p');
  p.innerHTML = label;
  bar.classList.add('bar');
  meter.classList.add('progress');
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
const loadSVGs = (url) => Promise.all(url.map(url => new Promise(res => {
  const image = new Image();
  image.onload = () => res(image);
  image.src = url;
})));

// Only used in data transformation in gulp
svgDataURL = (svgMarkup, pre = '') => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(pre + svgMarkup);
window.svgDataURL = svgDataURL;
window.svgDataURL100 = svgMarkup => svgDataURL(svgMarkup, '<svg width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">');
window.svgDataURL150 = svgMarkup => svgDataURL(svgMarkup, '<svg width="150" height="100" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)">');