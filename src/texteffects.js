import text from './text';

import * as u from './util';

export function jump(o, g) {
  o = { ...defaults(), ...o };


  let jumpX = -o.jump * easing(linear(o.t * 10));
  let gapX = easing(linear(o.t * 10)) * 4;

  return text({ text: o.text,
         hspacing: gapX + 2,
         x: o.x,
         y: o.y + jumpX,
         ...o.s
       }, g);
}

const colors = [
  ,3,4,5,6,7
];

export function wave(o, g) {
  o = { ...defaults(), ...o };

  const letters = o.text.split('');

  const gap = 10,
        moveX = 1;

  return letters.reduce((s, _, i) => {

    const deltaX = u.sinh(o.t) + moveX;

    const x = s.ex + gap,
          y = o.y + u.sinh(i * 0.2 + o.t) * o.jump;

    text({ text: _,
           x: x + 2,
           y: y + 2 + moveX - deltaX,
           ...{...o.s, color: 41 } }, g);

    return text({ text: _,
                  x: x + deltaX,
                  y,
                  ...{...o.s, color: colors[Math.floor(linear(y) * (colors.length - 1))] } }, g);
  }, text({ text: letters[0],
            x: o.x, 
            y: o.y,
            render: false 
          }));
  
}

function defaults() {
  return {
    text: '',
    hspacing: 10,
    x: 0,
    y: 0,
    t: 0,
    jump: 20,
    s: {}
  };
};

const linear = (() => {
  const res = [];
  for (let i = 0; i < 100; i++) {
    res.push(i / 100);
  }
  for (let i = 100; i > 0; i--) {
    res.push(i / 100);
  }
    

  return t => res[Math.round(t) % res.length];
})();

const easing = t => {
  return .04 * t / (--t) * Math.sin(25 * t);
};
