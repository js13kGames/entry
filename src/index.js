/* eslint-disable */
/**
 * IMPORT STATEMENTS
 */
import boatLeftSheet from './assets/images/sprites/boat-shadow-sprite-left.png'
import boatRightSheet from './assets/images/sprites/boat-shadow-sprite-right.png'
import borderSrc from './assets/images/sprites/river-border-horizontal-stone.png'
import rippleSrc from './assets/images/sprites/ripple-sprite.png'
import rescueSrc from './assets/images/sprites/rescue-copter.png'
import buoySrc from './assets/images/sprites/rescue-buoy.png'
import treeSrc from './assets/images/sprites/tree-sprite.png'
import rockSrc from './assets/images/sprites/rock-sprite.png'
import bodySrc from './assets/images/sprites/river-body.png'
import thumbPath from './assets/images/sprites/thumb.png'
import arrowSrc from './assets/images/sprites/arrow.png'

/* #region UTILITY */
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

function setCookie(name, value) {
  document.cookie = `${name}=${value}`
}

function getCookie(name) {
  const regex = new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*\\=\\s*([^;]*).*$)|^.*$`)

  return document.cookie.replace(regex, '$1')
}
/* #endregion */

/* #region CONSTANTS */
let CANVAS_RATIO =  16 / 9
let MAX_HUMAN_POWER_VELOCITY =  0.75
let WATER_FRICTION =  0.005
let STROKE_POWER =  0.0075 
let STROKE_INCREASE =  0.001
let RIVER_SPEED =  -0.1
let BOAT_WIDTH =  24
let BOAT_HEIGHT =  14
let BOAT_SPRITE_WIDTH = 84
let BOAT_SPRITE_HEIGHT = 15
let TUTORIAL_SCREEN_DURATION = 4000
let QUIT_TEXT = '<QUIT(Q)'
let PAUSE_TEXT = 'PAUSE(P)'
let BACK_TEXT = '<QUIT TUTORIAL(Q)'
let TUT_TEXT = 'TUTORIAL(T)'
let PLAY_TEXT = 'PLAY(P)'
let LKB_TEXT = '(A S D F)'
let RKB_TEXT = '(; L K J)'
let USING_KEYBOARD = false
let SPAWN_INTERVAL = 500
let DIFFICULTY_MULTIPLYER = 15

// let CANVAS_MID_X =  undefined
// let CANVAS_MID_Y =  undefined
// let SCREEN_MID_Y =  undefined
let CANVAS_WIDTH =  undefined
let CANVAS_HEIGHT =  undefined
let SCREEN_WIDTH =  undefined
let SCREEN_HEIGHT =  undefined
let SCREEN_MID_X =  undefined
let SCALE_FACTOR =  undefined
let SCALED_WIDTH =  undefined
let SCALED_HEIGHT =  undefined
let CTX_L_WIDTH = undefined

let DEEP = 440 / 6
let OAR = 440 * 3
let OAR2 = 440 * 4
let A4 = 440
let C4 = A4 * (2 ** (2 / 12))
let D4 = A4 * (2 ** (4 / 12))
let E4 = A4 * (2 ** (6 / 12))
let F4 = A4 * (2 ** (7 / 12))
let G4 = A4 * (2 ** (9 / 12))
let C5 = A4 * (2 ** (14 / 12))
/* #endregion */

const getRenderAdjustAmount = (velocity) => (RIVER_SPEED * 2) + velocity

/**
 * World/distance vars
 */
let distanceMoved, distanceFromStart, metersFromStart, totalDistanceRowed, isRunning

/**
 * Other var setup ...
 */
// let world,
let home, tutorial, control, game, controls, boat, river,
    obstacleManager, collisionManager, paused = false,
    makeTree, makeRock, makeButton, makeSprite, sound, infoDisplay,
    handleKeyboardControl, initialMsg, rescue, buoy

boat = {}
home = {}
rescue = {}
buoy = {}
collisionManager = {}
obstacleManager = {}
sound = {}
infoDisplay = {}
const ripples = []
let lastRipple = 0

/**
 * Put all variables that need resetting per-game here
 */
function resetVarsForNewGame() {
  console.log('-- resetVarsForNewGame --')
  isRunning = true
  distanceMoved = 0
  distanceFromStart = 0
  metersFromStart = 0
  totalDistanceRowed = 0
}

resetVarsForNewGame()

// localStorage.removeItem('highscore')

let hs = localStorage.getItem('highscore')

console.log('HIGH SCORE', hs)

const updateHs = (score) => {
  if (!hs || score > hs) {
    hs = score
  }
}

const setHs = (score) => {
  if (!hs || score >= hs) {
    console.log('DONE AM SETTING HS!', hs, score)
    hs = score
    console.log('Highscore AS SET', hs)
    localStorage.setItem('highscore', hs)
  }
}

/* #region DOM / EVENT */
const body = document.querySelector('body')
const wrapper = document.getElementById('wrapper')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

CTX_L_WIDTH = ctx.measureText('L').width

const gameStates = {
  initial: 2,
  title: 3,
  tutorial: 4,
  game: 5,
  gameOver: 6,
}

let gameState = gameStates.initial

ctx.font = '12px Courier'

// Prevent various zoome and scroll events
window.addEventListener('gesturestart', (e) => e.preventDefault())
window.addEventListener('gesturechange', (e) => e.preventDefault())
window.addEventListener('gestureend', (e) => e.preventDefault()); body.style.overflow = 'hidden'
window.addEventListener('mousewheel', (event) => event.preventDefault(), { passive: false })
document.addEventListener('touchmove', (ev) => ev.preventDefault(), { passive: false })
body.addEventListener('ontouchmove', (e) => e.preventDefault())

/* #endregion */


function initGameClasses() {
  // world = new World(ctx, sound.end.bind(sound))

  home.init(hs)

  // console.log('Set game', sound)
  game.init(goToTitle, sound)

  tutorial.init()

  boat.init(
    SCALE_FACTOR,
    STROKE_POWER,
    MAX_HUMAN_POWER_VELOCITY,
    WATER_FRICTION,
    {
      x: (CANVAS_WIDTH / 2) - (BOAT_WIDTH / 2),
      y: CANVAS_HEIGHT / 2 / 1.25,
    },
  )

  rescue.__init()

  
  initialMsg.__init()
  
  collisionManager.__setup(boat)
  
  // waterfall = new Waterfall(ctx, RIVER_SPEED)
  
  obstacleManager.__init(ctx)
  
  buoy.__init()
}

function titleLoop() {
  _world_calculatePositions(river, boat)
  boat.rR()
  river.renderBody(boat.velocity + 0.35)
  boat.justRow()
  river.renderBorder(boat.velocity + 0.35)
  home.renderMainScreen()
}

// function goToMenu() {
//   gameState = gameStates.title
// }

function tutorialLoop() {
  _world_calculatePositions(river, boat)
  boat.rR()
  river.renderBody(boat.velocity + 0.1)
  // I think there is lingering velocity after the tutorial ends?
  // TODO: check on above.
  boat.setFrames(controls.boatFrame())
  boat.runFrameUpdate()
  river.renderBorder(boat.velocity)
  tutorial.renderTutorial()
}

function goToGameOver() {
  sound.end()
  setHs(distanceFromStart)
  controls.registerButton(controls.getMainTouchEl(), game.gameOverBtn)
  gameState = gameStates.gameOver
}

function gameLoop() {
  if (!game.paused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!isRunning || collisionManager.__collisions >= 8) {
      goToGameOver()
    }

    _world_calculatePositions(river, boat)

    boat.rR()

    river.renderBody(boat.velocity)

    buoy.__render()

    // drawDebug(ctx, world)

    // TODO: confirm this is a good idea...
    obstacleManager.__trySpawnObstacle(totalDistanceRowed, game.difficulty)

    obstacleManager.__render(boat.velocity)

    boat.setFrames(controls.boatFrame())

    boat.runFrameUpdate()

    boat.updateStrokePower(game.difficulty)

    collisionManager.__broadPhaseCheck(boat, obstacleManager.__obstacles)
    // collisionManager.__broadPhaseCheck(buoy, obstacleManager.__obstacles)

    river.renderBorder(boat.velocity)

    rescue.__render()

    game.render(distanceFromStart)

    boat.rLL(collisionManager.__collisions)

    initialMsg.__render()

    updateHs(distanceFromStart)
  }
}

function gameOverLoop() {
  if (river.current !== 0) {
    river.current = 0
  }

  _world_calculatePositions(river, boat)

  river.renderBody(-RIVER_SPEED * 2)
  river.renderBorder(-(RIVER_SPEED * 2))
  obstacleManager.__render(-(RIVER_SPEED * 2))

  boat.fadeOut()

  game.render(distanceFromStart)
  
  game.renderGameOver()
}

function pause(duration, cb) {
  paused = true
  setTimeout(() => {
    console.log('UNPAUSE')
    paused = false
    cb()
  }, duration)
}

function goToTutorial() {
  controls.registerButton(body, tutorial.backBtn, () => {
    tutorial.leave()
    goToTitle()
  })

  tutorial.runTutorialSteps()

  gameState = gameStates.tutorial
}

function leaveTitle() {
  controls.clearButton(body, home.playBtn)
  controls.clearButton(body, home.tutorialBtn)
}

function goToGame() {
  leaveTitle()

  initGameClasses()

  controls.registerBoatControls()

  resetVarsForNewGame()
  river.reset()
  collisionManager.__reset()

  obstacleManager.__makeWaterfall()


  game.goTo()

  gameState = gameStates.game
}

function goToTitle() {
  controls.registerButton(body, home.playBtn, () => {
    sound.song()
    goToGame()
  })
  controls.registerButton(body, home.tutorialBtn, () => {
    leaveTitle()
    goToTutorial()
  })

  boat.checkOarAlignment()

  if (gameState === gameStates.game || gameState === gameStates.gameOver) {
    // console.log('Set hs', totalDistanceRowed)

    setHs(distanceFromStart)

    home.updateHs(hs)
  }

  gameState = gameStates.title
}

const fitCanvasToScreen = () => {
  canvas.style.width = `${SCALED_WIDTH}px`
  body.style.height = `${SCALED_HEIGHT}px`
  wrapper.style.height = `${SCALED_HEIGHT}px`
  canvas.style.height = `${SCALED_HEIGHT}px`
}

const initializeGame = (mainFn) => {
  /**
   * SET UNSET CONSTANTS
   */
  // SCREEN_MID_Y = SCREEN_HEIGHT / 2
  // CANVAS_MID_X = Math.round(SCALED_WIDTH / 2)
  // CANVAS_MID_Y = SCALED_HEIGHT / 2
  CANVAS_WIDTH = canvas.width
  CANVAS_HEIGHT = canvas.height
  SCREEN_WIDTH = window.innerWidth
  SCREEN_HEIGHT = window.innerHeight
  SCREEN_MID_X = SCREEN_WIDTH / 2
  SCALED_WIDTH = Math.round(SCREEN_HEIGHT / CANVAS_RATIO)
  SCALED_HEIGHT = SCREEN_HEIGHT
  SCALE_FACTOR = SCALED_HEIGHT / canvas.height


  // console.log('CONSTANTS', CONSTANTS)

  fitCanvasToScreen()

  canvas.style.backgroundColor = '#0e52ce'
  canvas.style.imageRendering = 'pixelated'

  controls = control()
  controls.init(body, sound.oar.bind(sound))

  collisionManager.__init(ctx, sound.bump.bind(sound))

  initGameClasses()

  infoDisplay.setup(wrapper, canvas, SCALED_WIDTH)

  river.init()

  mainFn()
}

function mainLoop() {
  if (!paused) {
    switch (gameState) {
      case gameStates.initial:
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        home.renderInitialLoad()
        console.log('PAUSE')
        pause(500, () => {
          console.log('unpause cb')
          if (tutorial.hasBeenSeen) {
            goToTitle()
          }
          else {
            console.log('SET TUTORIAL')
            leaveTitle()
            goToTutorial()
          }
        })
        break
      case gameStates.title:
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        titleLoop()
        break
      case gameStates.tutorial:
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (tutorial.running) {
          tutorialLoop()
        }
        else {
          goToTitle()
        }
        break
      case gameStates.game:
        if (!collisionManager.__hasCollision) {
          gameLoop()
        }
        break
      case gameStates.gameOver:
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        gameOverLoop()
        break
      default:
    }
  }
  window.requestAnimationFrame(mainLoop)
}

/* #region WORLD */
function _world_calculatePositions(river, boat) {
  const { current } = river
  const { velocity } = boat

  const distMod = ((current * 2) + velocity)

  if (isRunning) {
    distanceMoved = distanceMoved - distMod
    distanceFromStart = -distanceMoved
    metersFromStart = Math.floor((distanceFromStart / 3))
    totalDistanceRowed = distMod > 0
      ? totalDistanceRowed + distMod
      : totalDistanceRowed
  }

  if (gameState === gameStates.game && boat.y + distanceFromStart < 0) {
    isRunning = false
  }
}
/* #endregion */

/* #region CONTROL */
control = function() {
  let mtl
  let oarSound

  const getMainTouchEl = () => mtl

  const setMainTouchEl = (el) => {
    mtl = el
  } 

  const setOarSound = (sound) => {
    oarSound = sound
  }

  const createMockTouchObject = (id, startX, startY) => ({
    identifier: id,
    pageX: startX,
    pageY: startY,
  })

  const buttonRegistry = {}

  const activeTouches = {
    left: null,
    right: null,
  }

  const prevTouch = {
    left: {
      x: 0,
      y: 0,
    },
    right: {
      x: 0,
      y: 0,
    },
  }

  const touchDiff = {
    left: {
      x: 0,
      y: 0,
    },
    right: {
      x: 0,
      y: 0,
    },
  }

  const boatFrame = {
    left: 0,
    right: 0,
  }

  const setFrameForX = (x, side) => {
    // The in-to-out & out-to-in will be different (pos vs neg)
    // depending on the side
    const diff = side === 'left' ? x * -1 : x

    switch (boatFrame[side]) {
      case 1:
        if (Math.abs(x) !== diff) {
          boatFrame[side] = 2
        }
        break
      case 5:
        if (Math.abs(x) === diff) {
          boatFrame[side] = 6
        }
        break
      default:
    }
  }

  const setFrameForY = (y, side) => {
    switch (boatFrame[side]) {
      case 0:
        if (Math.abs(y) === y) {
          boatFrame[side] = 1
        }
        break
      case 2:
        if (Math.abs(y) !== y) {
          boatFrame[side] = 3
        }
        break
      case 3:
        if (Math.abs(y) !== y) {
          boatFrame[side] = 4
          if (gameState === gameStates.game) {
            oarSound()
          }
        }
        break
      case 4:
        if (Math.abs(y) !== y) {
          boatFrame[[side]] = 5
        }
        break
      case 5:
        if (Math.abs(y) === y) {
          boatFrame[side] = 6
        }
        break
      case 6:
        if (Math.abs(y) === y) {
          boatFrame[side] = 0
        }
        break
      default:
    }
  }

  const setRightFrame = (x, y) => {
    if (x) {
      setFrameForX(x, 'right')
    }
    if (y) {
      setFrameForY(y, 'right')
    }
  }

  const setLeftFrame = (x, y) => {
    if (x) {
      setFrameForX(x, 'left')
    }
    if (y) {
      setFrameForY(y, 'left')
    }
  }

  const resetAllForSide = (side) => {
    activeTouches[side] = null
    prevTouch[side].x = 0
    prevTouch[side].y = 0
    touchDiff[side].x = 0
    touchDiff[side].y = 0
    boatFrame[side] = 0
  }

  const handleNewTouch = (touchObject) => {
    // console.log('NEW TOUCH!')
    if (!activeTouches.left && touchObject.pageX < SCREEN_MID_X) {
      activeTouches.left = touchObject
      prevTouch.left = { x: touchObject.pageX, y: touchObject.pageY }
    }

    if (!activeTouches.right && touchObject.pageX > SCREEN_MID_X) {
      activeTouches.right = touchObject
      prevTouch.right = { x: touchObject.pageX, y: touchObject.pageY }
    }
  }

  const handleRemovedTouch = (touchObject) => {
    // console.log('REMOVED TOUCH!')
    if (activeTouches.left && activeTouches.left.identifier === touchObject.identifier) {
      resetAllForSide('left')
    }

    if (activeTouches.right && activeTouches.right.identifier === touchObject.identifier) {
      resetAllForSide('right')
    }
  }

  const handleMovedTouch = (touchObject) => {
    const o = 10
    // console.log('MOVED TOUCH!')
    if (activeTouches.left && activeTouches.left.identifier === touchObject.identifier) {

      touchDiff.left.y += prevTouch.left.y - touchObject.pageY
      prevTouch.left.y = touchObject.pageY
      touchDiff.left.x += prevTouch.left.x - touchObject.pageX
      prevTouch.left.x = touchObject.pageX

      if (touchDiff.left.x >= o || touchDiff.left.x <= -o) {
        setLeftFrame(touchDiff.left.x, undefined)
        touchDiff.left.x = 0
      }

      if (touchDiff.left.y >= o || touchDiff.left.y <= -o) {
        setLeftFrame(undefined, touchDiff.left.y)
        touchDiff.left.y = 0
      }
    }

    if (activeTouches.right && activeTouches.right.identifier === touchObject.identifier) {
      touchDiff.right.y += prevTouch.right.y - touchObject.pageY
      prevTouch.right.y = touchObject.pageY
      touchDiff.right.x += prevTouch.right.x - touchObject.pageX
      prevTouch.right.x = touchObject.pageX

      if (touchDiff.right.x >= o || touchDiff.right.x <= -o) {
        setRightFrame(touchDiff.right.x, undefined)
        touchDiff.right.x = 0
      }
      if (touchDiff.right.y >= o || touchDiff.right.y <= -o) {
        setRightFrame(undefined, touchDiff.right.y)
        touchDiff.right.y = 0
      }
    }
  }

  const handleTouchStart = (event) => {
    // console.log('Touch started', event)
    switch (event.changedTouches.length) {
      case 1:
        handleNewTouch(event.changedTouches[0])
        break
      case 2:
        handleNewTouch(event.changedTouches[0])
        handleNewTouch(event.changedTouches[1])
        break
      default:
    }
  }

  const handleTouchMove = (event) => {
    // console.log('Touch moved', event)
    switch (event.changedTouches.length) {
      case 1:
        handleMovedTouch(event.changedTouches[0])
        break
      case 2:
        handleMovedTouch(event.changedTouches[0])
        handleMovedTouch(event.changedTouches[1])
        break
      default:
    }
  }

  const handleTouchEnd = (event) => {
    // console.log('Touch ended', event)
    switch (event.changedTouches.length) {
      case 1:
        handleRemovedTouch(event.changedTouches[0])
        break
      case 2:
        handleRemovedTouch(event.changedTouches[0])
        handleRemovedTouch(event.changedTouches[1])
        break
      default:
    }
  }

  const handleTouchCancel = (event) => {
    // console.log('Touch cancelled', event)
    activeTouches.left = null
    activeTouches.right = null
  }

  const registerButton = (element, button, actionOverride = null) => {
    buttonRegistry[button.name] = (event) => {
      if (event.changedTouches.length === 1) {
        const { pageX, pageY } = event.changedTouches[0]

        if (
          pageX > button.xMin
          && pageX < button.xMax
          && pageY > button.yMin
          && pageY < button.yMax
        ) {
          if (actionOverride) {
            actionOverride()
          }
          else {
            button.action(event)
          }
        }
      }
    }

    element.addEventListener('touchend', buttonRegistry[button.name])
  }

  const clearButton = (element, button) => {
    element.removeEventListener('touchend', buttonRegistry[button.name])

    delete buttonRegistry[button.name]
  }

  return {
    init: (el, sound) => {
      setMainTouchEl(el)
      setOarSound(sound)
    },
    getMainTouchEl,
    registerBoatControls: (element) => {
      const attachToEl = element || getMainTouchEl()

      attachToEl.addEventListener('touchstart', handleTouchStart)
      attachToEl.addEventListener('touchmove', handleTouchMove)
      attachToEl.addEventListener('touchend', handleTouchEnd)
      attachToEl.addEventListener('touchcancel', handleTouchCancel)
    },
    clearBoatControls: (element) => {
      const attachToEl = element || getMainTouchEl()

      resetAllForSide('left')
      resetAllForSide('right')

      attachToEl.removeEventListener('touchstart', handleTouchStart)
      attachToEl.removeEventListener('touchmove', handleTouchMove)
      attachToEl.removeEventListener('touchend', handleTouchEnd)
      attachToEl.removeEventListener('touchcancel', handleTouchCancel)
    },
    activeTouches: () => activeTouches,
    boatFrame: () => boatFrame,
    createMockTouchObject,
    handleNewTouch,
    handleMovedTouch,
    handleRemovedTouch,
    registerButton,
    clearButton,
    setFrameForX,
    setFrameForY,
  }
}

handleKeyboardControl = (event) => {
  const {code} = event

  if (!USING_KEYBOARD) {
    USING_KEYBOARD = true
    STROKE_POWER *= 4
  }

  if (gameState === gameStates.game || gameState === gameStates.tutorial) {
    switch(code) {
      case 'Semicolon':
          controls.setFrameForY(10, 'right')
          controls.setFrameForY(10, 'right')
          controls.setFrameForY(10, 'right')
          break
      case 'KeyL':
          controls.setFrameForX(-10, 'right')
          break
      case 'KeyK':
          controls.setFrameForY(-10, 'right')
          controls.setFrameForY(-10, 'right')
          controls.setFrameForY(-10, 'right')
          break
          case 'KeyJ':
            controls.setFrameForX(10, 'right')
          break
      case 'KeyA':
          controls.setFrameForY(10, 'left')
          controls.setFrameForY(10, 'left')
          controls.setFrameForY(10, 'left')
      break
      case 'KeyS':
          controls.setFrameForX(10, 'left')
      break
      case 'KeyD':
          controls.setFrameForY(-10, 'left')
          controls.setFrameForY(-10, 'left')
          controls.setFrameForY(-10, 'left')
      break
      case 'KeyF':
          controls.setFrameForX(-10, 'left')
      break
    }
  }
  if (gameState === gameStates.game) {
    switch(code) {
      case 'KeyQ':
        goToTitle()
        break  
      case 'KeyP':
        game.paused = !game.paused
        break  
    }
  }
  if (gameState === gameStates.title) {
    console.log('In title', code)
    switch(code) {
      case 'KeyP':
        sound.song()
        goToGame()
        break
      case 'KeyT':
        goToTutorial()
        break
    }
  }
  if (gameState === gameStates.tutorial) {
    switch(code) {
      case 'KeyQ':
        tutorial.leave()

      break
    }
  }
  if (gameState === gameStates.gameOver) {
    switch(code) {
      case 'KeyQ':
        goToTitle()
      break
    }
  }
}
/* #endregion */

/* #region RESCUE */
buoy.__init = () => {
  buoy.__image = new Image()
  buoy.__image.src = buoySrc
  buoy.__active = false
  buoy.__stuck = false
  buoy.__spawnedAt = [0]
  buoy.__sprite = makeSprite({
    context: ctx, width: 18, height: 9, image: buoy.__image, numberOfFrames: 2, loop: true, ticksPerFrame: 60, x: 40, y: 140,
  })
  buoy.__reset()
}

buoy.__render = () => {  
  if (buoy.__active) {
    buoy.__checkPickup()
    if (!buoy.__stuck) {
      buoy.__sprite.y += getRenderAdjustAmount(-boat.velocity)
    } 
    else {
      buoy.__sprite.y -= getRenderAdjustAmount(boat.velocity)
    }
    buoy.__sprite.update()
    buoy.__sprite.render(buoy.__sprite.x, buoy.__sprite.y)
    if (buoy.__sprite.y < -9) {
      buoy.__active = false
    }
  }
  if (metersFromStart % SPAWN_INTERVAL === 0) {
    if (!buoy.__spawnedAt.includes(metersFromStart)) {
      buoy.__spawnedAt.push(metersFromStart)
      buoy.__spawn()
    }
  }
}

buoy.__reset = () => {
  let x = random(15, CANVAS_WIDTH - 20)

  for (let i = obstacleManager.__obstacles.length -1; i >= 0; i -=1){
    const obstacle = obstacleManager.__obstacles[i]

    if (obstacle.y > CANVAS_HEIGHT - 20 && obstacle.y < CANVAS_HEIGHT + 20) {
      if (x > obstacle.x && x < obstacle.x + obstacle.frameWidth) {
        console.log('REALIGNING BUOY', x, obstacle.x)
        if (obstacle.x > CANVAS_WIDTH / 2) {
          x -= obstacle.frameWidth
          console.log('MOVE LEFT new x', x)
        }
        else {
          x += obstacle.frameWidth
          console.log('MOVE RIGHT new x', x)
        }
        i = -1
      }
    }
  }

  buoy.__stuck = false
  buoy.__sprite.y = CANVAS_HEIGHT
  buoy.__sprite.x = x

  // For hitbox testing only:
  // buoy.__active = true
  // buoy.__sprite.y = 120
  // buoy.__sprite.x = 40

  // Min/Max rock hitboxes
  // obstacleManager.__obstacles.push(obstacleManager.__spawnRock(12, 50))
  // obstacleManager.__obstacles.push(obstacleManager.__spawnRock(45, 50))
 
  // Min/Max tree hitboxes
  // obstacleManager.__obstacles.push(obstacleManager.__spawnTree(16, 50))
  // obstacleManager.__obstacles.push(obstacleManager.__spawnTree(45, 50))

}

buoy.__spawn = () => {
  buoy.__reset()
  buoy.__active = true
}

buoy.__checkPickup = () => {
  if (
    buoy.__sprite.x > boat.x - 4
    && buoy.__sprite.x < boat.x + 18
    && buoy.__sprite.y < boat.y + 8
    && buoy.__sprite.y > boat.y - 5
    ) {
      sound.buoy()
      rescue.__commence()
      buoy.__active = false
    }
}

rescue.__init = () => {
  rescue.__active = false
  rescue.__height = 55
  rescue.__width = 34
  rescue.__stopY = boat.y - 13
  rescue.x = boat.x
  rescue.y = CANVAS_HEIGHT
  rescue.__image = new Image()
  rescue.__image.src = rescueSrc
  rescue.__livesAdded = 0

  rescue.__dropStart = 0
  rescue.__dropDuration = 1500

  rescue.__sprite = makeSprite({
    context: ctx, width: 68, height: 55, image: rescue.__image, numberOfFrames: 2, loop: true, ticksPerFrame: 2, x: rescue.x, y: rescue.y,
  })
}

rescue.__commence = () => {
  rescue.__reset()
  rescue.__active = true
}

rescue.__reset = () => {
  rescue.__livesAdded = 0
  rescue.x = boat.x
  rescue.y = CANVAS_HEIGHT * 2
}

rescue.__renderShadow = () => {

}

rescue.__render = () => {
  if (rescue.__active) {
    const now = Date.now()

    if (now > game.startTime + game.rescueTime) {
      rescue.__sprite.update()
      rescue.__sprite.render(Math.round(boat.x - 4), rescue.y)

      if (rescue.y > CANVAS_HEIGHT) {
        sound.helo(.5)
      }
      else if (rescue.y > rescue.__stopY) {
        sound.helo(.75)
      }
      else if (rescue.y === rescue.__stopY) {
        sound.helo(1.25)
      }
      else if (rescue.y > 0) {
        sound.helo(.75)
      }
      else if (rescue.y < 0) {
        sound.helo(.5)
      }

      if (rescue.y > rescue.__stopY && !rescue.decided) {
        rescue.y -= 2

        if (rescue.y <= rescue.__stopY) {
          console.log('Drop set Ys')
          rescue.y = rescue.__stopY
          rescue.__dropStart = Date.now()
        }
      }

      if (rescue.y === rescue.__stopY) {
        console.log('drop in progress')
        if (now > rescue.__dropStart + rescue.__dropDuration) {
          rescue.y -= 2
        }
        else if (now > rescue.__dropStart + 1200 && rescue.__livesAdded === 2) {
          collisionManager.__addLife()
          rescue.__livesAdded += 1
        }
        else if (now > rescue.__dropStart + 800 && rescue.__livesAdded === 1) {
          collisionManager.__addLife()
          rescue.__livesAdded += 1
        }
        else if (now > rescue.__dropStart + 400 && rescue.__livesAdded === 0) {
          collisionManager.__addLife()
          rescue.__livesAdded += 1
        }
      }

      if (rescue.y < rescue.__stopY) {
        rescue.y -= 2
        if (rescue.y < -100) {
          rescue.__active = false
        }
      }
    }
  }
}

/* #region BOAT */
function spawnRipple(velOvr = 0, opOvr = 0, nowOvr = 0) {
  const now = Date.now()
  if (boat.velocity + velOvr > .1 && now > lastRipple + 250 + nowOvr) {
    ripples.push(
      makeSprite({
        context: ctx, opacity: boat.velocity + .1 + opOvr, width: 48, height: 18, image: boat.rpI, numberOfFrames: 2, loop: true, ticksPerFrame: 30, x: boat.roundX, y: boat.roundY - 16,
      })
    )
    lastRipple = now
  }
}

boat.init = (scaleFx, strokePower, maxVelocity, waterFriction, startCoords) => {
  boat.height = BOAT_SPRITE_HEIGHT
  boat.width = BOAT_SPRITE_WIDTH / 7
  boat.active = true
  boat.lI = new Image() // leftImage
  boat.rI = new Image() // rightImage
  boat.rpI = new Image() // rippleImage
  boat.lI.src = boatLeftSheet
  boat.rI.src = boatRightSheet
  boat.rpI.src = rippleSrc
  boat.startingX = startCoords.x
  boat.scaleFx = scaleFx
  boat.x = startCoords.x
  boat.y = startCoords.y
  boat.opacity = 1
  // leftSprite
  boat.lS = makeSprite({
    context: ctx, width: BOAT_SPRITE_WIDTH, height: BOAT_SPRITE_HEIGHT, image: boat.lI, numberOfFrames: 7, loop: true, ticksPerFrame: 5, x: 0, y: 0,
  })
  // rightSprite
  boat.rS = makeSprite({
    context: ctx, width: BOAT_SPRITE_WIDTH, height: BOAT_SPRITE_HEIGHT, image: boat.rI, numberOfFrames: 7, loop: true, ticksPerFrame: 5, x: 12, y: 0,
  })
  boat.resetVelocity()
  boat.drift = 0
  boat.sSS = 0 // sameSideStrokes
  boat.lSSS = 0 // lastSameSideStroke
  boat.maxVelocity = maxVelocity
  boat.strokePower = strokePower
  boat.wF = waterFriction // waterFriction
  boat.lastStrokeUpdate = undefined
  boat.isStuck = false
}

// renderLivesLeft
boat.rLL = (collisions) => {
  const atY = 34
  const loops = 8 - collisions > 0 ? 8 - collisions : 0
  let evens = 0
  let odds = 0

  ctx.save()
  ctx.globalAlpha = 0.7
  for (let i = 0; i < loops; i += 1) {
    if (i % 2 === 0) {
      ctx.drawImage(
        boat.lI, 0, 0, 12, 14, 16 + (evens * 24) + (evens * 2), atY, 12, 14,
      )
      evens += 1
    }
    else {
      ctx.drawImage(
        boat.rI, 0, 0, 12, 14, 28 + (odds * 24) + (odds * 2), atY, 12, 14,
      )
      odds += 1
    }
  }
  ctx.restore()
}

boat.setStuck = () => {
  console.log('Stuck set...')
  boat.isStuck = true
}

boat.setUnstuck = () => {
  if (boat.isStuck) {
    console.log('UNStuck set...')
    boat.isStuck = false
  }
}

boat.updateStrokePower = (difficulty) => {
  boat.strokePower = STROKE_POWER + (STROKE_INCREASE * difficulty)
}

// getBoatBodyDimensions
boat.getBBD = () => ({
  minY: boat.y,
  maxX: boat.x + 17,
  maxY: boat.y + boat.height,
  minX: boat.x + 8,
})

boat.resetVelocity = () => {
  boat.velocity = 0
}

boat.setFrames = (frameObj) => {
  if (
    boat.lS.currentFrame() !== frameObj.left
      && boat.rS.currentFrame() !== frameObj.right
  ) {
    boat.sSS = 0
  }
  if (boat.lS.currentFrame() !== frameObj.left) {
    boat.addVelocity(frameObj.left)
    boat.addDrift(frameObj.left, 1)
  }
  boat.lS.goToFrame(frameObj.left)

  if (boat.rS.currentFrame() !== frameObj.right) {
    boat.addVelocity(frameObj.right)
    boat.addDrift(frameObj.right, -1)
  }
  boat.rS.goToFrame(frameObj.right)
}

boat.checkOarAlignment = () => {
  // console.log('Checking oar alignment...')
  if (boat.x === boat.startingX) {
    console.log('Resetting oars...')
    boat.lS.goToFrame(0).resetTickCount()
    boat.rS.goToFrame(0).resetTickCount()
    boat.rS.update()
    boat.lS.update()
    boat.oarsOffset = false
  }
}

boat.justRow = () => {
  if (boat.x !== boat.startingX) {
    if (boat.drift !== 0) {
      boat.drift = 0
    }
    boat.oarsOffset = true

    // console.log('Just rowing...', boat.x, boat.startingX)

    if (boat.x - boat.startingX > 1) {
      // console.log('Going right')
      boat.x -= 0.25
      boat.rS.update()
    }
    else if (boat.x - boat.startingX < -1) {
      // console.log('Going left')
      boat.x += 0.25
      boat.lS.update()
    }
    else {
      boat.x = boat.startingX
      // console.log('Resetting X', boat.x, boat.startingX)
    }
  }
  else {
    if (boat.oarsOffset) {
      // console.log('Fixing offset oars!')
      boat.x = boat.startingX
      boat.lS.goToFrame(0).resetTickCount()
      boat.rS.goToFrame(0).resetTickCount()
      boat.oarsOffset = false
    }

    boat.rS.update()
    boat.lS.update()
    spawnRipple(.15, .15, 100)
  }

  boat.render()
}

boat.isOarInWater = (frame) => frame > 2 && frame < 6

boat.isSameSideRowing = () => Math.abs(boat.sSS) > 3

boat.addVelocity = (frame) => {
  if (frame) {
    if (
      boat.isOarInWater(frame)
        && boat.velocity <= boat.maxVelocity
        && !boat.isSameSideRowing()
    ) {
      boat.setUnstuck()
      boat.velocity += boat.strokePower
      boat.lastStrokeUpdate = Date.now()
    }
  }
}

boat.bounceLeft = () => {
  boat.drift = -0.066
}

boat.bounceRight = () => {
  boat.drift = 0.066
}

boat.addDrift = (frame, direction) => {
  if (boat.isSameSideRowing()) {
    boat.lSSS = Date.now()
  }
  else {
    boat.sSS += direction
  }

  if (frame) {
    if (boat.isOarInWater(frame)) {
      boat.drift += boat.strokePower * direction
    }
  }
}

boat.applyWaterFriction = () => {
  const now = Date.now()

  if (now - boat.lSSS > 500 && boat.drift !== 0) {
    if (boat.drift > 0) {
      boat.drift -= boat.wF
      if (boat.drift < 0) {
        boat.drift = 0
      }
    }
    if (boat.drift < 0) {
      boat.drift += boat.wF
      if (boat.drift > 0) {
        boat.drift = 0
      }
    }
  }

  if (boat.isStuck) {
    boat.velocity = -(RIVER_SPEED * 2)
    // console.log('Is stuck...', boat.velocity)
  }
  else if (now - boat.lastStrokeUpdate > 500 && boat.velocity > 0) {
    // console.log('Friction unstuck...')
    boat.setUnstuck()
    boat.velocity -= boat.wF
    if (boat.velocity < 0) {
      boat.resetVelocity()
    }
  }
}

boat.runFrameUpdate = () => {
  boat.render()
  boat.applyWaterFriction()
}

boat.checkForOutOfBounds = (x) => {
  if (x >= CANVAS_WIDTH - boat.width - 20) {
    boat.x = CANVAS_WIDTH - boat.width - 20
    boat.drift = 0
  }
  if (x <= 0 + 10) {
    boat.x = 10
    boat.drift = 0
  }
}
/** BOAT RENDER */
boat.render = () => {
  const renderXOffset = 12

  spawnRipple()

  boat.x += boat.drift * 4
  boat.checkForOutOfBounds(boat.x)
  boat.roundX = Math.round(boat.x) // Math.round(boat.x / boat.scaleFx)
  boat.roundY = Math.round(boat.y) // Math.round(boat.y / boat.scaleFx)

  ctx.save()
  boat.lS.render(boat.roundX, boat.roundY)
  boat.rS.render(boat.roundX + renderXOffset, boat.roundY)
  ctx.restore()
}

boat.rR = () => {
  for (let i = 0;i < ripples.length; i += 1) {
    const ripple = ripples[i]
    const y = ripple.y -= getRenderAdjustAmount(boat.velocity)
    ripple.update()
    ctx.save()
    ctx.globalAlpha = ripple.opacity
    ripple.render(ripple.x, y)
    ripple.opacity -= 0.005
    if (ripple.opacity <= 0) {
      ripples.splice(i, 1)
      i -= 1
    }
    ctx.restore()
  }
}

boat.fadeOut = () => {
  if (boat.velocity !== 0) {
    boat.resetVelocity()
  }
  if (boat.opacity > 0) {
    ctx.save()

    boat.opacity -= 0.05
    ctx.globalAlpha = boat.opacity

    console.log('OP', boat.opacity)

    boat.render()
    ctx.restore()
  }
}
/* #endregion */

/* #region RIVER */
river = {}
river.init = () => {
  river.bD = 27 // bodyDimensions
  river.bodiesInRow = Math.ceil(CANVAS_WIDTH / river.bD)
  river.rIBC = Math.ceil(CANVAS_HEIGHT / river.bD) + 2 // rowsInBodyColumn
  river.bXD = 25 // borderXDimension
  river.bYD = 240 // borderYDimension
  river.bordersInColumn = 3
  river.bordersLeft = []
  river.bordersRight = []
  river.borderImage = new Image()
  river.borderImage.src = borderSrc
  river.bodyImage = new Image()
  river.bodyImage.src = bodySrc
  river.current = RIVER_SPEED
  river.bodyColumns = []
  river.mBTY = 0 // maxBodyTileY
  river.mnBTY = 0 // minBodyTileY
  river.makeBorderLeft()
  river.makeBorderRight()
  river.makeBodySprites()
}

river.reset = () => {
  river.current = RIVER_SPEED
}

// river.getRenderAdjustAmount = (velocity) => (river.current * 2) + velocity

/**
   * BORDER methods
   */
river.getBorderBasePositions = () => ({
  left: {
    x: 0,
    y: -river.bXD,
  },
  right: {
    x: -river.bYD,
    y: CANVAS_WIDTH - river.bXD,
  },
})

river.getLeftBorderYPos = (yPos, index) => (yPos + ((index - 1) * river.bYD))

river.getRightBorderYPos = (yPos, index) => (yPos + ((index - 1) * river.bYD))

river.makeBorderLeft = () => {
  const startPos = river.getBorderBasePositions()

  river.makeBorderSprites(startPos.left.x, startPos.left.y, 90, river.bordersLeft)
}

river.makeBorderRight = () => {
  const startPos = river.getBorderBasePositions()

  river.makeBorderSprites(startPos.right.x, startPos.right.y, -90, river.bordersRight)
}

river.makeBorderSprites = (xPos, yPos, rotation, arr) => {
  for (let i = 0; i < river.bordersInColumn; i += 1) {
    const sprite = river.makeBorderSprite(xPos, yPos, rotation, i)

    // console.log('Made sprite, sprite y', sprite.y)
    // console.log('Made sprite, sprite X', sprite.x)
    arr.push(sprite)
  }
}

river.makeBorderSprite = (xPos, yPos, rotation, i) => {
  let x
  let y

  if (Math.abs(rotation) === rotation) {
    y = yPos
    x = river.getLeftBorderYPos(xPos, i)
    // console.log('LEFT sprite', x, y, xPos, i)
  }
  else {
    y = yPos
    x = river.getRightBorderYPos(xPos, i)
    // console.log('LEFT sprite', x, y, xPos, i)
  }

  return makeSprite(
    {
      context: ctx,
      width: river.bYD,
      height: river.bXD,
      image: river.borderImage,
      numberOfFrames: 0,
      x, // this is actually the Y value ... rotation ...
      y, // this is actually the X value ... rotation ...
      rotation,
    },
  )
}

river.addBordersAbove = () => {
  const startPos = river.getBorderBasePositions()

  river.bordersLeft.unshift(river.makeBorderSprite(river.bordersLeft[0].x, startPos.left.y, 90, 0))
  river.bordersRight.push(river.makeBorderSprite(river.bordersRight[river.bordersRight.length - 1].x, startPos.right.y, -90, 2))

  if (river.bordersLeft.length > 4) {
    river.bordersLeft.splice(river.bordersLeft.length - 1, 1)
  }
  if (river.bordersRight.length > 4) {
    river.bordersRight.splice(0, 1)
  }

  console.log('Added above ... ', river.bordersLeft.length, river.bordersRight.length)
}

river.addBordersBelow = () => {
  const startPos = river.getBorderBasePositions()

  // console.log('Add border', startPos, , river.bordersLeft[river.bordersLeft.length - 1].y)

  river.bordersLeft.push(river.makeBorderSprite(river.bordersLeft[river.bordersLeft.length - 1].x, startPos.left.y, 90, 2))
  river.bordersRight.unshift(river.makeBorderSprite(river.bordersRight[0].x, startPos.right.y, -90, 0))

  if (river.bordersLeft.length > 4) {
    river.bordersLeft.splice(0, 1)
  }
  if (river.bordersRight.length > 4) {
    river.bordersRight.splice(river.bordersRight.length - 1, 1)
  }

  console.log('Added below ... ', river.bordersLeft.length, river.bordersRight.length)
}

/**
   * BODY methods
   */
river.getBodySpriteYPos = (index) => ((index * river.bD) - river.bD)

river.makeBodySprites = () => {
  for (let i = 0; i < river.rIBC; i += 1) {
    if (i === 0) {
      river.mnBTY = river.getBodySpriteYPos(i)
    }
    if (i === river.rIBC - 1) {
      river.mBTY = river.getBodySpriteYPos(i)
    }

    river.bodyColumns.push(river.makeSpriteRow(i))
  }

  console.log('BODY COLUMNS', river.bodyColumns)
}

river.makeSpriteRow = (index) => {
  const spriteRow = []

  for (let n = 0; n < river.bodiesInRow; n += 1) {
    const x = n * river.bD
    const y = river.getBodySpriteYPos(index)
    const sprite = makeSprite(
      {
        context: ctx,
        width: 135,
        height: river.bD,
        image: river.bodyImage,
        numberOfFrames: 5,
        x,
        y,
      },
    )

    sprite.goToFrame(random(0, 4))
    spriteRow.push(sprite)
  }

  return spriteRow
}

river.unshiftRowToColumns = () => {
  // Add new row at start. Remove row at end.
  river.bodyColumns.unshift(river.makeSpriteRow(0))
  if (river.bodyColumns.length > river.rIBC + 2) {
    river.bodyColumns.splice(river.bodyColumns.length - 1, 1)
  }
}

river.pushRowToColumns = () => {
  // Add new row at end, remove row at start.
  river.bodyColumns.push(river.makeSpriteRow(river.rIBC - 1))
  if (river.bodyColumns.length > river.rIBC + 2) {
    river.bodyColumns.shift()
  }
}

/**
    * GENERAL methods
    */
river.render = (velocity) => {
  river.renderBody(velocity)
  river.renderBorder(velocity)
}

river.renderBody = (velocity) => {
  const maxY = river.bodyColumns[river.bodyColumns.length - 1][0].y
  const minY = river.bodyColumns[0][0].y

  if (maxY < river.mBTY - river.bD) {
    river.pushRowToColumns(maxY, river.mnBTY + river.bD)
  }
  else if (minY > river.mnBTY + river.bD) {
    river.unshiftRowToColumns(river.mBTY - river.bD)
  }

  for (let i = 0; i < river.bodyColumns.length; i += 1) {
    for (let n = 0; n < river.bodiesInRow; n += 1) {
      const sprite = river.bodyColumns[i][n]

      sprite.y -= getRenderAdjustAmount(velocity) + 0.15

      river.bodyColumns[i][n].render()
    }
  }
}

river.renderBorder = (velocity) => {
  if (river.bordersLeft[0].x >= 0) {
    river.addBordersAbove()
  }
  if (river.bordersLeft[river.bordersLeft.length - 1].x <= 0) {
    river.addBordersBelow()
  }

  for (let i = 0; i < river.bordersLeft.length; i += 1) {
    // Unshift LEFT at GREATER THAN 0
    // Push LEFT at LESS THAN 0
    const sprite = river.bordersLeft[i]

    sprite.x -= getRenderAdjustAmount(velocity)
    sprite.render()
  }
  for (let i = 0; i < river.bordersRight.length; i += 1) {
    // Unshift RIGHT at LESS THAN -720
    // Push RIGHT at GREATER THAN 240
    const sprite = river.bordersRight[i]

    sprite.x += getRenderAdjustAmount(velocity)
    sprite.render()
  }
}
/* #endregion */

/* #region TUTORIAL */
tutorial = {}

tutorial.init = () => {
  tutorial.thumbImage = new Image()
  tutorial.thumbImage.src = thumbPath
  tutorial.thumbWidth = 17
  tutorial.thumbHeight = 35
  tutorial.running = false
  tutorial.thumbSpeed = undefined
  tutorial.cTS = 0
  tutorial.cookieName = 'tutorial'
  tutorial.hasBeenSeen = getCookie(tutorial.cookieName)
  let step1
  let step2
  let step3
  let step4

  tutorial.steps = [step1, step2, step3, step4]
  tutorial.setSlowThumbspeed()

  tutorial.backBtn = makeButton(
    BACK_TEXT,
    ctx.measureText(BACK_TEXT).width,
    CTX_L_WIDTH,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 5,
    () => {
      console.log('BACK BUTTON PRESSED!')
    },
    { fontSize: 11 },
  )
  tutorial.kblBtn = makeButton(
    LKB_TEXT,
    ctx.measureText(LKB_TEXT).width,
    CTX_L_WIDTH,
    10,
    CANVAS_HEIGHT - 3,
    () => {},
    { fontSize: 10, alignment: 'left' },
  )
  tutorial.kbrBtn = makeButton(
    RKB_TEXT,
    ctx.measureText(RKB_TEXT).width,
    CTX_L_WIDTH,
    CANVAS_WIDTH - 10,
    CANVAS_HEIGHT - 3,
    () => {},
    { fontSize: 10, alignment: 'right' },
  )
}

tutorial.leave = () => {
  tutorial.stopTutorial()
  controls.clearButton(controls.getMainTouchEl(), tutorial.backBtn)
  controls.clearBoatControls()
}

tutorial.setSlowThumbspeed = () => {
  tutorial.thumbSpeed = 2
}

tutorial.setFastThumbspeed = () => {
  tutorial.thumbSpeed = 6
}

tutorial.initRightThumb = () => {
  tutorial.rightThumb = makeSprite({
    context: ctx,
    width: tutorial.thumbWidth,
    height: tutorial.thumbHeight,
    image: tutorial.thumbImage,
    numberOfFrames: 1,
    loop: false,
    ticksPerFrame: 0,
    x: 0,
    y: 0,
  })

  tutorial.rTX = CANVAS_WIDTH - tutorial.thumbWidth - (CANVAS_WIDTH / 3)
  tutorial.rTY = CANVAS_HEIGHT - tutorial.thumbHeight - 10
  tutorial.currentRightThumbStep = 0
  tutorial.rightThumbPath = {
    0: tutorial.rTY,
    1: tutorial.rTY - 50,
    2: tutorial.rTX + 30,
    3: tutorial.rTY,
    4: tutorial.rTX,
  }
  tutorial.rtMockControl = controls.createMockTouchObject(
    'rt',
    // This math is because the `rThumbX value is relative to the original, un-scaled canvas.
    // It has to be scaled, and adjusted to be correct relative to the MID-X that the controls use
    // which is the middle of the viewport
    (tutorial.rTX * SCALE_FACTOR)
      + ((SCREEN_WIDTH - SCALED_WIDTH) / 2),
    tutorial.rTY * SCALE_FACTOR,
  )
  controls.handleNewTouch(tutorial.rtMockControl)
}

