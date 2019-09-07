export default function getControls(g) {
  const keyboard = g.keyboard;
  return {
    up: keyboard(38),
    down: keyboard(40),
    confirm: keyboard(13), // enter
    C4: keyboard(65),
    ['C#4']: keyboard(87),
    D4: keyboard(83),
    ['D#4']: keyboard(69),
    E4: keyboard(68),
    F4: keyboard(70),
    ['F#4']: keyboard(84),
    G4: keyboard(71),
    ['G#4']: keyboard(89),
    A4: keyboard(72),
    ['A#4']: keyboard(85),
    B4: keyboard(74),
    C5: keyboard(75),
  }
};