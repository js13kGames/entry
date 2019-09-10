import { contextSampleRate } from '../Context'
import { Song, createBuffer } from '../SongGeneration'

import { createMainTrack } from './VictorySong/Main'
import { createBassTrack } from './VictorySong/Bass'

import { decibelsToAmplitude } from '../Utility'
import { createAudioBuffer } from '../SoundGeneration'

export default async function createSong () {
  const [
    bufferLead,
    bufferBass,
  ] = await Promise.all([
    createMainTrack,
    createBassTrack,
  ].map(func => createAudioBuffer(func)))

  return new Song(
    [
      { buffer: bufferLead, volume: decibelsToAmplitude(-26), sendToReverb: 0.5 },
      { buffer: bufferBass, volume: decibelsToAmplitude(-24) },
    ],
    false
  )
}
