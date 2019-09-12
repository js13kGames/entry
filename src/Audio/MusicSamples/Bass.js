import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
} from '../SoundGeneration'
import { EnvelopeSampler } from '../../utils'

const shapeEnvelope = [
  [0, 1, 3],
  [0.25, 0, 1/3],
  [0.5, -1, 3],
  [0.75, 0, 1/3],
  [1, 1]
]

export default function createBassSound (frequency, length) {
  const oneMs = 1 / (1000 * length)

  const volumeSmoother = [
    [0, 0, 2],
    [2 * oneMs, 1, 20],
    [1 - 2 * oneMs, 0.5],
    [1, 0]
  ]

  const volumeEnvelope = [
    [0, 0.1],
    [1, 0.1 * Math.max(0, 1 - length / 3)]
  ]

  const pitchEnvelope = [
    [0, 7, 2],
    [15 * oneMs, 0]
  ]

  let p = 0
  let pitchSampler = new EnvelopeSampler(pitchEnvelope)
  let sampler = new EnvelopeSampler(shapeEnvelope)

  function getSample (t) {
    p += getFrequencyDelta(frequency * 2 ** (pitchSampler.sample(t) / 12))
    if (p > 1) {
      p -= 1
      sampler.reset()
    }
    return sampler.sample(p)
  }

  return applyEnvelope(applyEnvelope(generateSound(length, getSample), volumeEnvelope), volumeSmoother)
}
