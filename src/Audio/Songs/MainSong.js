import { Song } from '../SongGeneration'

import { createLeadTrack } from './MainSong/Lead'
import { createPluckTrack } from './MainSong/Pluck'
import { createBassTrack } from './MainSong/Bass'

import { decibelsToAmplitude } from '../Utility'
import { createAudioBuffer } from '../SoundGeneration'
import { loopStart } from './MainSong/common'

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
      { buffer: bufferLead, volume: decibelsToAmplitude(-16), sendToReverb: 0.25 },
      { buffer: bufferPluck, volume: decibelsToAmplitude(-20), sendToReverb: 0.5 },
      { buffer: bufferBass, volume: decibelsToAmplitude(-20) },
    ],
    { start: loopStart }
  )
}
