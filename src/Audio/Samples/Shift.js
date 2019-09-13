import { generateSound, bandPassFilter, applyEnvelope, sampleNoise } from '../SoundGeneration'

export function createShiftSound () {
  const volumeEnvelope = [
    [0, 0.1, 0.2],
    [1, 0]
  ]

  return bandPassFilter(
    applyEnvelope(generateSound(0.1, sampleNoise), volumeEnvelope),
    2000,
  )
}
