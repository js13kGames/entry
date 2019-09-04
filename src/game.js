import {
  init,
  Sprite,
  GameLoop,
  initKeys,
  keyPressed,
  Pool
} from 'kontra'

export default class Game {
  constructor(canvas) {
    this.canvas = canvas

    // init kontra
    init(canvas.id)
    // init keys
    initKeys()

    // constants
    this.FPS = 60
    this.WIDTH = canvas.width
    this.HEIGHT = canvas.height
    this.FLOOR = this.HEIGHT * 0.8
    this.SKY_COLOR = 'rgba(0, 0, 0, 1)'
    this.SKY_COLOR_REAL = 'rgba(180, 180, 180, 1)'

    this.PLAYER_WIDTH = this.WIDTH / 16
    this.PLAYER_HEIGHT = this.PLAYER_WIDTH * 2
    this.PLAYER_HP = 255
    this.PLAYER_SPEED = this.WIDTH / 100
    this.PLAYER_HIT_DURATION = 0.5

    this.GRENADE_WIDTH = this.WIDTH / 64
    this.GRENADE_HEIGHT = this.GRENADE_WIDTH
    this.GRENADE_COLOR = 'rgba(255, 255, 255, 1)'
    this.GRENADE_THROW_RANGE = this.WIDTH / 4
    this.GRENADE_THROW_DURATION = 0.5
    this.GRENADE_BLAST_RANGE = this.WIDTH / 4
    this.GRENADE_BLAST_DURATION = 0.2
    this.GRENADE_COOLDOWN = 0.1
    this.GRENADE_REGENERATE = 2
    this.GRENADE_ATTACK = 100

    this.MINE_WIDTH = this.WIDTH / 32
    this.MINE_HEIGHT = this.MINE_WIDTH / 2
    this.MINE_COLOR = 'rgba(255, 255, 255, 1)'
    this.MINE_BLAST_RANGE = this.WIDTH / 3
    this.MINE_BLAST_DURATION = 0.5
    this.MINE_REGENERATE = 5
    this.MINE_ATTACK = 200

    this.ENEMY_WIDTH_MIN = this.PLAYER_WIDTH * 0.5
    this.ENEMY_WIDTH_MAX = this.PLAYER_WIDTH * 2
    this.ENEMY_HEIGHT_MIN = this.PLAYER_HEIGHT * 0.5
    this.ENEMY_HEIGHT_MAX = this.PLAYER_HEIGHT * 2
    this.ENEMY_COLOR_LIGHT = 'rgba(230, 230, 230, 1)'
    this.ENEMY_SPEED = this.WIDTH / 200
    this.ENEMY_ATTACK = 15

    this.UI_FONT_SIZE = this.WIDTH / 60

    // globals
    this.gameOver = false
    this.kills = 0
    this.blasting_duration = 0
    this.total_blast_duration = 0
    this.playerHitTimer = 0
    this.enemyMinHp = 50
    this.enemyMaxHp = 100

    this.player = this.initPlayer()

    this.enemyPool = Pool({
      create: Sprite
    })

    this.grenades = 3
    this.grenadeCD = this.GRENADE_COOLDOWN
    this.grenadeReg = this.GRENADE_REGENERATE
    this.grenadePool = Pool({
      create: Sprite
    })

    this.mines = 1
    this.mineReg = this.MINE_REGENERATE
    this.minePool = Pool({
      create: Sprite
    })

    this.blastPool = Pool({
      create: Sprite
    })

    this.uiParts = {
      grenadeCount: null,
      mineCount: null,
      killCount: null
    }
    this.initUI()

    this.loop = GameLoop({
      update: (dt) => {
        // game over logic
        if (this.gameOver) {
          this.loop.stop()
          this.onGameOver()
          return
        }

        // update
        this.updatePlayer(dt)
        this.updateEnemies()
        this.updateGrenades(dt)
        this.updateMines()
        this.updateBlast(dt)
        this.updateUI()

        // blast effect
        if (this.blasting_duration >= this.total_blast_duration) {
          this.blasting_duration = this.total_blast_duration = 0
        } else {
          this.blasting_duration += dt
        }
        if (this.blasting_duration < this.total_blast_duration) {
          this.canvas.style.background = this.SKY_COLOR_REAL
        } else {
          this.canvas.style.background = this.SKY_COLOR
        }

        // grenades
        if (this.grenades < 3) {
          if (this.grenadeReg < this.GRENADE_REGENERATE) {
            this.grenadeReg += dt
          } else {
            this.grenades += 1
            this.grenadeReg = 0
          }
        }
        this.grenadeCD += dt
        if (keyPressed('z')) {
          if (this.grenadeCD >= this.GRENADE_COOLDOWN) {
            this.makeGrenade()
            this.grenadeCD = 0
          }
        }

        // mines
        if (this.mines < 1) {
          if (this.mineReg < this.MINE_REGENERATE) {
            this.mineReg += dt
          } else {
            this.mines += 1
            this.mineReg = 0
          }
        }
        if (keyPressed('x')) {
          this.makeMine()
        }

        // collisions
        // blast and enemy
        this.blastPool.getAliveObjects().forEach(blast => {
          this.enemyPool.getAliveObjects().forEach(enemy => {
            if (blast.collidesWith(enemy) && enemy.blastId !== blast.id) {
              let atk = blast.type === 'g' ? this.GRENADE_ATTACK : this.MINE_ATTACK
              enemy.hp -= atk
              enemy.blastId = blast.id
              if (enemy.hp <= 0) {
                enemy.ttl = 0
                this.kills++
              }
            }
          })
        })
        // mine and enemy
        this.minePool.getAliveObjects().forEach(mine => {
          let hit = false
          for (let e of this.enemyPool.getAliveObjects()) {
            if (mine.collidesWith(e)) {
              hit = true
              break
            }
          }
          if (hit) {
            mine.ttl = 0
            this.total_blast_duration += this.MINE_BLAST_DURATION
            this.makeBlast('m', mine.x)
          }
        })
        // enemy and player
        if (this.playerHitTimer === 0) {
          let hit = false
          this.enemyPool.getAliveObjects().forEach(enemy => {
            if (enemy.collidesWith(this.player)) {
              hit = true
            }
          })
          if (hit) {
            this.player.hp -= this.ENEMY_ATTACK
            this.playerHitTimer += 0.01
          }
        } else if (this.playerHitTimer >= this.PLAYER_HIT_DURATION) {
          this.playerHitTimer = 0
        } else {
          this.playerHitTimer += dt
        }
      },
      render: () => {
        this.player.render()
        this.enemyPool.render()
        this.grenadePool.render()
        this.minePool.render()
        this.blastPool.render()
        this.renderUI()
      }
    })
  } 

