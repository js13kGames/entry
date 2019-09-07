import { addNotes, applyRepeatingEnvelope } from '../../SongGeneration'
import createLeadSound from '../../MusicSamples/Lead'
import { notes as bassNotes } from './Bass'

export function createLeadTrack (output, bpm) {
  const leadLine = [
    [0, 5],
    [1, 1],
    [1.5, 0],
    [2, -2],
    [3, 1],
    [3.5, 0],
    [4, -2],
    [5.5, 1],
    [6, 5],
    [7, 3],
    [7.5, 1],
    [8, 0],
    [8.5, -2],
    [9, -4],
    [9.5, -7],
    [10, 3],
    [11, 5],
    [12, 1],
    [13, -2],
    [14, -4],
    [15, -7],
    [16, -6],
    [16.5, 3],
    [17.5, 6],
    [18, 10],
    [19, 8],
    [19.5, 6],
    [20, 5],
    [21.5, 1],
    [22, 5],
    [23, 1],
    [23.5, 0],
    [24, -2],
    [25.5, -7],
    [26, -2],
    [26.5, 1],
    [27, 5],
    [27.5, 3],
    [28, 1],
    [29, -2],
    [30 - 0.05, -3],
    [30 + 0.05, 0],
    [32.5, -2],
    [33.5, 1],
    [34, 5],
    [35, 10],
    [35.5, 8],
    [36, 5],
    [37.5, 1],
    [38, 5],
    [39, 3],
    [39.5, 1],
    [40, 0],
    [41, 1],
    [41.5, 3],
    [42, 5],
    [42.5, 0],
    [43, -2],
    [43.5, -3],
    [44, -2],
    [45, -7],
    [46, -14]
  ]

  addNotes([
    ...bassNotes,
    ...leadLine
  ], output, createLeadSound, bpm)

  applyRepeatingEnvelope(output, [
    [0, 0.15, 2],
    [0.5, 0.9],
    [0.999, 1],
    [1, 0],
  ], bpm)
}
