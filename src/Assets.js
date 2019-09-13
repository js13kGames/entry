import { waitForNextFrame } from './utils'
import { createRotateSound } from './Audio/Samples/Rotate'
import { TheAudioContext, setReverbDestination, contextSampleRate } from './Audio/Context'
import { createLandSound } from './Audio/Samples/Land'
import { createLockSound } from './Audio/Samples/Lock'
import { createShiftSound } from './Audio/Samples/Shift'
import {
  createFourLinesSound,
  createSingleLineSound,
  createDoubleLineSound,
  createTripleLineSound,
  createAllClearSound
} from './Audio/Samples/LineClears'
import { createHardDropSound } from './Audio/Samples/HardDrop'
import { createReverbIR } from './Audio/Samples/ReverbIR'
import { createHoldSound } from './Audio/Samples/Hold'
import { createTSpinSound } from './Audio/Samples/TSpin'
import createMainSong from './Audio/Songs/MainSong'
import createVictorySong from './Audio/Songs/VictorySong'
import FontAsset from './Sprites/Font'
import TextsAsset from './Sprites/Texts'
import EyesAsset from './Sprites/Eyes'
import GamepadAsset from './Sprites/Gamepad'
import LogoAsset from './Sprites/Logo'
import { createAudioBuffer } from './Audio/SoundGeneration'

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
export let LogoSprite

export let MainSong
export let VictorySong

export let RotateSound = createAudioBuffer(createRotateSound)
export let LandSound = createAudioBuffer(createLandSound)
export let LockSound = createAudioBuffer(createLockSound)
export let ShiftSound = createAudioBuffer(createShiftSound)
export let LineClearSounds = [
  createAudioBuffer(createSingleLineSound),
  createAudioBuffer(createDoubleLineSound),
  createAudioBuffer(createTripleLineSound),
  createAudioBuffer(createFourLinesSound),
]
export let HardDropSound = createAudioBuffer(createHardDropSound)
export let HoldSound = createAudioBuffer(createHoldSound)
export let TSpinSound = createAudioBuffer(createTSpinSound)
export let AllClearSound = createAudioBuffer(createAllClearSound)

async function createReverb () {
  const reverb = TheAudioContext.createConvolver()
  const ir = createReverbIR()
  const irBuffer = TheAudioContext.createBuffer(2, ir[0].length, contextSampleRate)
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
    GamepadSprite,
    LogoSprite,
  ] = await Promise.all([
    createSpriteAsset(FontAsset),
    createSpriteAsset(TextsAsset),
    createSpriteAsset(EyesAsset),
    createSpriteAsset(GamepadAsset),
    createSpriteAsset(LogoAsset),
  ])

  await createReverb()

  ;[
    MainSong,
    VictorySong,
  ] = await Promise.all([
    createMainSong(),
    createVictorySong(),
  ])

  document.body.classList.remove('l')
}
