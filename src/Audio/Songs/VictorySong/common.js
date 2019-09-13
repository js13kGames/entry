import { contextSampleRate } from '../../Context'

export const introBeatCount = 0.333
export const bpm = 120
export const trackBeatCount = introBeatCount + 5 * 4
export const trackDuration = trackBeatCount * 60 / bpm
export const sampleCount = Math.ceil(trackDuration * contextSampleRate)
