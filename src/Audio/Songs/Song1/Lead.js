import { addNotes } from '../../SongGeneration';
import createLeadSound from '../../MusicSamples/Lead';
import { highPassFilter } from '../../SoundGeneration';

export function createLeadTrack (output, bpm) {
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
  const bassLine = [
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

  const leadLine = [
    [0, 5],
    [1, 0],
    [1.5, 1],
    [2, 3],
    [3, 1],
    [3.5, 0],
    [4, -2],
    [5.5, 1],
    [6, 5],
    [7, 3],
    [7.5, 1],
    [8, 0],
    [9.5, 1],
    [10, 3],
    [11, 5],
    [12, 1],
    [13, -2],
    [14, -2],
    [16.5, 3],
    [17.5, 6],
    [18, 10],
    [19, 8],
    [19.5, 6],
    [20, 5],
    [21.5, 1],
    [22, 5],
    [23, 3],
    [23.5, 1],
    [24, 0],
    [25.5, 1],
    [26, 3],
    [27, 5],
    [28, 1],
    [29, -2],
    [30, 0],
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
    ...bassLine,
    ...leadLine
  ], output, createLeadSound, bpm)

  highPassFilter(output, 500)
}
