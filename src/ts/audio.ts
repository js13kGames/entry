/// <reference path="./zzfx.d.ts" />

const healSound: () => void = () => { zzfx(1, .1, 40, .3, .3, .3, 0, 9.5, .45); };
const getSound: () => void = () => { zzfx(1, .1, 475, .1, .1, 7.3, .4, 5.9, .9); };
const dmgSound: () => void = () => { zzfx(1, .1, 1000, .2, .15, .3, 3, 1, 0); };
const defSound: () => void = () => { zzfx(1, .1, 10000, .2, .07, .9, .8, 0, .28); };
