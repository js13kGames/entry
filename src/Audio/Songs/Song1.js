import { TheAudioContext } from '../Context'
import { Song, createChannel } from '../SongGeneration'

import { createLeadTrack } from './Song1/Lead'

import { decibelsToAmplitude } from '../Utility'

export default async function createSong () {
  const bpm = 132
  const trackBeatCount = 12 * 4
  const sampleCount = trackBeatCount * 60 * TheAudioContext.sampleRate / bpm

  const [
    channelLead,
  ] = await Promise.all([
    createLeadTrack,
  ].map(func => createChannel(func, sampleCount, bpm)))

  return new Song(
    [
      { source: channelLead, volume: decibelsToAmplitude(-20), sendToReverb: 1 },
    ]
  )
}