tutorial.initLeftThumb = () => {
  tutorial.leftThumb = makeSprite({
    context: ctx,
    width: tutorial.thumbWidth,
    height: tutorial.thumbHeight,
    image: tutorial.thumbImage,
    numberOfFrames: 1,
    loop: false,
    ticksPerFrame: 0,
    x: 0,
    y: 0,
  })

  tutorial.lTX = 0 + (CANVAS_WIDTH / 3)
  tutorial.lTY = CANVAS_HEIGHT - tutorial.thumbHeight - 10

  tutorial.currentLeftThumbStep = 0
  tutorial.leftThumbPath = {
    0: tutorial.lTY,
    1: tutorial.lTY - 50,
    2: tutorial.lTX - 30,
    3: tutorial.lTY,
    4: tutorial.lTX,
  }
  tutorial.ltMockControl = controls.createMockTouchObject(
    'lt',
    // See note above on what this math is doing
    (tutorial.lTX * SCALE_FACTOR)
      + ((SCREEN_WIDTH - SCALED_WIDTH) / 2),
    tutorial.lTY * SCALE_FACTOR,
  )
  controls.handleNewTouch(tutorial.ltMockControl)
}

tutorial.removeThumbs = () => {
  controls.handleRemovedTouch(tutorial.rtMockControl)
  controls.handleRemovedTouch(tutorial.ltMockControl)
}

