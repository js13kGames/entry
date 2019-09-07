import { addNotes, offsetNotes } from '../../SongGeneration'
import createBassSound from '../../MusicSamples/Bass'
import { highPassFilter } from '../../SoundGeneration'

export function createBassTrack (output, bpm) {
  addNotes([
    ...offsetNotes([
      [0, -30],
      [1, -30],
      [1.333, -30],
      [1.667, -30],
      [2, -28],
      [3, -28],
      [3.667, -28],
      [4, -26],
    ], 0.333)
  ], output, createBassSound, bpm, true)

  highPassFilter(output, 20)
}
