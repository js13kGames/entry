import { TheAudioContext } from '../Context'
import { Song, createBuffer } from '../SongGeneration'

import { createMainTrack } from './VictorySong/Main'
import { createBassTrack } from './VictorySong/Bass'

import { decibelsToAmplitude } from '../Utility'

export default async function createSong () {
  const bpm = 120
  const trackBeatCount = 3 * 4
  const sampleCount = trackBeatCount * 60 * TheAudioContext.sampleRate / bpm

  const [
    bufferLead,
    bufferBass,
  ] = await Promise.all([
    createMainTrack,
    createBassTrack,
  ].map(func => createBuffer(func, sampleCount, bpm)))

  return new Song(
    [
      { buffer: bufferLead, volume: decibelsToAmplitude(-20), sendToReverb: 1 },
      { buffer: bufferBass, volume: decibelsToAmplitude(-14) },
    ],
    false
  )
}
