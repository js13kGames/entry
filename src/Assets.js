import { waitForNextFrame } from './utils'
import { createRotateSound } from './Audio/Samples/Rotate'
import { TheAudioContext, setReverbDestination } from './Audio/Context'
import { createLandSound } from './Audio/Samples/Land'
import { createLockSound } from './Audio/Samples/Lock'
import { createShiftSound } from './Audio/Samples/Shift'
import {
  createTetrisSound,
  createSingleLineSound,
  createDoubleLineSound,
  createTripleLineSound,
  createAllClearSound
} from './Audio/Samples/Tetris'
import { createHardDropSound } from './Audio/Samples/HardDrop';
import { createReverbIR } from './Audio/Samples/ReverbIR';
import createHoldSound from './Audio/Samples/Hold';
import { createTSpinSound } from './Audio/Samples/TSpin';
import createSong from './Audio/Songs/Song1';
import FontAsset from './Sprites/Font'
import TextsAsset from './Sprites/Texts'
import EyesAsset from './Sprites/Eyes'
import GamepadAsset from './Sprites/Gamepad'

async function createAudioSampleAsset (createSampleFunction) {
  const array = createSampleFunction()
  const result = TheAudioContext.createBuffer(1, array.length, TheAudioContext.sampleRate)
  result.getChannelData(0).set(array)

  await waitForNextFrame()

  return result
}

function createSpriteAsset (spriteObject) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      spriteObject.renderable = img
      resolve(spriteObject)
    }
    img.src = spriteObject.dataUrl
  })
}

export let Font
export let TextsSprite
export let EyesSprite
export let GamepadSprite

export let Song1

export let RotateSound = createAudioSampleAsset(createRotateSound)
export let LandSound = createAudioSampleAsset(createLandSound)
export let LockSound = createAudioSampleAsset(createLockSound)
export let ShiftSound = createAudioSampleAsset(createShiftSound)
export let LineClearSounds = [
  createAudioSampleAsset(createSingleLineSound),
  createAudioSampleAsset(createDoubleLineSound),
  createAudioSampleAsset(createTripleLineSound),
  createAudioSampleAsset(createTetrisSound),
]
export let HardDropSound = createAudioSampleAsset(createHardDropSound)
export let HoldSound = createAudioSampleAsset(createHoldSound)
export let TSpinSound = createAudioSampleAsset(createTSpinSound)
export let AllClearSound = createAudioSampleAsset(createAllClearSound)

async function createReverb () {
  const reverb = TheAudioContext.createConvolver()
  const ir = createReverbIR()
  const irBuffer = TheAudioContext.createBuffer(2, ir[0].length, TheAudioContext.sampleRate)
  irBuffer.getChannelData(0).set(ir[0])
  irBuffer.getChannelData(1).set(ir[1])

  reverb.buffer = irBuffer

  setReverbDestination(reverb)

  await waitForNextFrame()
}

export async function loadAssets () {
  await Promise.all(
    [
      ShiftSound,
      RotateSound,
      LandSound,
      LockSound,
      ...LineClearSounds,
      HardDropSound,
      HoldSound,
      TSpinSound,
      AllClearSound
    ]
  )

  ;[
    Font,
    TextsSprite,
    EyesSprite,
    GamepadSprite
  ] = await Promise.all([
    createSpriteAsset(FontAsset),
    createSpriteAsset(TextsAsset),
    createSpriteAsset(EyesAsset),
    createSpriteAsset(GamepadAsset),
  ])

  await createReverb()

  Song1 = await createSong()
  Song1.play()

  document.body.classList.remove('loading')
}
