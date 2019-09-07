import { TheAudioContext } from '../Context'
import { Song, createBuffer } from '../SongGeneration'

import { createLeadTrack } from './MainSong/Lead'

import { decibelsToAmplitude } from '../Utility'
import { createBassTrack } from './MainSong/Bass'

export default async function createSong () {
  const bpm = 132
  const trackBeatCount = 12 * 4
  const sampleCount = trackBeatCount * 60 * TheAudioContext.sampleRate / bpm

  const [
    bufferLead,
    bufferBass,
  ] = await Promise.all([
    createLeadTrack,
    createBassTrack,
  ].map(func => createBuffer(func, sampleCount, bpm)))

  return new Song(
    [
      { buffer: bufferLead, volume: decibelsToAmplitude(-20), sendToReverb: 1 },
      { buffer: bufferBass, volume: decibelsToAmplitude(-14) },
    ]
  )
}
