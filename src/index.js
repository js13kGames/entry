import Game from './game'

// set canvas size
const canvas = document.getElementById('game')
canvas.width = canvas.parentElement.clientWidth
canvas.height = canvas.parentElement.clientHeight

// show splash
const newGameSplash = document.getElementById('new-game')
const gameOverSplash = document.getElementById('game-over')
newGameSplash.style.opacity = 1

// press Z to start
document.addEventListener('keypress', checkStartKey)

let game = null

function checkStartKey(ev) {
  if (ev.key === 'z') {
    game = new Game(canvas)
    game.onGameOver = () => {
      gameOverSplash.style.opacity = 1
      game = null
      document.addEventListener('keypress', checkStartKey)
    }

    const splash = newGameSplash.style.opacity === '1' ? newGameSplash : gameOverSplash
    const splashInterval = setInterval(() => {
      splash.style.opacity -= 100 / 2000
      if (splash.style.opacity <= 0) {
        game.start()
        clearInterval(splashInterval)
        document.removeEventListener('keypress', checkStartKey)
      }
    }, 100)
  }
}
