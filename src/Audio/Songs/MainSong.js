import { TheAudioContext } from '../Context'
import { Song, createBuffer } from '../SongGeneration'

import { createLeadTrack } from './MainSong/Lead'

import { decibelsToAmplitude } from '../Utility'

export default async function createSong () {
  const bpm = 132
  const trackBeatCount = 12 * 4
  const sampleCount = trackBeatCount * 60 * TheAudioContext.sampleRate / bpm

  const [
    bufferLead,
  ] = await Promise.all([
    createLeadTrack,
  ].map(func => createBuffer(func, sampleCount, bpm)))

  return new Song(
    [
      { buffer: bufferLead, volume: decibelsToAmplitude(-20), sendToReverb: 1 },
    ]
  )
}
