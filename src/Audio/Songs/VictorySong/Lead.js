import { addNotes, offsetNotes } from '../../SongGeneration'
import createLeadSound from '../../MusicSamples/Lead'
import { bpm, sampleCount, introBeatCount } from './common'

export function createLeadTrack () {
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
    [5, 5],
    [5, 10],
    [5.667, 2],
    [5.833, 3],
    [6, 5],
    [7.667, 2],
    [7.833, 3],
    [8, 5],
    [8.333, 10],
    [8.667, 8],
    [9, 5],
    [9.667, 3],
    [10, 5],
    [10.333, 3],
    [10.667, 5],
    [11, 2],
    [11.667, -4],
    [12, -14],
    [12.167, -7],
    [12.25, -2],
    [12.333, 0],
    [12.5, 2]
  ]

  addNotes([
    [0, -6],
    [0.167, -4],
    ...offsetNotes(mainNotes, introBeatCount)
  ], output, createLeadSound, bpm)

  return output
}
