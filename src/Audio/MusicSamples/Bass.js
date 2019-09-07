import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  sampleSine,
} from '../SoundGeneration'

const volumeEnvelope = [
  [0, 0, 2],
  [0.01, 1, 0.3],
  [1, 0]
]

export default function createBassSound (frequency) {
  let p = 0
  function getSample () {
    p += getFrequencyDelta(frequency / 2)
    return sampleSine(p) + sampleSine(p * 2) / 2 + sampleSine(p * 3) / 3
  }

  return applyEnvelope(generateSound(2, getSample), volumeEnvelope)
}