  start() {
    this.enemyInterval = setInterval(() => {
      this.makeEnemies(8)
    }, 3000)
    this.loop.start()
  }

  collidesWith(obj) {
    return Math.abs(this.x - obj.x) <= (this.width + obj.width) / 2
  }

  initPlayer() {
    // player commons
    const playerCommonProps = {
      anchor: {
        x: 0.5,
        y: 1
      },
      x: this.WIDTH / 4 * 3,
      y: this.FLOOR,
      dy: -1,
      width: this.PLAYER_WIDTH,
      height: this.PLAYER_HEIGHT,
      color: `rgba(${this.PLAYER_HP}, ${this.PLAYER_HP}, ${this.PLAYER_HP}, 1)`,
      collidesWith: this.collidesWith,

      // custom props
      hp: this.PLAYER_HP
    }
    const player = Sprite(playerCommonProps)
    return player
  }

  updatePlayer(dt) {
    const player = this.player
    if (player.hp <= 0) {
      player.rotation = Math.PI / 2
      this.gameOver = true
      return
    }
    player.rotation = Math.PI / 12
    player.y += player.dy
    if (player.y < this.FLOOR - 20 || player.y > this.FLOOR) {
      player.dy = -player.dy
    }
    player.color = `rgba(${player.hp}, ${player.hp}, ${player.hp}, 1)`
  }

  makeEnemies(count) {
    for (let i = 0; i < count; i++) {
      const hp = (this.enemyMaxHp - this.enemyMinHp) * Math.random() + this.enemyMinHp
      const color = `rgba(${255 - hp}, ${255 - hp}, ${255 - hp}, 1)`
      this.enemyPool.get({
        anchor: {
          x: 0.5,
          y: 1
        },
        x: -Math.random() * this.ENEMY_WIDTH_MIN * 8,
        y: this.FLOOR - Math.random() * 20,
        width: hp / 255 * (this.ENEMY_WIDTH_MAX - this.ENEMY_WIDTH_MIN) + this.ENEMY_WIDTH_MIN,
        height: hp / 255 * (this.ENEMY_HEIGHT_MAX - this.ENEMY_HEIGHT_MIN) + this.ENEMY_HEIGHT_MIN,
        color: color,
        collidesWith: this.collidesWith,

        vx: this.ENEMY_SPEED,
        vy: -1.5,
        itsColor: color,
        hp: hp
      })
    }
  }

