import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  lowPassFilter,
  sampleSquare,
} from '../SoundGeneration'
import { contextSampleRate } from '../Context'
const volumeEnvelope = [
  [0, 0.6, 0.35],
  [0.03, 0.1, 0.3],
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
    return sampleSquare(p)
  }

  return lowPassFilter(applyEnvelope(generateSound(length, getSample), volumeEnvelope), filterEnvelope, 1)
}
