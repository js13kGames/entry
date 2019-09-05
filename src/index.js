import Game from './game'

// set canvas size
const canvas = document.getElementById('game')
canvas.width = canvas.parentElement.clientWidth
canvas.height = canvas.parentElement.clientHeight

// show splash
const newGameSplash = document.getElementById('new-game')
const gameOverSplash = document.getElementById('game-over')
const gameBeatenSplash = document.getElementById('game-beaten')
newGameSplash.style.opacity = 1

// press Z to start
document.addEventListener('keypress', checkStartKey)

let game = null

function checkStartKey(ev) {
  if (ev.key === 'z') {
    game = new Game(canvas)
    game.onGameOver = () => {
      splashFade(gameOverSplash, true, () => {
        game = null
        document.addEventListener('keypress', checkStartKey)
      })
    }
    game.onGameBeaten = () => {
      splashFade(gameBeatenSplash, true, () => {
        game = null
        document.addEventListener('keypress', checkStartKey)
      })
    }

    const splash = newGameSplash.style.opacity === '1' ? newGameSplash : 
      (gameOverSplash.style.opacity === '1' ? gameOverSplash : gameBeatenSplash)
    splashFade(splash, false, () => {
      game.start()
      document.removeEventListener('keypress', checkStartKey)
    })
  }
}

function splashFade(splash, fadeIn, callback) {
  const splashInterval = setInterval(() => {
    splash.style.opacity -= (fadeIn ? -1 : 1) * 100 / 2000
    if (fadeIn && parseFloat(splash.style.opacity) >= 1 || !fadeIn && parseFloat(splash.style.opacity) <= 0) {
      clearInterval(splashInterval)
      callback()
    }
  }, 100)
}
