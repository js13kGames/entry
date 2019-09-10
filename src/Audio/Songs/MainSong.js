import { Song } from '../SongGeneration'

import { createBassTrack } from './MainSong/Bass'
import { createLeadTrack } from './MainSong/Lead'

import { decibelsToAmplitude } from '../Utility'
import { createAudioBuffer } from '../SoundGeneration'

export default async function createSong () {
  const [
    bufferLead,
    bufferBass,
  ] = await Promise.all([
    createLeadTrack,
    createBassTrack,
  ].map(func => createAudioBuffer(func)))

  return new Song(
    [
      { buffer: bufferLead, volume: decibelsToAmplitude(-200), sendToReverb: 0.5 },
      { buffer: bufferBass, volume: decibelsToAmplitude(-400) }
    ]
  )
}
