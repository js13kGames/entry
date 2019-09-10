import { addNotes, applyRepeatingEnvelope, createTempBuffer } from '../../SongGeneration'
import { highPassFilter } from '../../SoundGeneration'
import createBassSound from '../../MusicSamples/Bass'
import { sidechainCurve, partPositions, bpm, sampleCount } from './common'

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

export const notesBlock1 = [
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

export const notesBlock2 = [
  [0, -26],
  [2, -26],
  [4, -30],
  [6, -30],
  [8, -33],
  [10, -33],
  [12, -35],
  [14, -31],
  [16, -30],
  [18, -28],
  [20, -26],
  [22, -28],
  [24, -30],
  [26, -30],
  [28, -28],
  [30, -27],
]

export function createBassTrack () {
  const output = new Float32Array(sampleCount)

  function createPart1 () {
    const buffer = createTempBuffer(12 * 4, bpm)
    addNotes(notesBlock1, buffer, createBassSound, bpm, true)
    return applyRepeatingEnvelope(highPassFilter(buffer, 20), sidechainCurve, bpm)
  }

  function createPart2 () {
    const buffer = createTempBuffer(8 * 4, bpm)
    addNotes(notesBlock2, buffer, createBassSound, bpm, true)
    return applyRepeatingEnvelope(highPassFilter(buffer, 20), sidechainCurve, bpm)
  }

  const part1 = createPart1()
  const part2 = createPart2()

  output.set(part1, partPositions[0])
  output.set(part1, partPositions[1])
  output.set(part2, partPositions[2])
  output.set(part1, partPositions[3])
  output.set(part1, partPositions[4])
  output.set(part2, partPositions[5])

  return output
}
