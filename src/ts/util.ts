interface Document {
  monetization: any;
}

function shuffle<T>(array: T[]): T[] {
  let currentIndex: number = array.length, temporaryValue: T, randomIndex: number;
  const arr: T[] = array.slice();
  while (0 !== currentIndex) {
    randomIndex = ~~(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }
  return arr;
}

function rand(min: number, max: number): number {
  return ~~(Math.random() * (max - min + 1)) + min;
}

function sum(...values: number[]): number {
  let result: number = 0;
  for (const value of values) {
    result += value;
  }
  return result;
}

function inside(pt: V2, topleft: V2, size: V2): boolean {
  return (pt.x > topleft.x && pt.x <= topleft.x + size.x && pt.y > topleft.y && pt.y <= topleft.y + size.y);
}

function colourToHex(a: number, b: number, g: number, r: number): number {
  let out: number = 0x0;
  out = ((out | (a & 0xff)) << 8) >>> 0;
  out = ((out | (b & 0xff)) << 8) >>> 0;
  out = ((out | (g & 0xff)) << 8) >>> 0;
  out = ((out | (r & 0xff))) >>> 0;
  return out;
}

const white: number = 0xFFFFFFFF;
const red: number = 0xFF3326BE;
const green: number = 0xFF1A8944;
const blue: number = 0xFF845700;
const gold: number = 0xFF32AAEB;
const brown: number = 0xFF2264A4;
