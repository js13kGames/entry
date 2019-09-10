import { generateSound, applyEnvelope, sampleSine, getFrequencyDelta, EnvelopeSampler } from '../SoundGeneration'
import { getFrequencyForTone } from '../SongGeneration';

export function createTSpinSound () {
  const volumeEnvelope = [
    [0, 0, 0.1],
    [0.3, 0.5, 20],
    [0.5, 0],
    [0.6, 0, 0.1],
    [0.8, 0.5],
    [1, 0],
  ]

  const pitchEnvelope = new EnvelopeSampler([
    [0, 5],
    [0.3, 12],
    [0.6, 10]
  ])

  let phase = 0

  function sampleSkewedSine (t) {
    t %= 1
    t = (3 - 2 * t) * t * t
    return sampleSine(t)
  }

  function sample (t) {
    const pitch = pitchEnvelope.sample(t)
    phase += getFrequencyDelta(getFrequencyForTone(pitch))
    return sampleSkewedSine(phase)
  }

  return applyEnvelope(generateSound(0.25, sample), volumeEnvelope)
}
