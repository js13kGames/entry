import { addNotes, applyRepeatingEnvelope, createTempBuffer } from '../../SongGeneration'
import createLeadSound from '../../MusicSamples/Lead'
import { notesBlock1, notesBlock2 } from './Bass'
import { sumSounds } from '../../SoundGeneration'
import { sidechainCurve, partPositions, bpm, sampleCount } from './common'

export function createLeadTrack () {
  const output = new Float32Array(sampleCount)

  function createPart1Bass() {
    const buffer = createTempBuffer(12 * 4, bpm)
    addNotes(notesBlock1, buffer, createLeadSound, bpm)
    return buffer
  }

  function createPart2Bass() {
    const buffer = createTempBuffer(8 * 4, bpm)
    addNotes(notesBlock2, buffer, createLeadSound, bpm)
    return buffer
  }

  const part1Bass = createPart1Bass()
  const part2Bass = createPart2Bass()

  function createPartA () {
    const buffer = createTempBuffer(12 * 4, bpm)
    addNotes([
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
    ], buffer, createLeadSound, bpm)

    return applyRepeatingEnvelope(sumSounds([part1Bass, buffer]), sidechainCurve, bpm)
  }

  function createPartB () {
    const buffer = createTempBuffer(8 * 4, bpm)
    addNotes([
      [0, 5],
      [2, 1],
      [4, 3],
      [6, 0],
      [8, 1],
      [10, -2],
      [12, -4],
      [14, 0],
      [16, -6],
      [17.5, -2],
      [19, 1],
      [20, 3],
      [21, 1],
      [21.5, 0],
      [22, 1],
      [23, 0],
      [24, -6],
      [25.5, -2],
      [27, 1],
      [28, 3],
      [29, 1],
      [29.5, 0],
      [31, -7],
    ], buffer, createLeadSound, bpm)

    return applyRepeatingEnvelope(sumSounds([part2Bass, buffer]), sidechainCurve, bpm)
  }

  function createPartC () {
    const buffer = createTempBuffer(12 * 4, bpm)
    addNotes([
      [0, 5],
      [1, 1],
      [1.5, 0],
      [2, -2],
      [3, 1],
      [3.25, 0],
      [3.75, -2],

      [4.5, -2],
      [5.25, -2],
      [5.5, 1],
      [6, 5],
      [7, 3],
      [7.5, 1],

      [8, 0],
      [8.5, -2],
      [8.75, -4],
      [9.25, -7],
      [10, 3],
      [11, 5],

      [12, 1],
      [13, -2],
      [14, 0],
      [14.5, -4],
      [15, -2],
      [15.25, -7],
      [15.75, -6],

      [16.5, 3],
      [17.5, 6],
      [18, 10],
      [18.5, 10],
      [18.75, 8],
      [19.25, 6],
      [19.75, 5],

      [21.5, 1],
      [22, 5],
      [22.5, 5],
      [22.75, 1],
      [23.25, 0],
      [23.75, -2],

      [24.5, -2],
      [25.25, -2],
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
      [34.5, 5],
      [35, 10],
      [35.25, 8],
      [35.75, 5],

      [37.5, 1],
      [38, 5],
      [38.5, 5],
      [38.75, 3],
      [39.25, 1],
      [39.75, 0],

      [40.5, 0],
      [41, 1],
      [41.5, 3],
      [42, 5],
      [42.5, 0],
      [43, -2],
      [43.5, -3],

      [44, -2],
      [45, -7],
      [45.5, -6],
      [45.75, -7],
      [46, -14]
    ], buffer, createLeadSound, bpm)

    return applyRepeatingEnvelope(sumSounds([part1Bass, buffer]), sidechainCurve, bpm)
  }

  function createPartD () {
    const buffer = createTempBuffer(8 * 4, bpm)

    function pattern (offset, note1, note2) {
      return [
        [offset * 4, note1],
        [offset * 4 + 1.5, note1],
        [offset * 4 + 3, note2]
      ]
    }

    addNotes([
      [0, 5],
      [2, 1],

      [4, 3],
      [6, 0],

      [8, 1],
      [10, -2],

      [12, -4],
      [14, 0],

      [16, -6],
      [17.5, -2],
      [19, 1],

      [20, 3],
      [21, 1],
      [21.25, 0],
      [21.75, 1],
      [23, 0],

      [24, -6],
      [25.5, -2],
      [27, 1],

      [28, 3],
      [29, 1],
      [29.25, 0],
      [30, 0],
      [31, -7],

      ...pattern(0, 10, 10),
      ...pattern(1, 10, 10),
      ...pattern(2, 10, 10),
      ...pattern(3, 12, 12),
      ...pattern(4, 13, 13),
      ...pattern(5, 10, 12),
      ...pattern(6, 13, 13),
      ...pattern(7, 13, 12),

    ], buffer, createLeadSound, bpm)

    return applyRepeatingEnvelope(sumSounds([part2Bass, buffer]), sidechainCurve, bpm)
  }

  const partA = createPartA()
  const partB = createPartB()
  const partC = createPartC()
  const partD = createPartD()

  output.set(partA, partPositions[0])
  output.set(partA, partPositions[1])
  output.set(partB, partPositions[2])
  output.set(partC, partPositions[3])
  output.set(partC, partPositions[4])
  output.set(partD, partPositions[5])

  return output
}
