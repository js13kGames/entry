import { generateSound, bandPassFilter, applyEnvelope, sampleNoise } from '../SoundGeneration'

export function createHardDropSound () {
  const volumeEnvelope = [
    [0, 0.5, 0.2],
    [1, 0]
  ]

  return bandPassFilter(
    applyEnvelope(generateSound(0.2, sampleNoise), volumeEnvelope),
    2000,
  )
}
