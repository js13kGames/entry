import { addNotes, applyRepeatingEnvelope } from '../../SongGeneration'
import { highPassFilter } from '../../SoundGeneration'
import createBassSound from '../../MusicSamples/Bass'

function pattern1 (offset, note) {
  return [
    [offset * 4, note],
    [offset * 4 + 1.5, note],
    [offset * 4 + 3, note]
  ]
}
function pattern2 (offset, note1, note2) {
  return [
    [offset * 4, note1],
    [offset * 4 + 1.5, note1],
    [offset * 4 + 2, note2],
    [offset * 4 + 3, note2]
  ]
}
export const notes = [
  ...pattern1(0, -26),
  ...pattern1(1, -30),
  ...pattern2(2, -28, -31),
  ...pattern1(3, -26),
  ...pattern1(4, -33),
  ...pattern1(5, -23),
  ...pattern2(6, -21, -24),
  [7 * 4, -31],
  [7 * 4 + 1, -31],
  [7 * 4 + 2, -31],
  ...pattern1(8, -30),
  ...pattern1(9, -28),
  ...pattern2(10, -27, -31),
  [11 * 4, -26],
  [11 * 4 + 1, -31],
  [11 * 4 + 2, -38],
]

export function createBassTrack (output, bpm) {
  addNotes(notes, output, createBassSound, bpm, true)

  highPassFilter(output, 20)

  applyRepeatingEnvelope(output, [
    [0, 0.15, 2],
    [0.5, 0.9],
    [0.999, 1],
    [1, 0],
  ], bpm)
}