tutorial.circleRightThumb = () => {
  switch (tutorial.currentRightThumbStep) {
    case 0:
      if (tutorial.rTY > tutorial.rightThumbPath[1]) {
        tutorial.rTY -= tutorial.thumbSpeed
      }
      else {
        tutorial.currentRightThumbStep = 1
      }
      break
    case 1:
      if (tutorial.rTX < tutorial.rightThumbPath[2]) {
        tutorial.rTX += tutorial.thumbSpeed
      }
      else {
        tutorial.currentRightThumbStep = 2
      }
      break
    case 2:
      if (tutorial.rTY < tutorial.rightThumbPath[3]) {
        tutorial.rTY += tutorial.thumbSpeed
      }
      else {
        tutorial.currentRightThumbStep = 3
      }
      break
    case 3:
      if (tutorial.rTX > tutorial.rightThumbPath[4]) {
        tutorial.rTX -= tutorial.thumbSpeed
      }
      else {
        tutorial.currentRightThumbStep = 4
      }
      break
    case 4:
      tutorial.currentRightThumbStep = 0
      break
    default:
      break
  }
  tutorial.rtMockControl.pageX = tutorial.rTX * CANVAS_RATIO
  tutorial.rtMockControl.pageY = tutorial.rTY * CANVAS_RATIO
  controls.handleMovedTouch(tutorial.rtMockControl)
}

