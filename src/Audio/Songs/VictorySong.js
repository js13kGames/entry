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
      { buffer: bufferLead, sendToReverb: 0.25 },
      { buffer: bufferPluck, sendToReverb: 0.5 },
      { buffer: bufferBass },
    ]
  )
}
