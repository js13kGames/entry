import { TheAudioContext } from '../Context'
import { Song, createBuffer } from '../SongGeneration'

import { createMainTrack } from './VictorySong/Main'

import { decibelsToAmplitude } from '../Utility'

export default async function createSong () {
  const bpm = 120
  const trackBeatCount = 3 * 4
  const sampleCount = trackBeatCount * 60 * TheAudioContext.sampleRate / bpm

  const buffer = await createBuffer(createMainTrack, sampleCount, bpm)

  return new Song(
    [
      { buffer: buffer, volume: decibelsToAmplitude(-20), sendToReverb: 1 },
    ],
    false
  )
}
