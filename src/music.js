import * as TinyMusic from "tinymusic";

// create a new Web Audio API context
var ac = new AudioContext();

// set the playback tempo (120 beats per minute)
var tempo = 100;

export const when = ac.currentTime;
const bass = [
  "A2  e",
  "A2  e",
  "A2  e",
  "A2  e",
  "A2  e",
  "A2  e",
  "A2  e",
  "A2  e",
  "F2  e",
  "F2  e",
  "F2  e",
  "F2  e",
  "F2  e",
  "F2  e",
  "F2  e",
  "F2  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "G2  e",
  "G2  e",
  "G2  e",
  "G2  e",
  "G2  e",
  "G2  e",
  "G2  e",
  "G2  e",
];
const bass5th = [
  "E3  e",
  "E3  e",
  "E3  e",
  "E3  e",
  "E3  e",
  "E3  e",
  "E3  e",
  "E3  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "C3  e",
  "G2  e",
  "G2  e",
  "G2  e",
  "G2  e",
  "G2  e",
  "G2  e",
  "G2  e",
  "G2  e",
  "D3  e",
  "D3  e",
  "D3  e",
  "D3  e",
  "D3  e",
  "D3  e",
  "D3  e",
  "D3  e",
];
const lead = [
  "C4  e",
  "-  e",
  "-  e",
  "-  e",
  "-  e",
  "-  e",
  "A3  s",
  "B3   e",
  "A3   s",
  "C4   e",
  "-  e",
  "-  e",
  "-  e",
  "D4  e",
  "-  e",
  "-  e",
  "-  e",
  "E4  e",
  "-  e",
  "-  e",
  "-  s",
  "D4  s",
  "C4   e",
  "-  e",
  "-   e",
  "E4   e",
  "D4  e",
  "-  e",
  "-  e",
  "C4  s",
  "B3  e",
  "-  e",
  "-  e",
  "-  e",
  "-  s",
];

// create a new sequence
export const sequence = new TinyMusic.Sequence(ac, tempo, lead);
export const sequenceBase = new TinyMusic.Sequence(ac, tempo, bass);
export const sequenceBase5th = new TinyMusic.Sequence(ac, tempo, bass5th);

sequence.createCustomWave([-1, 0, 1, 0, -1, 0, 1]);
// adjust the levels so the bass and harmony aren't too loud
sequence.gain.gain.value = 0.7;
// apply EQ settings
sequence.mid.frequency.value = 800;
sequence.mid.gain.value = 3;

sequenceBase.smoothing = 0.4;
sequenceBase.gain.gain.value = 0.65;
sequenceBase.mid.gain.value = 3;
sequenceBase.bass.gain.value = 6;
sequenceBase.bass.frequency.value = 80;
sequenceBase.mid.gain.value = -6;
sequenceBase.mid.frequency.value = 500;
sequenceBase.treble.gain.value = -2;
sequenceBase.treble.frequency.value = 1400;
sequenceBase.createCustomWave([-0.8, 1, 0.8, 0.8, -0.8, -0.8, -1]);

sequenceBase5th.staccato = 0.8;
sequenceBase5th.smoothing = 0.9;
sequenceBase5th.gain.gain.value = 0.4;
sequenceBase5th.mid.gain.value = 3;
sequenceBase5th.bass.gain.value = 6;
sequenceBase5th.bass.frequency.value = 80;
sequenceBase5th.mid.gain.value = -6;
sequenceBase5th.mid.frequency.value = 500;
sequenceBase5th.treble.gain.value = -2;
sequenceBase5th.treble.frequency.value = 1400;
