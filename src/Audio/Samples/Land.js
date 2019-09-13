import { generateSound, bandPassFilter, applyEnvelope, sampleNoise } from '../SoundGeneration'

export function createLandSound () {
  const volumeEnvelope = [
    [0, 0.3, 0.2],
    [1, 0]
  ]

  return bandPassFilter(
    applyEnvelope(generateSound(0.2, sampleNoise), volumeEnvelope),
    1800,
    2
  )
}
