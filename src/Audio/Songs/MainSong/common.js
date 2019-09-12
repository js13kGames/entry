import { contextSampleRate } from '../../Context'

export const bpm = 132
export const trackBeatCount = 44 * 4
export const trackDuration = trackBeatCount * 60 / bpm
export const sampleCount = Math.ceil(trackDuration * contextSampleRate)

export const introBeatCount = 16

export const loopStart = introBeatCount * 60 / bpm
