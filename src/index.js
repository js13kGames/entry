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
const SKY_COLOR = 'rgba(0, 0, 0, 1)'
const SKY_COLOR_REAL = 'rgba(180, 180, 180, 1)'

const PLAYER_WIDTH = WIDTH / 16
const PLAYER_HEIGHT = PLAYER_WIDTH * 2
const PLAYER_HP = 255
const PLAYER_SPEED = WIDTH / 100
const PLAYER_HIT_DURATION = 0.5

const GRENADE_WIDTH = WIDTH / 64
const GRENADE_HEIGHT = GRENADE_WIDTH
const GRENADE_COLOR = 'rgba(255, 255, 255, 1)'
const GRENADE_THROW_RANGE = WIDTH / 4
const GRENADE_THROW_DURATION = 0.5
const GRENADE_BLAST_RANGE = WIDTH / 4
const GRENADE_BLAST_DURATION = 0.2
const GRENADE_COOLDOWN = 0.1
const GRENADE_REGENERATE = 2
const GRENADE_ATTACK = 100

const MINE_WIDTH = WIDTH / 32
const MINE_HEIGHT = MINE_WIDTH / 2
const MINE_COLOR = 'rgba(255, 255, 255, 1)'
const MINE_BLAST_RANGE = WIDTH / 3
const MINE_BLAST_DURATION = 0.5
const MINE_REGENERATE = 5
const MINE_ATTACK = 200

const ENEMY_WIDTH_MIN = PLAYER_WIDTH * 0.5
const ENEMY_WIDTH_MAX = PLAYER_WIDTH * 2
const ENEMY_HEIGHT_MIN = PLAYER_HEIGHT * 0.5
const ENEMY_HEIGHT_MAX = PLAYER_HEIGHT * 2
const ENEMY_COLOR_LIGHT = 'rgba(230, 230, 230, 1)'
const ENEMY_SPEED = WIDTH / 200
const ENEMY_ATTACK = 15

const UI_FONT_SIZE = WIDTH / 60

let gameOver = false
let kills = 0
let blasting_duration = 0
let total_blast_duration = 0
let playerHitTimer = 0
let enemyMinHp = 50
let enemyMaxHp = 100

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

const uiParts = {
  grenadeCount: null,
  mineCount: null,
  killCount: null
}
initUI()

setInterval(() => {
  makeEnemies(8)
}, 3000)

