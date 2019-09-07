import { generateSound, sampleSquare, getFrequencyDelta, applyEnvelope, lowPassFilter, samplePulse } from '../SoundGeneration'
import { getFrequencyForTone } from '../SongGeneration';

export function createLineClearSoundFactory (tones, length)  {
  return () => {
    let phase = 0

    function sample (pos) {
      const toneIndex = Math.floor(pos * tones.length)
      const freq = getFrequencyForTone(tones[toneIndex])
      phase += getFrequencyDelta(freq)
      return samplePulse(phase, 0.5 - pos * 0.2)
    }

    let envelope = [
      [0, 0],
      [0.01 / length, 0.3, 0.5],
      [1 - 0.01 / length, 0.3, 0.5],
      [1, 0]
    ]
    return lowPassFilter(
      applyEnvelope(generateSound(length, sample), envelope),
      4200
    )
  }
}

export const createSingleLineSound = createLineClearSoundFactory(
  [ -2 ],
  0.1
)

export const createDoubleLineSound = createLineClearSoundFactory(
  [ -2, 5 ],
  0.2
)

export const createTripleLineSound = createLineClearSoundFactory(
  [ -2, 5, 10 ],
  0.3
)

export const createAllClearSound = createLineClearSoundFactory(
  [ 10, 17, 10, 17, 10, 5, 5, 8, 8 ],
  0.5
)

export const createFourLinesSound = createLineClearSoundFactory(
  [ -2, 5, -2, 10, 5, 10, 15, 10, 15, 17, 15, 17, 22 ],
  0.6
)
