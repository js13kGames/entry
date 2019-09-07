import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  EnvelopeSampler,
} from '../SoundGeneration'

// Quick 'n dirty deterministic noise generation
let seed = 3
function random() {
    var x = Math.sin(seed++) * 10000
    return (x - Math.floor(x)) * 2 - 1
}

function createEnvelope () {
  const result = []
  for (let i = 0; i <= 1000; i++) {
    const scale = 0.1 + 0.9 * (1 - i / 1000) ** 6
    result.push([i / 1000, random() * scale])
  }
  return result
}

const pitchEnvelope = createEnvelope()
const volumeEnvelope = [
  [0, 0, 2],
  [0.01, 1, 0.3],
  [1, 0]
]

const shapeEnvelope = [
  [0, -1, 2],
  [0.5, 0, 1 / 2],
  [1, 1]
]

export default function createLeadSound (frequency) {
  let p = 0
  const shapeSampler = new EnvelopeSampler(shapeEnvelope)
  const pitchSampler = new EnvelopeSampler(pitchEnvelope)
  function getSample (t) {
    const offset = pitchSampler.sample(t)
    p += getFrequencyDelta(2 ** (offset / 12) * frequency)
    if (p > 1) {
      p -= 1
      shapeSampler.reset()
    }
    return shapeSampler.sample(p)
  }

  return applyEnvelope(generateSound(2, getSample), volumeEnvelope)
}