tutorial.circleLeftThumb = () => {
  switch (tutorial.currentLeftThumbStep) {
    case 0:
      if (tutorial.lTY > tutorial.leftThumbPath[1]) {
        tutorial.lTY -= tutorial.thumbSpeed
      }
      else {
        tutorial.currentLeftThumbStep = 1
      }
      break
    case 1:
      if (tutorial.lTX > tutorial.leftThumbPath[2]) {
        tutorial.lTX -= tutorial.thumbSpeed
      }
      else {
        tutorial.currentLeftThumbStep = 2
      }
      break
    case 2:
      if (tutorial.lTY < tutorial.leftThumbPath[3]) {
        tutorial.lTY += tutorial.thumbSpeed
      }
      else {
        tutorial.currentLeftThumbStep = 3
      }
      break
    case 3:
      if (tutorial.lTX < tutorial.leftThumbPath[4]) {
        tutorial.lTX += tutorial.thumbSpeed
      }
      else {
        tutorial.currentLeftThumbStep = 4
      }
      break
    case 4:
      tutorial.currentLeftThumbStep = 0
      break
    default:
      break
  }
  tutorial.ltMockControl.pageX = tutorial.lTX * CANVAS_RATIO
  tutorial.ltMockControl.pageY = tutorial.lTY * CANVAS_RATIO
  controls.handleMovedTouch(tutorial.ltMockControl)
}

