import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  EnvelopeSampler,
  sampleSawtooth,
  sampleSine,
  lowPassFilter,
  sampleNoise,
} from '../SoundGeneration'

const pitchEnvelope = [
  [0, 48, 0.03],
  [0.1, 0],
]
const volumeEnvelope = [
  [0, 0, 1],
  [0.008, 1, 1],
  [0.19, 0.6, 0.3],
  [1, 0]
]

export default function createLeadSound (frequency) {
  let p = 0
  let p2 = 0
  const pitchSampler = new EnvelopeSampler(pitchEnvelope)

  function getSample (t) {
    const offset = pitchSampler.sample(t) + sampleNoise()
    p += getFrequencyDelta(2 ** (offset / 12) * frequency)
    p2 += getFrequencyDelta(frequency * 4)
    return sampleSine(p2) * 0.5 + sampleSawtooth(p) * 1.1
  }

  return lowPassFilter(applyEnvelope(generateSound(2, getSample), volumeEnvelope), 12000)
}
