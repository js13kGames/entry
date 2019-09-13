import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  lowPassFilter,
  sampleSquare,
  samplePulse,
} from '../SoundGeneration'
import { contextSampleRate } from '../Context'
const volumeEnvelope = [
  [0, 0],
  [0.001, 0.12, 0.35],
  [0.04, 0.02, 0.3],
  [1, 0, 1],
]

export default function createLeadSound (frequency) {
  const length = 4

  const filterEnvelope = [
    [0, Math.min(contextSampleRate / 2, frequency * 18), 0.5],
    [1, frequency / 3]
  ]

  let p = Math.random()

  function getSample (t) {
    p += getFrequencyDelta(frequency)
    return sampleSquare(p) * 0.4 + samplePulse(p * 2, 0.55) * 0.4
  }

  return lowPassFilter(applyEnvelope(generateSound(length, getSample), volumeEnvelope), filterEnvelope, 1)
}