tutorial.renderTutorial = () => {
  tutorial.backBtn.render(ctx)
  tutorial.kblBtn.render(ctx)
  tutorial.kbrBtn.render(ctx)

  if (!tutorial.isPaused) {
    if (tutorial.cTS === 1
        || tutorial.cTS === 3
        || tutorial.cTS === 4
    ) {
      tutorial.circleLeftThumb()
      tutorial.leftThumb.render(
        tutorial.lTX,
        tutorial.lTY,
      )
    }
    if (tutorial.cTS === 1
        || tutorial.cTS === 2
        || tutorial.cTS === 4
    ) {
      tutorial.circleRightThumb()
      tutorial.rightThumb.render(
        tutorial.rTX,
        tutorial.rTY,
      )
    }
    if (tutorial.cTS === 5) {
      // ...
    }
  }
}

tutorial.runTutorialSteps = () => {
  tutorial.initRightThumb()
  tutorial.initLeftThumb()
  tutorial.hasBeenSeen = 1
  setCookie(tutorial.cookieName, 1)
  tutorial.running = true
  infoDisplay.show()
  // first show both thumbs rowing slowly
  tutorial.setTutorialStep(1)
  infoDisplay.setMessage('Circle thumbs to row!')
  // then show just right thumb
  tutorial.steps[0] = setTimeout(() => {
    tutorial.setTutorialStep(2)
    infoDisplay.setMessage('R thumb - R oar!')
  }, TUTORIAL_SCREEN_DURATION * 1)
  // then show just left thumb
  tutorial.steps[1] = setTimeout(() => {
    tutorial.setTutorialStep(3)
    infoDisplay.setMessage('L thumb - L oar!')
  }, TUTORIAL_SCREEN_DURATION * 2)
  // then show just left thumb
  tutorial.steps[2] = setTimeout(() => {
    tutorial.setTutorialStep(4)
    tutorial.setFastThumbspeed()
    infoDisplay.setMessage('Row fast to go go go!')
  }, TUTORIAL_SCREEN_DURATION * 3)
  tutorial.steps[3] = setTimeout(() => {
    tutorial.setTutorialStep(5)
    tutorial.removeThumbs()
    controls.registerBoatControls()
    infoDisplay.setMessage('Ok, you try!')
  }, TUTORIAL_SCREEN_DURATION * 4)
}

