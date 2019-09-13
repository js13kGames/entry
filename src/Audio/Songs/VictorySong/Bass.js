import { addNotes, offsetNotes, setNoteLengths } from '../../SongGeneration'
import createBassSound from '../../MusicSamples/Bass'
import { bpm, trackBeatCount, sampleCount, introBeatCount } from './common'
import { applyEnvelope } from '../../SoundGeneration'

export function createBassTrack () {
  const output = new Float32Array(sampleCount)

  const mainNotes = [
    [0, -30],
    [1, -30],
    [1.333, -30],
    [1.667, -30],
    [2, -28],
    [3, -28],
    [3.667, -28],
    [4, -26],
    [8, -26],
    [9, -28],
    [10, -29],
    [11, -31],
    [12.25, -26]
  ]

  addNotes(setNoteLengths(offsetNotes(mainNotes, introBeatCount), trackBeatCount), output, createBassSound, bpm, true)

  applyEnvelope(output, [
    [0, 1],
    [0.9, 1],
    [1, 0]
  ])

  return output
}
