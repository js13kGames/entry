import { Song } from '../SongGeneration'

import { createLeadTrack } from './VictorySong/Lead'
import { createPluckTrack } from './VictorySong/Pluck'
import { createBassTrack } from './VictorySong/Bass'

import { decibelsToAmplitude } from '../Utility'
import { createAudioBuffer } from '../SoundGeneration'

export default async function createSong () {
  const [
    bufferLead,
    bufferPluck,
    bufferBass,
  ] = await Promise.all([
    createLeadTrack,
    createPluckTrack,
    createBassTrack,
  ].map(func => createAudioBuffer(func)))

  return new Song(
    [
      { buffer: bufferLead, volume: decibelsToAmplitude(-10), sendToReverb: 0.5 },
      { buffer: bufferPluck, volume: decibelsToAmplitude(-16), sendToReverb: 0.5 },
      { buffer: bufferBass, volume: decibelsToAmplitude(-20) },
    ]
  )
}