tutorial.stopTutorial = () => {
  tutorial.setTutorialStep(0)
  tutorial.steps.forEach((step, i) => {
    console.log('Step?', i, step)
    if (step) {
      clearTimeout(step)
    }
  })
  tutorial.setSlowThumbspeed()
  infoDisplay.setMessage('')
  tutorial.removeThumbs()
  infoDisplay.hide()
  tutorial.running = false
}

tutorial.setTutorialStep = (step) => {
  tutorial.cTS = step
}

/* #endregion */

/* #region INITIAL MSG */
initialMsg = {}

initialMsg.__init = () => {
  initialMsg.__start = Date.now()
  initialMsg.__dT = 4000
  initialMsg.__display = true
  initialMsg.__opacity = .50
  initialMsg.__opMod = 1
  initialMsg.__arrowImg = new Image()
  initialMsg.__arrowImg.src = arrowSrc

  initialMsg.__arrowSprite = makeSprite({
    context: ctx,
    width: 28,
    height: 42,
    image: initialMsg.__arrowImg,
    numberOfFrames: 1,
    ticksPerFrame: 100,
    loop: true,
    x: (CANVAS_WIDTH / 2) - 14,
    y: 135,
  })

  initialMsg.__onoTxt = makeButton(
    '"OH NO...',
    ctx.measureText('"OH NO...').width,
    CTX_L_WIDTH,
    CANVAS_WIDTH / 2,
    65,
    () => {},
    { fontSize: 17, alignment: 'center' },
  )

  initialMsg.__ljTxt = makeButton(
    'LOGJAM!!!"',
    ctx.measureText('LOGJAM!!!"').width,
    CTX_L_WIDTH,
    CANVAS_WIDTH / 2,
    85,
    () => {},
    { fontSize: 17, alignment: 'center' },
  )

  initialMsg.__rowTxt = makeButton(
    'ROW BACK UPSTREAM!',
    ctx.measureText('ROW BACK UPSTREAM!').width,
    CTX_L_WIDTH,
    CANVAS_WIDTH / 2,
    125,
    () => {},
    { fontSize: 10, alignment: 'center' },
  )

  // initialMsg.__arrTxt = makeButton(
  //   '|.|',
  //   ctx.measureText('|.|').width,
  //   CTX_L_WIDTH,
  //   CANVAS_WIDTH / 2,
  //   165,
  //   () => {},
  //   { fontSize: 35, alignment: 'center' },
  // )

  initialMsg.__render = () => {
    if (initialMsg.__display) {
      if (Date.now() > initialMsg.__start + initialMsg.__dT) {
        initialMsg.__display = false
      }
      ctx.save()
      ctx.globalAlpha = initialMsg.__opacity
      initialMsg.__onoTxt.render()
      initialMsg.__ljTxt.render()
      initialMsg.__rowTxt.render()
      // initialMsg.__arrTxt.render()
      initialMsg.__arrowSprite.render()
      ctx.restore()

      initialMsg.__opacity += (.05 * initialMsg.__opMod)

      if (initialMsg.__opacity >= 1 || initialMsg.__opacity <= .5) {
        initialMsg.__opMod *= -1
      }
    }
  }
}
/* #endregion */

/* #region GAME */
game = {}

game.init = (goToBackScreen, sound) => {
  game.sound = sound
  game.startTime = Date.now()
  game.rescueTime = 1000
  game.paused = false
  game.resetDifficulty()
  game.goToBackScreen = goToBackScreen
  game.quitBtn = makeButton(QUIT_TEXT, ctx.measureText(QUIT_TEXT).width, CTX_L_WIDTH, 10, 10, () => {
    game.leave()
    controls.clearBoatControls()
  }, { fontSize: 10, alignment: 'left' })
  game.__pauseTxt =  makeButton(
    'PAUSED',
    ctx.measureText('PAUSED').width,
    CTX_L_WIDTH,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    () => {},
    { fontSize: 30, alignment: 'center' },
  )
  game.pauseBtn = makeButton(
    PAUSE_TEXT,
    ctx.measureText(PAUSE_TEXT).width,
    CTX_L_WIDTH,
    CANVAS_WIDTH - 10,
    10,
    () => {
      game.paused = !game.paused
      if (game.paused) {
        game.__pauseTxt.render()
        console.log('PAUSE')
        sound.mute()
      }
      else {
        sound.unmute()
      }
    },
    { fontSize: 10, alignment: 'right' },
  )

  game.gameOverBtn = makeButton(
    'GAMEOVER',
    ctx.measureText('GAMEOVER').width,
    CTX_L_WIDTH,
    CANVAS_WIDTH / 2,
    110,
    () => {
      game.leave()
    },
    { fontSize: 25, alignment: 'center' },
  )

  game.__distanceRowed = 0
  game.score = makeButton(
    game.scoreText(),
    ctx.measureText(game.scoreText()).width,
    CTX_L_WIDTH,
    CANVAS_WIDTH / 2,
    29,
    () => {
      console.log('PAUSE BUTTON PRESSED!')
    },
    { fontSize: 20, alignment: 'center' },
  )
}
game.scoreText = () => `${game.__distanceRowed}m`

game.resetDifficulty = () => {
  game.difficulty = 0
}

game.updateDifficulty = (distance) => {
  game.difficulty = Math.floor(distance / 100)
}

game.goTo = () => {
  controls.registerButton(controls.getMainTouchEl(), game.quitBtn)
  controls.registerButton(controls.getMainTouchEl(), game.pauseBtn)
}

game.leave = () => {
  controls.clearButton(controls.getMainTouchEl(), game.quitBtn)
  controls.clearButton(controls.getMainTouchEl(), game.gameOverBtn)
  controls.clearButton(controls.getMainTouchEl(), game.pauseBtn)
  game.goToBackScreen()
}

game.updateScore = (distance) => {
  game.__distanceRowed = Math.floor((distance / 3))
  game.score.name = game.scoreText()

  game.updateDifficulty(game.__distanceRowed)
}

game.render = (distanceRowed) => {
  game.updateScore(distanceRowed)

  game.quitBtn.render(ctx)
  game.pauseBtn.render(ctx)
  game.score.render(ctx)
}

game.renderGameOver = () => {
  game.gameOverBtn.render(ctx)
}
/* #endregion */

/* #region HOME */
home.init = (hs) => {
  home.hs = `Best: ${Math.floor(hs / 3) || 0}m`
  home.title = 'ROW'
  home.initialTitleX = CANVAS_WIDTH / 2
  home.initialTitleY = CANVAS_HEIGHT / 2
  home.currentTitleY = CANVAS_HEIGHT / 2
  home.playBtnDimentions = undefined
  home.tutorialBtnDimensions = undefined

  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = '20px Courier'
  const approxHeight = CTX_L_WIDTH

  home.playBtn = makeButton(
    PLAY_TEXT,
    ctx.measureText(PLAY_TEXT).width,
    approxHeight,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 1.65,
    () => {
      console.log('PLAY BUTTON PRESSED!')
    },
    { fontSize: 16 },
  )
  home.tutorialBtn = makeButton(
    TUT_TEXT,
    ctx.measureText(TUT_TEXT).width,
    approxHeight,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 1.35,
    () => {
      console.log('TUTORIAL BUTTON PRESSED!')
    },
    { fontSize: 16 },
  )
  home.hsText = makeButton(
    home.hs,
    ctx.measureText(home.hs).width,
    approxHeight,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 1.15,
    () => {},
    { fontSize: 10 },
  )
  ctx.restore()
}


home.updateHs = (score) => {
  home.hs = `Best: ${Math.floor(score / 3) || 0}m`
  home.hsText.name = home.hs
}

home.renderInitialLoad = () => {
  home.renderTitle(home.initialTitleX, home.initialTitleY)
}

home.renderTitle = (x, y) => {
  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = '62px Courier'
  ctx.fillText(home.title, x, y)
  ctx.restore()
}

home.renderMenu = () => {
  // ctx.save()
  // ctx.textAlign = 'center'
  // ctx.fillStyle = '#ffffff'
  // ctx.font = '20px Courier'

  home.playBtn.render(ctx)
  home.tutorialBtn.render(ctx)
  home.hsText.render(ctx)

  // ctx.restore()
}

home.renderMainScreen = () => {
  if (home.currentTitleY > 60) {
    home.currentTitleY -= 1
    home.renderTitle(home.initialTitleX, home.currentTitleY)
  }
  else {
    home.renderTitle(home.initialTitleX, home.currentTitleY)
    home.renderMenu()
  }
  // home.renderTitle(home.initialTitleX, 60)
  // home.renderMenu()
}
/* #endregion */

