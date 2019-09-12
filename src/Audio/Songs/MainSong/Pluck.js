import { sampleCount, bpm } from './common'
import { addNotes, offsetNotes } from '../../SongGeneration'
import createPluckSound from '../../MusicSamples/Pluck'
import { bassNotes } from './Bass'

export function createPluckTrack () {
  const output = new Float32Array(sampleCount)

  function offbeat(notes, offset, count = 4) {
    const result = []
    for (let i = 0; i < count; i++) {
      notes.forEach(note => result.push([offset + 0.5 + i, note]))
    }
    return result
  }

  function graceNotes () {
    return [
      [3.5, 10],
      [3.667, 12],
      [3.833, 13]
    ]
  }

  const intro = [
    [0, -14],
    [2, -14],
    [3.5, -14],
    [4, -18],
    [6, -18],
    [8, -16],
    [9.5, -16],
    [10, -19],
    [11, -19],
    [12, -14],
    [13, -19],
    [14, -26],
    ...offbeat([-7, -2], 0),
    ...offbeat([-11, -7], 4),
    ...offbeat([-12, -9], 8),
    ...offbeat([-11, -7], 12, 2),
  ]

  function part1 (offset) {
    return offsetNotes([
      ...offbeat([-7, -2], 0),
      ...offbeat([-11, -7], 4),
      ...offbeat([-12, -9], 8),
      ...offbeat([-11, -7], 12),

      ...offbeat([-14, -9], 16),
      ...offbeat([-7, -4], 20),
      ...offbeat([-6, -2], 24),

      [28.5, -7],
      [29, -2],
      [29.5, -7],
      [30.5, -7],
      [31, -7],
      [31, -3],
      [31.5, -3],
      [31.5, 0],

      ...offbeat([-6, -2, 1], 32),
      ...offbeat([-4, 0, 3], 36),
      ...offbeat([-3, 0, 3], 40, 2),
      ...offbeat([-3, 1, 5], 42, 2),

      [44, 1],
      [44, 5],
      [45, -3],
      [45, 0],
      [46, -7],
    ], offset)
  }

  function part2 (offset) {
    return offsetNotes([
      [1, -7], [1, -2],
      [3, -7], [3, -2],

      [5, -6], [5, -2],
      [7, -6], [7, -2],

      [9, -6], [9, -2],
      [11, -6], [11, -2],

      [13, -4], [13, 0],
      [15, -4], [15, 0],

      [17, -2], [17, 1],
      [19, 0], [19, 3],

      [21, 1], [21, 5],
      [23, 0], [23, 3],

      [25, -2], [25, 1],
      [27, -2], [27, 1],

      [29, -4], [29, 1], [29, 5],
      [31, -3], [31, 0], [31, 5],
    ], offset)
  }

  addNotes([
    ...intro,

    ...offsetNotes(graceNotes(), 3 * 4),
    ...offsetNotes(graceNotes(), 23 * 4),
    ...offsetNotes(graceNotes(), 26 * 4 + 2),
    ...offsetNotes(graceNotes(), 35 * 4),
    ...offsetNotes(graceNotes(), 43 * 4),

    ...bassNotes,

    ...part1(16),

    ...part2(64),

    ...part1(96),

    [110, 12],
    [110.5, 8],
    [111, 10],
    [111.25, 5],
    [111.75, 6],

    ...part2(144)

  ], output, createPluckSound, bpm)

  return output
}
