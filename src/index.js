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
const PLAYER_COLOR = 'rgba(255, 255, 255, 1)'
const PLAYER_COLOR_REAL = 'rgba(230, 230, 230, 1)'
const PLAYER_SPEED = 120

const GRENADE_WIDTH = WIDTH / 32
const GRENADE_HEIGHT = GRENADE_WIDTH
const GRENADE_COLOR = 'rgba(255, 255, 255, 1)'
const GRENADE_THROW_RANGE = WIDTH / 4
const GRENADE_THROW_DURATION = 0.5
const GRENADE_BLAST_RANGE = WIDTH / 4
const GRENADE_BLAST_DURATION = 0.2
const GRENADE_COOLDOWN = 0.1
const GRENADE_REGENERATE = 2

const MINE_WIDTH = WIDTH / 32
const MINE_HEIGHT = MINE_WIDTH / 2
const MINE_COLOR = 'rgba(255, 255, 255, 1)'
const MINE_BLAST_RANGE = WIDTH / 3
const MINE_BLAST_DURATION = 0.3
const MINE_REGENERATE = 5

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

let grenades = 3
let grenadeCD = GRENADE_COOLDOWN
let grenadeReg = GRENADE_REGENERATE
const grenadePool = Pool({
  create: Sprite
})

let mines = 1
let mineReg = MINE_REGENERATE
const minePool = Pool({
  create: Sprite
})

const blastPool = Pool({
  create: Sprite
})

makeEnemies(5)

let loop = GameLoop({
  update: function(dt) {
    updatePlayer(player, dt)
    updateEnemies()
    updateGrenades(dt)
    updateMines()
    updateBlast(dt)

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

    if (grenades < 3) {
      if (grenadeReg < GRENADE_REGENERATE) {
        grenadeReg += dt
      } else {
        grenades += 1
        grenadeReg = 0
      }
    }
    grenadeCD += dt
    if (keyPressed('g')) {
      if (grenadeCD >= GRENADE_COOLDOWN) {
        makeGrenade()
        grenadeCD = 0
      }
    }

    if (mines < 1) {
      if (mineReg < MINE_REGENERATE) {
        mineReg += dt
      } else {
        mines += 1
        mineReg = 0
      }
    }
    if (keyPressed('space')) {
      makeMine()
    }
  },
  render: function() {
    player.render()
    enemyPool.render()
    grenadePool.render()
    minePool.render()
    blastPool.render()
  }
})

loop.start()

function collidesWith(obj) {
  return Math.abs(this.x - obj.x) <= (this.width + obj.width) / 2
}

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
    collidesWith: collidesWith,

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
  player.rotation = Math.PI / 12
  player.y += player.dy
  if (player.y < FLOOR - 20 || player.y > FLOOR) {
    player.dy = -player.dy
  }
}

function randomGray(min, max, opacity) {
  let gray = Math.abs(max - min) * Math.random() + min
  return `rgba(${gray}, ${gray}, ${gray}, ${opacity})`
}

function makeEnemies(count) {
  for (let i = 0; i < count; i++) {
    const color = randomGray(100, 150, 1)
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
      color: color,
      collidesWith: collidesWith,

      itsColor: color
    })
  }
}

function updateEnemies() {
  if (gameOver) return
  enemyPool.getAliveObjects().forEach((enemy) => {
    enemy.rotation = Math.PI / 10
    if (blasting_duration < total_blast_duration) {
      enemy.color = ENEMY_COLOR_REAL
    } else {
      enemy.color = enemy.itsColor
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
  if (grenades <= 1) return
  grenadePool.get({
    anchor: {
      x: 0.5,
      y: 1
    },
    width: GRENADE_WIDTH,
    height: GRENADE_HEIGHT,
    color: GRENADE_COLOR,
    x: player.x,
    y: player.y - PLAYER_HEIGHT,

    deltaX: 0,
    vx: GRENADE_THROW_RANGE / GRENADE_THROW_DURATION,
    vy: PLAYER_HEIGHT / GRENADE_THROW_DURATION
  })
  grenades -= 1
}

function updateGrenades(dt) {
  if (gameOver) return
  grenadePool.getAliveObjects().forEach((grenade) => {
    if (grenade.deltaX >= GRENADE_THROW_RANGE) {
      grenade.ttl = 0
      total_blast_duration += GRENADE_BLAST_DURATION
      makeBlast('g', grenade.x)
    } else {
      grenade.x -= grenade.vx * dt
      grenade.y += grenade.vy * dt
      grenade.deltaX += grenade.vx * dt
    }
  })
  grenadePool.update()
}

function makeMine() {
  if (mines < 1) return
  minePool.get({
    anchor: {
      x: 0.5,
      y: 1
    },
    width: MINE_WIDTH,
    height: MINE_HEIGHT,
    color: MINE_COLOR,
    x: player.x,
    y: FLOOR,
    dx: -PLAYER_SPEED / FPS
  })
  mines -= 1
}

function updateMines() {
  grenadePool.getAliveObjects().forEach(mine => {
    let hit = false
    for(let enemy of enemyPool.getAliveObjects()) {
      if (mine.collidesWith(enemy)) {
        mine.ttl = 0
        total_blast_duration += MINE_BLAST_DURATION
        makeBlast('m', player.x)
        break;
      }
    }
  })
  minePool.update()
}

function makeBlast(type, x) {
  const width = type === 'g' ? GRENADE_BLAST_RANGE : MINE_BLAST_RANGE
  const ttl = type === 'g' ? GRENADE_BLAST_DURATION * FPS : MINE_BLAST_DURATION * FPS
  blastPool.get({
    anchor: {
      x: 0.5,
      y: 1
    },
    width: width,
    height: FLOOR,
    x: x,
    y: FLOOR,
    color: GRENADE_COLOR,
    ttl: ttl,
    dx: -PLAYER_SPEED / FPS,

    type: type
  })
}

function updateBlast(dt) {
  blastPool.update()
}