  updateEnemies() {
    this.enemyPool.getAliveObjects().forEach((enemy) => {
      enemy.rotation = Math.PI / 10
      let gray = 255 - enemy.hp
      if (this.blasting_duration < this.total_blast_duration) {
        enemy.color = this.ENEMY_COLOR_LIGHT
      } else {
        enemy.itsColor = `rgba(${gray}, ${gray}, ${gray}, 1)`
        enemy.color = enemy.itsColor
      }
      enemy.y += enemy.vy
      if (enemy.y < this.FLOOR - 20 || enemy.y > this.FLOOR) {
        enemy.vy = -enemy.vy
      }
      if (!enemy.collidesWith(this.player)) {
        enemy.x += enemy.vx
      }
    })
    this.enemyPool.update()
  }

  makeGrenade() {
    if (this.grenades <= 1) return
    this.grenadePool.get({
      anchor: {
        x: 0.5,
        y: 1
      },
      width: this.GRENADE_WIDTH,
      height: this.GRENADE_HEIGHT,
      color: this.GRENADE_COLOR,
      x: this.player.x,
      y: this.player.y - this.PLAYER_HEIGHT,

      deltaX: 0,
      vx: this.GRENADE_THROW_RANGE / this.GRENADE_THROW_DURATION,
      vy: this.PLAYER_HEIGHT / this.GRENADE_THROW_DURATION
    })
    this.grenades -= 1
  }

  updateGrenades(dt) {
    this.grenadePool.getAliveObjects().forEach((grenade) => {
      if (grenade.deltaX >= this.GRENADE_THROW_RANGE) {
        grenade.ttl = 0
        this.total_blast_duration += this.GRENADE_BLAST_DURATION
        this.makeBlast('g', grenade.x)
      } else {
        grenade.x -= grenade.vx * dt
        grenade.y += grenade.vy * dt
        grenade.deltaX += grenade.vx * dt
      }
    })
    this.grenadePool.update()
  }

  makeMine() {
    if (this.mines < 1) return
    this.minePool.get({
      anchor: {
        x: 0.5,
        y: 1
      },
      width: this.MINE_WIDTH,
      height: this.MINE_HEIGHT,
      color: this.MINE_COLOR,
      x: this.player.x,
      y: this.FLOOR,
      dx: -this.PLAYER_SPEED,
      collidesWith: this.collidesWith
    })
    this.mines -= 1
  }

  updateMines() {
    this.minePool.update()
  }

  makeBlast(type, x) {
    const width = type === 'g' ? this.GRENADE_BLAST_RANGE : this.MINE_BLAST_RANGE
    const ttl = type === 'g' ? this.GRENADE_BLAST_DURATION * this.FPS : this.MINE_BLAST_DURATION * this.FPS
    this.blastPool.get({
      anchor: {
        x: 0.5,
        y: 1
      },
      width: width,
      height: this.FLOOR,
      x: x,
      y: this.FLOOR,
      color: this.GRENADE_COLOR,
      ttl: ttl,
      dx: -this.PLAYER_SPEED,
      collidesWith: this.collidesWith,

      type: type,
      id: Math.random() * 1000000 // used to prevent colliding with the same enemy multiple times
    })
  }

  updateBlast(dt) {
    this.blastPool.update()
  }

  initUI() {
    const self = this

    this.uiParts.grenadeCount = Sprite({
      x: this.WIDTH * 0.05,
      y: this.FLOOR + this.UI_FONT_SIZE * 2,
      color: 'rgba(255, 255, 255, 1)',

      render: function() {
        const ctx = this.context
        ctx.fillStyle = this.color
        ctx.font = `${self.UI_FONT_SIZE}px Helvetica,Arial`
        ctx.fillText(`FLASH BANGS [Z]: ${self.grenades}`, this.x, this.y)
      }
    })

    this.uiParts.mineCount = Sprite({
      x: this.WIDTH * 0.05,
      y: this.FLOOR + this.UI_FONT_SIZE * 4,
      color: 'rgba(255, 255, 255, 1)',

      render: function() {
        const ctx = this.context
        ctx.fillStyle = this.color
        ctx.font = `${self.UI_FONT_SIZE}px Helvetica,Arial`
        ctx.fillText(`FLASH MINES [X]: ${self.mines}`, this.x, this.y)
      }
    })

    this.uiParts.killCount = Sprite({
      x: this.WIDTH * 0.05,
      y: this.UI_FONT_SIZE * 2,
      color: 'rgba(255, 255, 255, 1)',

      render: function() {
        const ctx = this.context
        ctx.fillStyle = this.color
        ctx.font = `${self.UI_FONT_SIZE}px Helvetica,Arial`
        ctx.fillText(`KILLS: ${self.kills}`, this.x, this.y)
      }
    })
  }

  updateUI() {
    this.uiParts.grenadeCount.update()
    this.uiParts.mineCount.update()
    this.uiParts.killCount.update()
  }

  renderUI() {
    this.uiParts.grenadeCount.render()
    this.uiParts.mineCount.render()
    this.uiParts.killCount.render()
  }

  onGameOver() { }
}
