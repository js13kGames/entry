import { generateSound, bandPassFilter, applyEnvelope, sampleNoise } from '../SoundGeneration'

export function createLockSound () {
  const volumeEnvelope = [
    [0, 0, 0.5],
    [0.1, 0.3, 0.2],
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
