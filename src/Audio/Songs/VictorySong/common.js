import { contextSampleRate } from '../../Context'

export const bpm = 120
export const trackBeatCount = 3 * 4
export const sampleCount = Math.ceil(trackBeatCount * 60 * contextSampleRate / bpm)
