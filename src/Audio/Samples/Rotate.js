import { generateSound, bandPassFilter, applyEnvelope, sampleNoise } from '../SoundGeneration'

export function createRotateSound () {
  const volumeEnvelope = [
    [0.0, 0.8, 0.2],
    [0.3, 0],
    [0.301, 0.7, 0.2],
    [0.5, 0],
    [0.501, 0.6, 0.2],
    [1.0, 0.0]
  ]

  return bandPassFilter(
    applyEnvelope(generateSound(0.1, sampleNoise), volumeEnvelope),
    1800,
    3
  )
}
