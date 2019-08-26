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
const MIDDLE = WIDTH / 2
const PLAYER_WIDTH = WIDTH / 16
const PLAYER_HEIGHT = PLAYER_WIDTH * 2
const PLAYER_ATTACK_COOL_DOWN = 1
const PLAYER_PARRY_COOL_DOWN = 1.5
const PLAYER1_COLOR = 'rgba(255, 0, 0, 1)'
const PLAYER2_COLOR = 'rgba(0, 0, 255, 1)'
const PLAYER1_PARRY_COLOR = 'rgba(255, 0, 0, 0.6)'
const PLAYER2_PARRY_COLOR = 'rgba(0, 0, 255, 0.6)'
const BULLET_WIDTH = PLAYER_WIDTH
const BULLET_HEIGHT = BULLET_WIDTH
const BULLET_VELOCITY = 15
const BULLET_TTL = WIDTH / BULLET_VELOCITY * FPS
const MEGA_BULLET_WIDTH = PLAYER_HEIGHT * 2
const MEGA_BULLET_HEIGHT = MEGA_BULLET_WIDTH
const MEGA_BULLET_VELOCITY = 5
const MEGA_BULLET_TTL = WIDTH / MEGA_BULLET_VELOCITY * FPS
const PARRY_WIDTH = PLAYER_WIDTH * 1.2
const PARRY_HEIGHT = PLAYER_HEIGHT * 1.2
const PARRY_TTL = 0.5 * FPS
 
const player1 = initPlayer(1)
const player2 = initPlayer(2)
const bulletPool = Pool({
  create: Sprite
})
bulletPool.maxSize = 100
const parryPool = Pool({
  create: Sprite
})
parryPool.maxSize = 2

let loop = GameLoop({
  update: function(dt) {
    updatePlayer(player1, 1, dt)
    updatePlayer(player2, 2, dt)
    bulletPool.update()
    parryPool.update()

    parryPool.getAliveObjects().forEach((parry) => {
      const player = parry.belonger === 1 ? player1 : player2
      parry.x = player.x
      parry.y = player.y
    })
    
    // bullet collision detection
    bulletPool.getAliveObjects().forEach((bullet) => {
      parryPool.getAliveObjects().forEach((parry) => {
        if (!bullet.mega && bullet.belonger !== parry.belonger && bullet.collidesWith(parry)) {
          bullet.belonger = parry.belonger
          bullet.dx = -bullet.dx
          bullet.ttl = BULLET_TTL
          bullet.color = bullet.belonger === 1 ? PLAYER1_PARRY_COLOR : PLAYER2_PARRY_COLOR
        }
      })

      if (bullet.belonger === 1 && bullet.collidesWith(player2)) {
        bullet.ttl = 0
        player2.hp -= 1
      } else if (bullet.belonger === 2 && bullet.collidesWith(player1)) {
        bullet.ttl = 0
        player1.hp -= 1
      }
    })
  },
  render: function() {
    player1.render()
    player2.render()
    bulletPool.render()
    parryPool.render()
  }
})

loop.start()

function initPlayer(which) {
  // player commons
  const playerCommonProps = {
    anchor: {
      x: 0.5,
      y: 1
    },
    y: FLOOR,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,

    // custom props
    hp: 10,
    mp: 5,
    jumping: false,
    attacking: false,
    attackCD: 1,
    attackCDTimer: 0,
    parrying: false,
    parryCD: 1.5,
    parryCDTimer: 0
  }
  const player = Sprite(playerCommonProps)
  // clamp position to keep players in screen
  player.position.clamp(PLAYER_WIDTH / 2, PLAYER_HEIGHT, WIDTH - PLAYER_WIDTH / 2, FLOOR)
  player.x = which === 1 ? PLAYER_WIDTH * 3.5 : WIDTH - PLAYER_WIDTH * 3.5
  player.color = which === 1 ? PLAYER1_COLOR : PLAYER2_COLOR
  return player
}

function updatePlayer(player, which, dt) {
  // player jumping handle
  if (player.jumping) {
    player.dy -= 15 * dt
    player.y -= player.dy
    if (player.y >= FLOOR) {
      player.jumping = false
      player.dy = 0
    }
  }
  // player attack handle
  if (player.attacking) {
    if (player.attackCDTimer > player.attackCD) {
      player.attackCDTimer = 0
      player.attacking = false
    } else {
      player.attackCDTimer += dt
    }
  }
  // player parry handle
  if (player.parrying) {
    if (player.parryCDTimer > player.parryCD) {
      player.parryCDTimer = 0
      player.parrying = false
    } else {
      player.parryCDTimer += dt
    }
  }
  // player left and right
  if (keyPressed(which === 1 ? 'a' : 'left')) {
    player.x -= player.jumping ? 5 : 10
  } else if (keyPressed(which === 1 ? 'd' : 'right')) {
    player.x += player.jumping ? 5 : 10
  }
  if (keyPressed(which === 1 ? 'w' : 'up')) {
    if (!player.jumping) {
      player.jumping = true
      player.dy = 10
    }
  }
  if (keyPressed(which === 1 ? 'g' : 'num0')) {
    if (!player.attacking) {
      initBullet(bulletPool, player, which, false)
      player.attacking = true
    }
  }
  if (keyPressed(which === 1 ? 'h' : 'numDot')) {
    if (!player.parrying) {
      initParry(parryPool, player, which)
      player.parrying = true
    }
  }
}

function initBullet(pool, player, whose, mega) {
  const width = mega ? MEGA_BULLET_WIDTH : BULLET_WIDTH
  const height = mega ? MEGA_BULLET_HEIGHT : BULLET_HEIGHT
  const dx = mega ? MEGA_BULLET_VELOCITY : BULLET_VELOCITY
  const ttl = mega ? MEGA_BULLET_TTL : BULLET_TTL
  return pool.get({
    anchor: {
      x: 0.5,
      y: 0.5
    },
    x: whose === 1 ? player.x + width / 2 : player.x - width / 2,
    y: Math.min(player.y - PLAYER_HEIGHT / 2, FLOOR - height / 2),
    width: width,
    height: height,
    color: whose === 1 ? PLAYER1_COLOR : PLAYER2_COLOR,
    dx: whose === 1 ? dx : -dx,
    ttl: ttl,

    belonger: whose,
    mega: mega
  })
}

function initParry(pool, player, whose) {
  return pool.get({
    anchor: {
      x: 0.5,
      y: 1 - (1 - PLAYER_HEIGHT / PARRY_HEIGHT) / 2
    },
    x: player.x,
    y: player.y,
    width: PARRY_WIDTH,
    height: PARRY_HEIGHT,
    color: whose === 1 ? PLAYER1_PARRY_COLOR : PLAYER2_PARRY_COLOR,
    ttl: PARRY_TTL,

    belonger: whose
  })
}