/* #region COLLISION MANAGER */
collisionManager.__init = (ctx, colSound) => {
  collisionManager.__ctx = ctx
  collisionManager.__boatY = undefined
  collisionManager.__hasCollision = false
  collisionManager.__colSound = colSound

  collisionManager.__collisions = 0
  collisionManager.__lastCollisionAt = 0
}

collisionManager.__addLife = () => {
  sound.addLife()
  if (collisionManager.__collisions > 0) {
    collisionManager.__collisions -= 1
  }
}

collisionManager.__setup = (boat) => {
  // collisionManager.__boatY = boat.y / SCALE_FACTOR
  collisionManager.__boatWidth = boat.width
  collisionManager.__boatHeight = boat.height
}

collisionManager.__reset = () => {
  collisionManager.__collisions = 0
  collisionManager.__lastCollisionAt = 0
}

collisionManager.__addCollision = () => {
  const now = Date.now()

  if (now > collisionManager.__lastCollisionAt + 500) {
    collisionManager.__colSound()
    collisionManager.__collisions += 1
    collisionManager.__lastCollisionAt = now
  }
}

collisionManager.__broadPhaseCheck = (boat, obstacles) => {
  const boatBox = boat.getBBD()

  obstacles.forEach((obstacle) => {
    const obstacleBox = obstacle.getObstacleBodyDimensions()

    if (
      boatBox.maxX > obstacleBox.minX
        && boatBox.minX < obstacleBox.maxX
        && boatBox.maxY > obstacleBox.minY
        && boatBox.minY < obstacleBox.maxY
    ) {
      collisionManager.__narrowPhaseCheck(boatBox, boat, obstacleBox, obstacle)
    }
    if (buoy.__active) {
      if (
        buoy.__sprite.y < obstacle.y + obstacle.height - 3
        && buoy.__sprite.y > obstacle.y
        && buoy.__sprite.x + 6 > obstacle.x
        && buoy.__sprite.x < obstacle.x + obstacle.frameWidth) {

        if (buoy.__sprite.x > obstacle.x + obstacle.frameWidth - 7) {
          if (
            buoy.__sprite.y < obstacle.y + obstacle.height - 15
            && buoy.__sprite.x < obstacleBox.maxX + 3
            ) {
            buoy.__stuck = true
          }
        }
        else {
          buoy.__stuck = true
        }
      }
    }
  })
}

collisionManager.__narrowPhaseCheck = (boatBox, boat, obstacleBox) => {
  // console.log('Y: ', boatBox.maxY, obstacleBox.midY)
  // console.log('X: ', boatBox.maxX, obstacleBox.midX, obstacleBox.quadSize)
  let buffer = 0

  if (
    boatBox.maxX < obstacleBox.midX - obstacleBox.quadSize
      && boatBox.maxY < obstacleBox.midY
  ) {
    // console.log('NW Quad...')
    buffer = obstacleBox.quadSize
  }
  else if (
    boatBox.maxX > obstacleBox.midX + obstacleBox.quadSize
      && boatBox.maxY < obstacleBox.midY
  ) {
    // console.log('NE Quad...')
    buffer = obstacleBox.quadSize
  }
  else if (
    boatBox.minX > obstacleBox.midX + obstacleBox.quadSize
      && boatBox.minY > obstacleBox.midY
  ) {
    // console.log('SE Quad...')
    buffer = obstacleBox.quadSize
  }
  else if (
    boatBox.maxX < obstacleBox.midX - obstacleBox.quadSize
      && boatBox.minY > obstacleBox.midY
  ) {
    // console.log('SW Quad...')
  }

  if (
    boatBox.maxY > obstacleBox.maxY
      && boatBox.maxY - obstacleBox.maxY > boat.height / 6
      && boatBox.minX > obstacleBox.minX
      && boatBox.maxX < obstacleBox.maxX
  ) {
    // Boat is stuck on the obstacle! Hold it in place...
    // console.log('SET STUCK!')
    boat.setStuck()
    collisionManager.__addCollision()
  }
  else if (boatBox.maxY > obstacleBox.minY + buffer) {
    // console.log('BOUNCE OFF')
    boat.resetVelocity()
    collisionManager.__addCollision()
  }

  if (
    boatBox.minX < obstacleBox.maxX - buffer
        && boatBox.maxX > obstacleBox.maxX
  ) {
    // console.log('BOUNCE RIGHT')
    boat.bounceRight()
    collisionManager.__addCollision()
  }
  if (
    boatBox.maxX > obstacleBox.minX + buffer
        && boatBox.minX < obstacleBox.minX
  ) {
    // console.log('BOUNCE LEFT')
    boat.bounceLeft()
    collisionManager.__addCollision()
  }
  // else {
  //   boat.setUnstuck()
  // }
}
/* #endregion */

/* #region OBSTACLE MANAGER */
obstacleManager.__init = (ctx) => {
  obstacleManager.__ctx = ctx
  obstacleManager.__obstacles = []
  obstacleManager.__waterfall = []
  obstacleManager.__spawnKey = 7
  obstacleManager.__spawnFrequency = 150
  obstacleManager.__maxSpawnFrequency = 30
  obstacleManager.__lastSpawnAt = 0
}

obstacleManager.__makeWaterfall = () => {
  let waterfallObjects = 50

  while (waterfallObjects > 0) {
    obstacleManager.__waterfall.push(obstacleManager.__spawnRock(null, random(-10, -140)))
    obstacleManager.__waterfall.push(obstacleManager.__spawnTree(null, random(-10, -140)))
    waterfallObjects -= 1
  }
}

obstacleManager.__render = (velocity) => {
  obstacleManager.__renderWaterfall(velocity)
  obstacleManager.__renderObstacles(velocity)
}

obstacleManager.__renderWaterfall = (velocity) => {
  obstacleManager.__waterfall.forEach((item) => {
    item.render(velocity)
  })
}

obstacleManager.__renderObstacles = (velocity) => {
  obstacleManager.__obstacles.forEach((obstacle) => {
    obstacle.render(velocity)
  })
}

obstacleManager.__trySpawnObstacle = (distance, difficulty) => {
  const spawnDifficulty = obstacleManager.__spawnFrequency - (DIFFICULTY_MULTIPLYER * difficulty)
  const spawnCheckNum = spawnDifficulty < obstacleManager.__maxSpawnFrequency ? obstacleManager.__maxSpawnFrequency : spawnDifficulty
  const canSpawnNum = distance - spawnCheckNum

  if (canSpawnNum > obstacleManager.__lastSpawnAt) {
    if (random(1, 20) === obstacleManager.__spawnKey) {
      // console.log('SPAWNING:', spawnDifficulty)
      obstacleManager.__spawnObstacle()

      obstacleManager.__lastSpawnAt = distance
    }
  }
}

obstacleManager.__spawnObstacle = () => {
  const type = random(1, 2)
  let obstacle

  if (type === 1) {
    obstacle = obstacleManager.__spawnRock()
  }
  else {
    obstacle = obstacleManager.__spawnTree()
  }

  obstacleManager.__obstacles.push(obstacle)
}

obstacleManager.__spawnTree = (x, y) => {
  const tree = makeTree(ctx)

  tree.x = x || random(tree.minX, tree.maxX)
  tree.y = y || random(CANVAS_HEIGHT, CANVAS_HEIGHT + 25)

  return tree
}

obstacleManager.__spawnRock = (x, y) => {
  const rock = makeRock(ctx)

  rock.x = x || random(rock.minX, rock.maxX)
  rock.y = y || random(CANVAS_HEIGHT, CANVAS_HEIGHT + 25)

  return rock
}
/* #endregion */

/* #region TREE */
makeTree = (ctx) => {
  const tree = {}

  tree.getObstacleBodyDimensions = () => ({
    minY: tree.y + 10,
    maxX: tree.x + 22,
    maxY: tree.y + 25,
    minX: tree.x + 6,
    midX: tree.x + 14,
    midY: tree.y + 14,
    quadSize: 5,
  })

  

  tree.render = (velocity) => {
    tree.y -= getRenderAdjustAmount(velocity)

    tree.sprite.update()
    tree.sprite.render(tree.x, tree.y)
  }

  tree.init = (ctx) => {
    tree.ctx = ctx

    tree.image = new Image()
    tree.image.src = treeSrc

    tree.height = 28
    tree.width = 84
    tree.frames = 3
    tree.frameWidth = tree.width / tree.frames
    tree.minX = 6
    tree.maxX = 102
    tree.collisionOffsets = {
      n: 0,
      ne: 9,
      e: 6,
      se: 9,
      s: 3,
      sw: 6,
      w: 5,
      nw: 20,
    }
    tree.x = tree.maxX - 10
    tree.y = 100
    tree.sprite = makeSprite({
      context: tree.ctx,
      width: tree.width,
      height: tree.height,
      image: tree.image,
      numberOfFrames: tree.frames,
      ticksPerFrame: 10,
      loop: true,
      x: tree.x,
      y: tree.y,
    })

    return tree
  }

  return tree.init(ctx)
}
/* #endregion */

/* #region ROCK */
makeRock = (ctx) => {
  const rock = {}

  rock.getObstacleBodyDimensions = () => ({
    minY: rock.y + 5,
    maxX: rock.x + 26,
    maxY: rock.y + 27,
    minX: rock.x + 7,
    midX: rock.x + 16,
    midY: rock.y + 15,
    quadSize: 6,
  })
  
  // rock.getRenderAdjustAmount = (velocity) => (RIVER_SPEED * 2) + velocity
  
  rock.render = (velocity) => {
    rock.y -= getRenderAdjustAmount(velocity)
  
    rock.sprite.update()
    rock.sprite.render(rock.x, rock.y)
  }

  rock.init = (ctx) => {
    rock.ctx = ctx
    rock.image = new Image()
    rock.image.src = rockSrc
    rock.height = 29
    rock.width = 96
    rock.frames = 3
    rock.frameWidth = rock.width / rock.frames
    rock.minX = 6
    rock.maxX = 98
    rock.collisionOffsets = {
      n: 4,
      ne: 10,
      e: 6,
      se: 10,
      s: 2,
      sw: 8,
      w: 6,
      nw: 11,
    }
    rock.x = rock.minX + 10
    rock.y = 200
    rock.sprite = makeSprite({
      context: rock.ctx,
      width: rock.width,
      height: rock.height,
      image: rock.image,
      numberOfFrames: rock.frames,
      ticksPerFrame: 10,
      loop: true,
      x: rock.x,
      y: rock.y,
    })

    return rock
  }

  return rock.init(ctx)
}
/* #endregion */

