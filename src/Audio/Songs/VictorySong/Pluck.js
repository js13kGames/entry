import { addNotes, offsetNotes, addOctave } from '../../SongGeneration'
import createPluckSound from '../../MusicSamples/Pluck'
import { bpm, sampleCount, introBeatCount } from './common'

export function createPluckTrack () {
  const output = new Float32Array(sampleCount)

  const mainNotes = [
    ...addOctave([
      [0, -18],
      [1, -18],
      [1.333, -18],
      [1.667, -18],
      [2, -16],
      [3, -16],
      [3.667, -16],
      [4, -14],
      [8, -14],
      [9, -16],
      [10, -17],
      [11, -19],
    ]),
    [4.333, 5],
    [4.667, 10],
    [5, 14],
    [5.333, 10]
  ]

  addNotes(offsetNotes(mainNotes, introBeatCount), output, createPluckSound, bpm)

  return output
}
