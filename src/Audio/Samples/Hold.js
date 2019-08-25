import { generateSound, applyEnvelope, sampleEnvelope, getFrequencyDelta, sampleTriangle, sampleSawtooth, sampleSine, distort, bandPassFilter, sampleNoise } from '../SoundGeneration'
import { getFrequencyForTone } from '../SongGeneration';

export default function createHoldSound () {
  const volumeEnvelope = [
    [0, 0, 0.5],
    [0.1, 0.5, 0.2],
    [1, 0]
  ]

  const filterEnvelope = [
    [0, 2000, 0.2],
    [1, 800]
  ]

  return bandPassFilter(
    applyEnvelope(generateSound(0.2, sampleNoise), volumeEnvelope),
    filterEnvelope,
  )
}
