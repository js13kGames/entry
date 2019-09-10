import { addNotes, offsetNotes, addOctave } from '../../SongGeneration'
import createLeadSound from '../../MusicSamples/Lead'
import { bpm, sampleCount } from './common'

export function createMainTrack () {
  const output = new Float32Array(sampleCount)

  const mainNotes = [
    [0, -2],
    [1, -2],
    [1.333, -2],
    [1.667, -2],
    [2, 0],
    [2.5, 0],
    [2.667, -4],
    [2.833, -9],
    [3, 0],
    [3.667, 3],
    [4, 5],
    [4, 10],
    [4.333, -7],
    [4.667, -2],
    [5, 2],
    [5, 5],
    [5, 10],
    [5.333, -2],
    [5.667, 2],
    [5.833, 3],
    [6, 5],

    ...addOctave([
      [0, -30],
      [1, -30],
      [1.333, -30],
      [1.667, -30],
      [2, -28],
      [3, -28],
      [3.667, -28],
      [4, -26],
    ]),
  ]
  addNotes([
    [0, -6],
    [0.167, -4],
    ...offsetNotes(mainNotes, 0.333)
  ], output, createLeadSound, bpm)

  return output
}
