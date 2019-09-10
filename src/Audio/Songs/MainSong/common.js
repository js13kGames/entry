import { contextSampleRate } from '../../Context'

export const bpm = 132
export const trackBeatCount = (12 + 12 + 8 + 12 + 12 + 8) * 4
export const sampleCount = Math.ceil(trackBeatCount * 60 * contextSampleRate / bpm)

export const sidechainCurve = [
  [0, 0.4, 2],
  [0.5, 0.95],
  [1, 1],
]

export const partPositions = [
  0,
  0|(12 * 4 * 60 * contextSampleRate / bpm),
  0|(24 * 4 * 60 * contextSampleRate / bpm),
  0|(32 * 4 * 60 * contextSampleRate / bpm),
  0|(44 * 4 * 60 * contextSampleRate / bpm),
  0|(56 * 4 * 60 * contextSampleRate / bpm),
]