let loop = GameLoop({
  update: function(dt) {
    if (gameOver) return

    updatePlayer(player, dt)
    updateEnemies()
    updateGrenades(dt)
    updateMines()
    updateBlast(dt)
    updateUI()

    // blast effect
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

    // grenades
    if (grenades < 3) {
      if (grenadeReg < GRENADE_REGENERATE) {
        grenadeReg += dt
      } else {
        grenades += 1
        grenadeReg = 0
      }
    }
    grenadeCD += dt
    if (keyPressed('z')) {
      if (grenadeCD >= GRENADE_COOLDOWN) {
        makeGrenade()
        grenadeCD = 0
      }
    }

    // mines
    if (mines < 1) {
      if (mineReg < MINE_REGENERATE) {
        mineReg += dt
      } else {
        mines += 1
        mineReg = 0
      }
    }
    if (keyPressed('x')) {
      makeMine()
    }

    // collisions
    // blast and enemy
    blastPool.getAliveObjects().forEach(blast => {
      enemyPool.getAliveObjects().forEach(enemy => {
        if (blast.collidesWith(enemy) && enemy.blastId !== blast.id) {
          let atk = blast.type === 'g' ? GRENADE_ATTACK : MINE_ATTACK
          enemy.hp -= atk
          enemy.blastId = blast.id
          if (enemy.hp <= 0) {
            enemy.ttl = 0
            kills++
          }
        }
      })
    })
    // mine and enemy
    minePool.getAliveObjects().forEach(mine => {
      let hit = false
      for (let e of enemyPool.getAliveObjects()) {
        if (mine.collidesWith(e)) {
          hit = true
          break
        }
      }
      if (hit) {
        mine.ttl = 0
        total_blast_duration += MINE_BLAST_DURATION
        makeBlast('m', mine.x)
      }
    })
    // enemy and player
    if (playerHitTimer === 0) {
      let hit = false
      enemyPool.getAliveObjects().forEach(enemy => {
        if (enemy.collidesWith(player)) {
          hit = true
        }
      })
      if (hit) {
        player.hp -= ENEMY_ATTACK
        playerHitTimer += 0.01
      }
    } else if (playerHitTimer >= PLAYER_HIT_DURATION) {
      playerHitTimer = 0
    } else {
      playerHitTimer += dt
    }
  },
  render: function() {
    player.render()
    enemyPool.render()
    grenadePool.render()
    minePool.render()
    blastPool.render()
    renderUI()
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
    color: `rgba(PLAYER_HP, PLAYER_HP, PLAYER_HP, 1)`,
    collidesWith: collidesWith,

    // custom props
    hp: PLAYER_HP
  }
  const player = Sprite(playerCommonProps)
  return player
}

function updatePlayer(player, dt) {
  if (player.hp <= 0) {
    player.rotation = Math.PI / 2
    gameOver = true
    return
  }
  player.rotation = Math.PI / 12
  player.y += player.dy
  if (player.y < FLOOR - 20 || player.y > FLOOR) {
    player.dy = -player.dy
  }
  player.color = `rgba(${player.hp}, ${player.hp}, ${player.hp}, 1)`
}

function makeEnemies(count) {
  for (let i = 0; i < count; i++) {
    const hp = (enemyMaxHp - enemyMinHp) * Math.random() + enemyMinHp
    const color = `rgba(${255 - hp}, ${255 - hp}, ${255 - hp}, 1)`
    enemyPool.get({
      anchor: {
        x: 0.5,
        y: 1
      },
      x: -Math.random() * ENEMY_WIDTH_MIN * 8,
      y: FLOOR - Math.random() * 20,
      width: hp / 255 * (ENEMY_WIDTH_MAX - ENEMY_WIDTH_MIN) + ENEMY_WIDTH_MIN,
      height: hp / 255 * (ENEMY_HEIGHT_MAX - ENEMY_HEIGHT_MIN) + ENEMY_HEIGHT_MIN,
      color: color,
      collidesWith: collidesWith,

      vx: ENEMY_SPEED,
      vy: -1.5,
      itsColor: color,
      hp
    })
  }
}

function updateEnemies() {
  enemyPool.getAliveObjects().forEach((enemy) => {
    enemy.rotation = Math.PI / 10
    let gray = 255 - enemy.hp
    if (blasting_duration < total_blast_duration) {
      enemy.color = ENEMY_COLOR_LIGHT
    } else {
      enemy.itsColor = `rgba(${gray}, ${gray}, ${gray}, 1)`
      enemy.color = enemy.itsColor
    }
    enemy.y += enemy.vy
    if (enemy.y < FLOOR - 20 || enemy.y > FLOOR) {
      enemy.vy = -enemy.vy
    }
    if (!enemy.collidesWith(player)) {
      enemy.x += enemy.vx
    }
  })
  enemyPool.update()
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
    dx: -PLAYER_SPEED,
    collidesWith: collidesWith
  })
  mines -= 1
}

function updateMines() {
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
    dx: -PLAYER_SPEED,
    collidesWith: collidesWith,

    type: type,
    id: Math.random() * 1000000
  })
}

function updateBlast(dt) {
  blastPool.update()
}

function initUI() {
  uiParts.grenadeCount = Sprite({
    x: WIDTH * 0.05,
    y: FLOOR + UI_FONT_SIZE * 2,
    color: 'rgba(255, 255, 255, 1)',

    render: function() {
      const ctx = this.context
      ctx.fillStyle = this.color
      ctx.font = `${UI_FONT_SIZE}px Helvetica,Arial`
      ctx.fillText(`FLASH BANGS [Z]: ${grenades}`, this.x, this.y)
    }
  })

  uiParts.mineCount = Sprite({
    x: WIDTH * 0.05,
    y: FLOOR + UI_FONT_SIZE * 4,
    color: 'rgba(255, 255, 255, 1)',

    render: function() {
      const ctx = this.context
      ctx.fillStyle = this.color
      ctx.font = `${UI_FONT_SIZE}px Helvetica,Arial`
      ctx.fillText(`FLASH MINES [X]: ${mines}`, this.x, this.y)
    }
  })

  uiParts.killCount = Sprite({
    x: WIDTH * 0.05,
    y: UI_FONT_SIZE * 2,
    color: 'rgba(255, 255, 255, 1)',

    render: function() {
      const ctx = this.context
      ctx.fillStyle = this.color
      ctx.font = `${UI_FONT_SIZE}px Helvetica,Arial`
      ctx.fillText(`KILLS: ${kills}`, this.x, this.y)
    }
  })
}

function updateUI() {
  uiParts.grenadeCount.update()
  uiParts.mineCount.update()
  uiParts.killCount.update()
}

function renderUI() {
  uiParts.grenadeCount.render()
  uiParts.mineCount.render()
  uiParts.killCount.render()
}