/* #region BUTTON */
makeButton = (name, width, height, x, y, action, options = {}) => {
  const button = {}

  button.setScaledMinMax = () => {
    button.xMin = (button.oX - (button.width / 2)) * SCALE_FACTOR
    button.yMin = (button.oY - (button.height * 1.2)) * SCALE_FACTOR
    button.xMax = (button.oX + button.width) * SCALE_FACTOR
    button.yMax = (button.oY + (button.height / 2)) * SCALE_FACTOR
  }

  button.render = () => {
    ctx.save()
    ctx.textAlign = button.alignment
    ctx.fillStyle = '#ffffff'
    ctx.font = `${button.fontSize}px Courier`
    ctx.fillText(
      button.name,
      button.oX,
      button.oY,
    )
    ctx.restore()
  }

  button.init = () => {
    button.name = name
    button.fontSize = options.fontSize || 20
    button.alignment = options.alignment || 'center'
    button.width = width
    button.height = height
    button.oX = x
    button.oY = y

    button.xMin = (x - (button.width / 2)) * SCALE_FACTOR
    button.yMin = (y - (button.height * 1.2)) * SCALE_FACTOR
    button.xMax = (x + button.width) * SCALE_FACTOR
    button.yMax = (y + (button.height / 2)) * SCALE_FACTOR

    button.action = action

    return button
  }

  return button.init()
}
/* #endregion */

/* #region MAKE SPRITE */
makeSprite = (options) => {
  const that = {}
  let frameIndex = 0
  let tickCount = 0
  const ticksPerFrame = options.ticksPerFrame || 0
  const numberOfFrames = options.numberOfFrames || 1

  that.context = options.context
  that.width = options.width
  that.height = options.height
  that.image = options.image
  that.loop = options.loop || false
  that.x = options.x
  that.y = options.y
  that.frameIndex = 0
  that.opacity = options.opacity
  that.rotation = options.rotation

  that.currentFrame = () => frameIndex

  that.resetTickCount = () => {
    tickCount = 0
  }

  that.render = (x, y) => {
    // // Clear the canvas
    // that.context.clearRect(that.x, that.y, that.width, that.height)
    if (x || y) {
      that.x = x
      that.y = y
    }

    // Draw the animation
    if (that.rotation) {
      that.context.save()
      that.context.translate(0, 0)
      that.context.rotate(that.rotation * (Math.PI / 180))
    }

    that.context.drawImage(
      that.image,
      frameIndex * (that.width / numberOfFrames),
      0,
      that.width / numberOfFrames,
      that.height,
      that.x,
      that.y,
      that.width / numberOfFrames,
      that.height,
    )

    if (that.rotation) {
      that.context.restore()
    }
  }


  that.update = () => {
    tickCount += 1

    if (tickCount > ticksPerFrame) {
      tickCount = 0
      // If the current frame index is in range
      if (frameIndex < numberOfFrames - 1) {
        // Go to the next frame
        frameIndex += 1
      }
      else if (that.loop) {
        frameIndex = 0
      }
    }
  }

  that.goToFrame = (frame) => {
    if (frame < numberOfFrames) {
      frameIndex = frame
    }

    return that
  }

  return that
}
/* #endregion */

/* #region SOUND */
sound.init = (context) => {
  sound.ctx = context
  sound.muted = false
  sound.queueSong = false
  sound.vol = 0.05
}

sound.mute = () => {
  sound.muted = true
  sound.vol = 0
  sound.gainNode.gain.setValueAtTime(sound.vol, sound.ctx.currentTime)
  sound.ctx.suspend()
}

sound.unmute = () => {
  sound.muted = false
  sound.vol = 0.05
  sound.gainNode.gain.setValueAtTime(sound.vol, sound.ctx.currentTime)
  sound.ctx.resume()
}

sound.setup = () => {
  sound.osc = sound.ctx.createOscillator()
  sound.gainNode = sound.ctx.createGain()

  sound.osc.connect(sound.gainNode)
  sound.gainNode.connect(sound.ctx.destination)
  sound.osc.type = 'square'
}

sound.play = (value, time, stopTime = undefined, volume = undefined) => {
  const modVol = volume ? volume * sound.vol : sound.vol

  sound.setup()

  sound.osc.frequency.value = value
  sound.gainNode.gain.setValueAtTime(modVol, sound.ctx.currentTime)

  sound.osc.start(time)

  sound.stop(time, stopTime)
}

sound.stop = (time, stopTime) => {
  // sound.gainNode.gain.exponentialRampToValueAtTime(0.005, time + 0.1)
  sound.osc.stop(time + (stopTime || 0.25))
}

sound.oar = () => {
  sound.play(OAR, sound.ctx.currentTime + 0.05, 0.01, 0.5)
  sound.play(OAR2, sound.ctx.currentTime + 0.075, 0.01, 0.5)
  sound.play(OAR, sound.ctx.currentTime + 0.1, 0.01, 0.5)
}

sound.bump = () => {
  sound.play(DEEP, sound.ctx.currentTime + 0.05, 0.05, 2)
  sound.play(DEEP, sound.ctx.currentTime + 0.1, 0.05, 2)
}

sound.buoy = () => {
  sound.play(C4, sound.ctx.currentTime + 0, .2)
  sound.play(E4, sound.ctx.currentTime + 0.075, .2)
  sound.play(F4, sound.ctx.currentTime + 0.125, .2)
}

sound.addLife = () => {
  sound.play(F4, sound.ctx.currentTime, .05)
  sound.play(G4, sound.ctx.currentTime + .05, .05)
  
}

sound.helo = (vol) => {
  sound.play(DEEP * 1.5, sound.ctx.currentTime, 0.01, vol)
}

sound.song = () => {
  sound.play(C4, sound.ctx.currentTime + 0.75)
  sound.play(C4, sound.ctx.currentTime + 0.875)
  sound.play(C4, sound.ctx.currentTime + 1.25)
  sound.play(C4, sound.ctx.currentTime + 1.375)
  sound.play(C4, sound.ctx.currentTime + 1.75)
  sound.play(C4, sound.ctx.currentTime + 1.875)
  sound.play(D4, sound.ctx.currentTime + 2.00)
  sound.play(D4, sound.ctx.currentTime + 2.125)
  sound.play(E4, sound.ctx.currentTime + 2.25)
  sound.play(E4, sound.ctx.currentTime + 2.375)
  sound.play(E4, sound.ctx.currentTime + 2.75)
  sound.play(E4, sound.ctx.currentTime + 2.875)
  sound.play(D4, sound.ctx.currentTime + 3.00)
  sound.play(D4, sound.ctx.currentTime + 3.125)
  sound.play(E4, sound.ctx.currentTime + 3.25)
  sound.play(F4, sound.ctx.currentTime + 3.50)
  sound.play(G4, sound.ctx.currentTime + 3.75, 0.1)
  sound.play(G4, sound.ctx.currentTime + 3.875, 0.1)
  sound.play(G4, sound.ctx.currentTime + 4.00, 0.1)
  sound.play(G4, sound.ctx.currentTime + 4.125, 0.1)
  sound.play(G4, sound.ctx.currentTime + 4.25, 0.1)
  sound.play(C5, sound.ctx.currentTime + 4.75)
  sound.play(C5, sound.ctx.currentTime + 4.875)
  sound.play(C5, sound.ctx.currentTime + 5.00)
  sound.play(G4, sound.ctx.currentTime + 5.125)
  sound.play(G4, sound.ctx.currentTime + 5.25)
  sound.play(G4, sound.ctx.currentTime + 5.375)
  sound.play(E4, sound.ctx.currentTime + 5.50)
  sound.play(E4, sound.ctx.currentTime + 5.625)
  sound.play(E4, sound.ctx.currentTime + 5.75)
  sound.play(C4, sound.ctx.currentTime + 5.875)
  sound.play(C4, sound.ctx.currentTime + 6.00)
  sound.play(C4, sound.ctx.currentTime + 6.125)
  sound.end(6.00)
}

sound.end = (offset = 0.00) => {
  sound.play(G4, sound.ctx.currentTime + 0.25 + offset)
  sound.play(F4, sound.ctx.currentTime + 0.50 + offset)
  sound.play(F4, sound.ctx.currentTime + 0.625 + offset)
  sound.play(E4, sound.ctx.currentTime + 0.75 + offset)
  sound.play(E4, sound.ctx.currentTime + 0.875 + offset)
  sound.play(D4, sound.ctx.currentTime + 1.00 + offset)
  sound.play(C4, sound.ctx.currentTime + 1.25 + offset)
}

const sCtx = new (window.AudioContext || window.webkitAudioContext)()

sound.init(sCtx)

/* #endregion */

/* #region INFO DISPLAY */
infoDisplay.init = () => {
  infoDisplay.isInit = false
  infoDisplay.textbox = document.createElement('div')
  infoDisplay.textbox.style.fontSize = '20px'
  infoDisplay.textbox.style.fontWeight = 'bold'
  infoDisplay.textbox.style.position = 'absolute'
  infoDisplay.textbox.style.top = 0
  infoDisplay.textbox.style.left = '50%'
  infoDisplay.textbox.style.transform = 'translateX(-50%)'
  infoDisplay.textbox.style.padding = '16px 20px'
  infoDisplay.textbox.style.boxSizing = 'border-box'
  infoDisplay.textbox.style.color = '#ffffff'
  infoDisplay.textbox.style.backgroundColor = '#707070'
  infoDisplay.hide()
}
infoDisplay.setup = (parentNode, siblingNode, width) => {
  if (!infoDisplay.isInit) {
    infoDisplay.textbox.style.width = `${width}px`
    parentNode.insertBefore(infoDisplay.textbox, siblingNode)
    infoDisplay.isInit = true
  }
}

infoDisplay.setMessage = (message) => {
  infoDisplay.textbox.innerHTML = message
}

infoDisplay.show = () => {
  infoDisplay.textbox.style.opacity = 1
  infoDisplay.textbox.style.display = 'block'
}

infoDisplay.hide = () => {
  infoDisplay.textbox.style.opacity = 0
  infoDisplay.textbox.style.display = 'none'
}

infoDisplay.init()
/* #endregion */

/**
 * Set the event listener that will load the game
 */
function monStart() {
  if (document.monetization.state === 'started') {
    SPAWN_INTERVAL = 300
    DIFFICULTY_MULTIPLYER = 10
  }
}

if (document.monetization) {
  console.log('Found monetization!')
  document.monetization.addEventListener('monetizationstart', monStart)
}

window.addEventListener('load', () => {
  console.log('-- window _ load --')

  window.addEventListener('keydown', handleKeyboardControl)
  initializeGame(mainLoop)
})
/* eslint-enable */
