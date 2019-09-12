import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  lowPassFilter,
  sampleSquare,
} from '../SoundGeneration'

const volumeEnvelope = [
  [0, 0, 1],
  [0.005, 0.4, 0.5],
  [0.05, 0.095, 0.1],
  [1, 0, 1],
]

export default function createPluckSound (frequency) {
  let p = 0

  function getSample () {
    p += getFrequencyDelta(frequency)
    return sampleSquare(p)
  }

  return lowPassFilter(applyEnvelope(generateSound(2, getSample), volumeEnvelope), 9500)
}
