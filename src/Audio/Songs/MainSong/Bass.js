import { sampleCount, trackBeatCount, bpm } from './common'
import createBassSound from '../../MusicSamples/Bass'
import { setNoteLengths, addNotes, offsetNotes, repeatNotes } from '../../SongGeneration'

export function bassNotePattern1 (offset) {
  return offsetNotes([
    [0, -26],
    [2, -26],
    [3.5, -23],
    [4, -30],
    [6, -30],
    [8, -28],
    [9.5, -28],
    [10, -31],
    [11, -31],
    [12, -26],
    [13.5, -26],
    [14, -26],
    [15, -28],
    [15.5, -34],
    [16, -33],
    [18, -33],
    [19.5, -33],
    [20, -23],
    [21.5, -23],
    [22, -23],
    [23, -23],
    [24, -21],
    [25, -21],
    [26, -24],
    [27, -24],
    [27.5, -23],
    [28, -31],
    [29, -31],
    [30, -31],
    [31.5, -26],
    [32, -30],
    [33.5, -30],
    [34, -30],
    [36, -28],
    [37.5, -28],
    [38, -28],
    [40, -27],
    [41, -27],
    [42, -31],
    [43, -31],
    [44, -26],
    [45, -31],
    [46, -26],
  ], offset)
}

export const bassNotes = [
  ...bassNotePattern1(16),

  [64, -26],
  [66, -26],

  [68, -26],
  [70, -26],

  [72, -26],
  [74, -26],

  [76, -35],
  [78, -31],
  [80, -30],
  [82, -28],
  [84, -26],
  [86, -28],
  [88, -30],
  [90, -30],
  [92, -28],
  [94, -27],

  ...bassNotePattern1(96),

  ...offsetNotes(repeatNotes(-26, 0.5, 7), 144),
  [147.5, -23],
  ...offsetNotes(repeatNotes(-30, 0.5, 7), 148),
  [151.5, -26],
  ...offsetNotes(repeatNotes(-33, 0.5, 8), 152),
  ...offsetNotes(repeatNotes(-35, 0.5, 4), 156),
  ...offsetNotes(repeatNotes(-31, 0.5, 4), 158),
  ...offsetNotes(repeatNotes(-30, 0.5, 4), 160),
  ...offsetNotes(repeatNotes(-28, 0.5, 4), 162),
  ...offsetNotes(repeatNotes(-26, 0.5, 4), 164),
  ...offsetNotes(repeatNotes(-28, 0.5, 4), 166),
  ...offsetNotes(repeatNotes(-30, 0.5, 8), 168),
  ...offsetNotes(repeatNotes(-28, 0.5, 4), 172),
  ...offsetNotes(repeatNotes(-27, 0.5, 4), 174),
]

export function createBassTrack () {
  const output = new Float32Array(sampleCount)
  addNotes(setNoteLengths(bassNotes, trackBeatCount), output, createBassSound, bpm, true)

  return output
}
