import Game from './game'

// set canvas size
const canvas = document.getElementById('game')
canvas.width = canvas.parentElement.clientWidth
canvas.height = canvas.parentElement.clientHeight

const game = new Game(canvas)
game.onGameOver = () => {
  alert('game over')
}
game.start()