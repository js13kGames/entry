import { Song } from '../SongGeneration'

import { createLeadTrack } from './MainSong/Lead'
import { createPluckTrack } from './MainSong/Pluck'
import { createBassTrack } from './MainSong/Bass'

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
      { buffer: bufferLead, sendToReverb: 0.5 },
      { buffer: bufferPluck, sendToReverb: 0.5 },
      { buffer: bufferBass },
    ],
    { start: loopStart }
  )
}
