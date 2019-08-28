import {
  init,
  Sprite,
  GameLoop,
  initKeys,
  keyPressed,
  Pool
} from 'kontra'

// set canvas size
const canvas = document.getElementById('game')
canvas.width = canvas.parentElement.clientWidth
canvas.height = canvas.parentElement.clientHeight

// init kontra
init('game')
// init keys
initKeys()

// constants
const FPS = 60
const WIDTH = canvas.width
const HEIGHT = canvas.height
const FLOOR = HEIGHT * 0.8
const SKY_COLOR = 'rgba(90, 90, 90, 1)'
const SKY_COLOR_REAL = 'rgba(180, 180, 180, 1)'

const PLAYER_WIDTH = WIDTH / 16
const PLAYER_HEIGHT = PLAYER_WIDTH * 2
const PLAYER_COLOR = 'rgba(32, 32, 32, 1)'
const PLAYER_COLOR_REAL = 'rgba(230, 230, 230, 1)'

const GRENADE_THROW_RANGE = WIDTH / 4
const GRENADE_BLAST_RANGE = WIDTH / 4
const GRENADE_BLAST_DURATION = 0.1
const MINE_BLAST_RANGE = WIDTH / 4
const MINE_BLAST_DURATION = 0.5

const ENEMY_WIDTH = PLAYER_WIDTH
const ENEMY_HEIGHT = PLAYER_HEIGHT
const ENEMY_COLOR = 'rgba(128, 128, 128, 1)'
const ENEMY_COLOR_REAL = 'rgba(230, 230, 230, 1)'

let gameOver = false
let blasting_duration = 0
let total_blast_duration = 0
const player = initPlayer()
const enemyPool = Pool({
  create: Sprite
})
makeEnemies(5)

let loop = GameLoop({
  update: function(dt) {
    updatePlayer(player, dt)
    updateEnemies()

    if (blasting_duration >= total_blast_duration) {
      blasting_duration = total_blast_duration = 0
    } else {
      blasting_duration += dt
    }

    if (blasting_duration < total_blast_duration) {
      canvas.style.background = SKY_COLOR_REAL
    } else {
      canvas.style.background = SKY_COLOR
    }
  },
  render: function() {
    player.render()
    enemyPool.render()
  }
})

loop.start()

function initPlayer() {
  // player commons
  const playerCommonProps = {
    anchor: {
      x: 0.5,
      y: 1
    },
    x: WIDTH / 4 * 3,
    y: FLOOR,
    dy: -1,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    color: PLAYER_COLOR,

    // custom props
    hp: 10
  }
  const player = Sprite(playerCommonProps)
  return player
}

function updatePlayer(player, dt) {
  if (gameOver) return
  if (player.hp <= 0) {
    player.rotation = Math.PI / 2
    gameOver = true
    return
  }
  if (blasting_duration < total_blast_duration) {
    player.color = PLAYER_COLOR_REAL
  } else {
    player.color = PLAYER_COLOR
  }
  // player.rotation = Math.PI / 12
  player.y += player.dy
  if (player.y < FLOOR - 20 || player.y > FLOOR) {
    player.dy = -player.dy
  }

  if (keyPressed('g')) {
    total_blast_duration += GRENADE_BLAST_DURATION
  }
}

function makeEnemies(count) {
  for (let i = 0; i < count; i++) {
    enemyPool.get({
      anchor: {
        x: 0.5,
        y: 1
      },
      x: -Math.random() * ENEMY_WIDTH * 4,
      y: FLOOR - Math.random() * 20,
      dx: 5,
      dy: -1.5,
      width: ENEMY_WIDTH,
      height: ENEMY_HEIGHT,
      color: ENEMY_COLOR
    })
  }
}

function updateEnemies() {
  if (gameOver) return
  enemyPool.getAliveObjects().forEach((enemy) => {
    // enemy.rotation = Math.PI / 10
    if (blasting_duration < total_blast_duration) {
      enemy.color = ENEMY_COLOR_REAL
    } else {
      enemy.color = ENEMY_COLOR
    }
    enemy.y += enemy.dy
    if (enemy.y < FLOOR - 20 || enemy.y > FLOOR) {
      enemy.dy = -enemy.dy
    }
    if (enemy.collidesWith(player)) {
      //TODO: attack player
    } else{
      enemy.x += enemy.dx
    }
  })
}

function makeGrenade() {

}