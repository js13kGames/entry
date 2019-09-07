import { TheAudioContext, TheAudioDestination, TheReverbDestination } from './Context'
import { waitForNextFrame } from '../utils'

export function addSoundToBuffer (sourceData, targetData, offset) {
  if (!Array.isArray(sourceData)) {
    sourceData = [sourceData]
  }

  if (!Array.isArray(targetData)) {
    targetData = [targetData]
  }

  for (let i = 0; i < targetData.length; i++) {
    const sourceDataBuffer = sourceData[i % sourceData.length]
    const targetDataBuffer = targetData[i % targetData.length]

    const maxJ = Math.min(offset + sourceDataBuffer.length, targetDataBuffer.length)
    for (let j = offset; j < maxJ; j++) {
      targetDataBuffer[j] += sourceDataBuffer[j - offset]
    }
  }
}

export function addNotes (notes, output, instrument, bpm) {
  const bufferCache = {}
  notes.forEach(note => {
    let key = note.slice(1).join('|')
    if (!bufferCache[key]) {
      bufferCache[key] = instrument(getFrequencyForTone(note[1]), ...note.slice(2))
    }
    addSoundToBuffer(
      bufferCache[key],
      output,
      getOffsetForBeat(note[0], bpm)
    )
  })
}

export function getOffsetForBeat (n, bpm) {
  return Math.round(TheAudioContext.sampleRate * n * 60 / bpm)
}

export function getFrequencyForTone (n) {
  return 440 * 2 ** (n / 12)
}

export function repeatNotes (x, length, repeat) {
  const result = []
  for (let i = 0; i < repeat; i++) {
    x.forEach(([b, ...args]) => {
      result.push([b + length * i, ...args])
    })
  }
  return result
}

export function addOctave (notes) {
  for (let i = 0, l = notes.length; i < l; i++) {
    let [offset, note, ...rest] = notes[i]
    notes.push([offset, note + 12, ...rest])
  }
  return notes
}

export function zipRhythmAndNotes (rhythm, notes) {
  return rhythm.map((beat, index) => {
    return [beat, notes[index]]
  })
}

export function offsetNotes (notes, amount) {
  notes.forEach(note => { note[0] += amount })
  return notes
}

export async function createBuffer (trackFunction, sampleCount, bpm) {
  const buffer = TheAudioContext.createBuffer(1, sampleCount, TheAudioContext.sampleRate)
  trackFunction(buffer.getChannelData(0), bpm)

  await waitForNextFrame()

  return buffer
}

export class Song {
  constructor (channelConfigs, loop = true) {
    this.channelConfigs = channelConfigs

    let master = TheAudioContext.createGain()

    this.channels = channelConfigs.map(config => {
      let gainNode = TheAudioContext.createGain()
      gainNode.gain.value = config.volume

      gainNode.connect(master)

      if (config.sendToReverb) {
        let gain = TheAudioContext.createGain()
        gain.gain.value = config.sendToReverb
        gainNode.connect(gain)
        gain.connect(TheReverbDestination)
      }

      return {
        buffer: config.buffer,
        sourceTarget: gainNode,
        volume: config.volume,
        volumeParam: gainNode.gain
      }
    })

    this.loop = loop

    master.connect(TheAudioDestination)
  }

  stop () {
    this.channels.forEach(channel => {
      channel.source.disconnect()
      channel.source = null
    })
  }

  fadeOut (time = 1) {
    this.channels.forEach(channel => {
      channel.volumeParam.linearRampToValueAtTime(0, TheAudioContext.currentTime + time)
    })

    setTimeout(() => this.stop(), time * 1000)
  }

  tapeStop (time = 1) {
    this.channels.forEach(channel => {
      channel.source.playbackRate.setValueAtTime(1, TheAudioContext.currentTime)
      channel.source.playbackRate.linearRampToValueAtTime(0.0001, TheAudioContext.currentTime + time)
    })

    setTimeout(() => this.stop(), time * 1000)
  }

  play () {
    this.channels.forEach(channel => {
      if (channel.source) {
        channel.source.disconnect()
      }

      const sourceNode = TheAudioContext.createBufferSource()
      sourceNode.loop = this.loop
      sourceNode.buffer = channel.buffer
      sourceNode.connect(channel.sourceTarget)
      sourceNode.start()
      channel.source = sourceNode
      channel.volumeParam.setValueAtTime(channel.volume, TheAudioContext.currentTime)
    })
  }
}
