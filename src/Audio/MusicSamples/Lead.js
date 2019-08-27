import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  sampleSquare,
  EnvelopeSampler
} from '../SoundGeneration'

function createEnvelope () {
  const result = []
  for (let i = 0; i <= 1000; i++) {
    const scale = 0.1 + 0.9 * (1 - i / 1000) ** 6
    result.push([i / 1000, Math.random() * scale])
  }
  return result
}

const pitchEnvelope = createEnvelope()
const volumeEnvelope = [
  [0, 0, 2],
  [0.01, 1, 0.3],
  [1, 0]
]

export default function createLeadSound (frequency) {
  let p = 0
  const pitchSampler = new EnvelopeSampler(pitchEnvelope)
  function getSample (t) {
    const offset = pitchSampler.sample(t)
    p += getFrequencyDelta(2 ** (offset / 12) * frequency)
    return sampleSquare(p)
  }

  return applyEnvelope(generateSound(2, getSample), volumeEnvelope)
}
