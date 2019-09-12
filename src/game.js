import {
  init,
  Sprite,
  GameLoop,
  initKeys,
  keyPressed,
  Pool
} from 'kontra'
import Sound from './sound'

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
    this.PLAYER_SPEED = this.WIDTH / 200
    this.PLAYER_HIT_DURATION = 0.5

    this.GRENADE_WIDTH = this.WIDTH / 64
    this.GRENADE_HEIGHT = this.GRENADE_WIDTH
    this.GRENADE_COLOR = 'rgba(255, 255, 255, 1)'
    this.GRENADE_THROW_RANGE = this.WIDTH / 4
    this.GRENADE_THROW_DURATION = 0.5
    this.GRENADE_BLAST_RANGE = this.WIDTH / 4
    this.GRENADE_BLAST_DURATION = 0.2
    this.GRENADE_COOLDOWN = 0.2
    this.GRENADE_REGENERATE = 2
    this.GRENADE_ATTACK = 100
    this.GRENADE_PROGRESS = 2
    this.GRENADE_CAPACITY = 3

    this.MINE_WIDTH = this.WIDTH / 32
    this.MINE_HEIGHT = this.MINE_WIDTH / 2
    this.MINE_COLOR = 'rgba(255, 255, 255, 1)'
    this.MINE_BLAST_RANGE = this.WIDTH / 3
    this.MINE_BLAST_DURATION = 0.5
    this.MINE_COOLDOWN = 0.5
    this.MINE_REGENERATE = 5
    this.MINE_ATTACK = 150
    this.MINE_PROGRESS = 4
    this.MINE_CAPACITY = 1

    this.ENEMY_WIDTH_MIN = this.PLAYER_WIDTH * 0.5
    this.ENEMY_WIDTH_MAX = this.PLAYER_WIDTH * 2
    this.ENEMY_HEIGHT_MIN = this.PLAYER_HEIGHT * 0.5
    this.ENEMY_HEIGHT_MAX = this.PLAYER_HEIGHT * 2
    this.ENEMY_COLOR_LIGHT = 'rgba(230, 230, 230, 1)'
    this.ENEMY_SPEED = this.WIDTH / 400
    this.ENEMY_ATTACK = 30
    this.WAVE_ENEMY_COUNT = 10
    this.WAVE_INTERVAL = 3000

    this.UI_FONT_SIZE = this.WIDTH / 60
    this.TREE_MIN_WIDTH = this.WIDTH / 10
    this.TREE_MIN_HEIGHT = this.FLOOR / 3
    this.TREE_MAX_WIDTH = this.WIDTH / 4
    this.TREE_MAX_HEIGHT = this.FLOOR * 0.9
    this.TREE_MIN_INTERVAL = 0.2
    this.TREE_MAX_INTERVAL = 1.5

    // upgrades
    this.UPGRADES = [
      {
        msg: 'Flash Bang Capacity ↑',
        func: () => { this.GRENADE_CAPACITY += 1 },
        weight: 15
      },
      {
        msg: 'Flash Bang Blast Range ↑',
        func: () => { this.GRENADE_BLAST_RANGE += this.WIDTH / 100 },
        weight: 20
      },
      {
        msg: 'Flash Bang Damage ↑',
        func: () => { this.GRENADE_ATTACK += 10 },
        weight: 20
      },
      {
        msg: 'Flash Bang Regenerate ↑',
        func: () => { this.GRENADE_REGENERATE -= 0.1 },
        weight: 20
      },
      {
        msg: 'Flash Mine Capacity ↑',
        func: () => { this.MINE_CAPACITY += 1 },
        weight: 5
      },
      {
        msg: 'Flash Mine Blast Range ↑',
        func: () => { this.MINE_BLAST_RANGE += this.WIDTH / 100 },
        weight: 20
      },
      {
        msg: 'Flash Mine Damage ↑',
        func: () => { this.MINE_ATTACK += 20 },
        weight: 20
      },
      {
        msg: 'Flash Mine Regenerate ↑',
        func: () => { this.MINE_REGENERATE -= 0.2 },
        weight: 20
      },
      {
        msg: 'Running Speed ↑',
        func: () => { this.ENEMY_SPEED-= this.WIDTH / 8000 },
        weight: 15
      }
    ]
    this.UPGRADE_KILL_INTERVAL = 15

    // globals
    this.timeInMill = 0
    this.gameProgress = 0
    this.message = ''
    this.messageDuration = 0
    this.kills = 0
    this.blasting_duration = 0
    this.total_blast_duration = 0
    this.playerHitTimer = 0
    this.enemyMinHp = 50
    this.enemyMaxHp = 100
    this.treeInterval = Math.random() * (this.TREE_MAX_INTERVAL - this.TREE_MIN_INTERVAL) + this.TREE_MIN_INTERVAL

    this.player = this.initPlayer()

    this.enemyPool = Pool({
      create: Sprite
    })

    this.grenades = this.GRENADE_CAPACITY
    this.grenadeCD = this.GRENADE_COOLDOWN
    this.grenadeReg = 0
    this.grenadePool = Pool({
      create: Sprite
    })

    this.mines = this.MINE_CAPACITY
    this.mineCD = this.MINE_COOLDOWN
    this.mineReg = 0
    this.minePool = Pool({
      create: Sprite
    })

    this.blastPool = Pool({
      create: Sprite
    })

    this.treePool = Pool({
      create: Sprite
    })

    this.ui = this.initUI()

    this.loop = GameLoop({
      update: (dt) => {
        // game beaten logic
        if (this.gameProgress >= 255) {
          this.loop.stop()
          this.onGameBeaten()
          return
        }

        // game over logic
        if (this.player.hp <= 0) {
          this.loop.stop()
          this.onGameOver()
          return
        }

        this.timeInMill = Math.round(this.timeInMill + dt * 1000)

        // update
        this.updateTrees()
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
          this.canvas.style.background = `rgba(${this.gameProgress}, ${this.gameProgress}, ${this.gameProgress}, 1)`
        }

        // tree
        if (this.treeInterval <= 0) {
          this.makeTree()
          this.treeInterval = Math.random() * (this.TREE_MAX_INTERVAL - this.TREE_MIN_INTERVAL) + this.TREE_MIN_INTERVAL
        } else {
          this.treeInterval -= dt
        }

        // message
        if (this.messageDuration > 0) {
          this.messageDuration -= dt
        } else {
          this.messageDuration = 0
        }

        // grenades
        if (this.grenades < this.GRENADE_CAPACITY) {
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
        if (this.mines < this.MINE_CAPACITY) {
          if (this.mineReg < this.MINE_REGENERATE) {
            this.mineReg += dt
          } else {
            this.mines += 1
            this.mineReg = 0
          }
        }
        this.mineCD += dt
        if (keyPressed('x')) {
          if (this.mineCD >= this.MINE_COOLDOWN) {
            this.makeMine()
            this.mineCD = 0
          }
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
                if (this.kills % this.UPGRADE_KILL_INTERVAL === 0) {
                  this.randomUpgrade()
                }
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
            Sound.playerHit()
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
        this.treePool.render()
        this.ui.render()
        this.player.render()
        this.enemyPool.render()
        this.grenadePool.render()
        this.minePool.render()
        this.blastPool.render()
      }
    })
  } 

  start() {
    this.enemyInterval = setInterval(() => {
      this.makeEnemies(this.WAVE_ENEMY_COUNT)
    }, this.WAVE_INTERVAL)
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
        x: -Math.random() * this.ENEMY_WIDTH_MIN * 16,
        y: this.FLOOR - Math.random() * 20,
        width: hp / 255 * (this.ENEMY_WIDTH_MAX - this.ENEMY_WIDTH_MIN) + this.ENEMY_WIDTH_MIN,
        height: hp / 255 * (this.ENEMY_HEIGHT_MAX - this.ENEMY_HEIGHT_MIN) + this.ENEMY_HEIGHT_MIN,
        color: color,
        collidesWith: this.collidesWith,

        vx: this.ENEMY_SPEED,
        vy: -1.5,
        itsColor: color,
        hp: hp,

        render: function() {
          const ctx = this.context
          ctx.fillStyle = this.color
          ctx.fillRect(this.x - this.width / 2, this.y - this.height, this.width, this.height);
          ctx.fillStyle = 'rgba(255, 0, 0, 1)'
          ctx.fillRect(this.x, this.y - this.height * 0.8, this.width * 0.4, this.width * 0.1)
        }
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
    if (this.grenades < 1) return
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
    const dp = type === 'g' ? this.GRENADE_PROGRESS : this.MINE_PROGRESS
    this.gameProgress += dp
    if (this.enemyMaxHp < 300) {
      this.enemyMaxHp += dp
    }
    Sound.blast()
  }

  updateBlast(dt) {
    this.blastPool.update()
  }

  initUI() {
    const self = this

    const ui = Sprite({
      render: function() {
        const ctx = this.context
        const textColor = self.gameProgress > 130 ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'
        const floorGray = self.gameProgress - 40
        const floorColor = `rgba(${floorGray}, ${floorGray}, ${floorGray}, 1)`

        // floor
        ctx.fillStyle = floorColor
        ctx.fillRect(0, self.FLOOR, self.WIDTH, self.HEIGHT - self.FLOOR)
        // flash bangs
        ctx.fillStyle = textColor
        ctx.font = `${self.UI_FONT_SIZE}px Helvetica,Arial`
        ctx.fillText(`FLASH BANGS [Z]: ${self.grenades} / ${self.GRENADE_CAPACITY}`, self.WIDTH * 0.05, self.FLOOR + self.UI_FONT_SIZE * 2)
        // flash mines
        ctx.fillText(`FLASH MINES [X]: ${self.mines} / ${self.MINE_CAPACITY}`, self.WIDTH * 0.05, self.FLOOR + self.UI_FONT_SIZE * 4)
        // kills
        ctx.fillText(`KILLS: ${self.kills}`, self.WIDTH * 0.05, self.UI_FONT_SIZE * 2)
        // message
        if (self.messageDuration > 0) {
          let msgWidth = ctx.measureText(self.message).width
          ctx.fillText(self.message, self.WIDTH - msgWidth - self.WIDTH * 0.05, self.FLOOR + self.UI_FONT_SIZE * 2)
        }
        // game time
        const timeStr = self.formatTime(self.timeInMill)
        let strWidth = ctx.measureText(timeStr).width
        ctx.fillText(timeStr, self.WIDTH - strWidth - self.WIDTH * 0.05, self.UI_FONT_SIZE * 2)
      }
    })

    return ui
  }

  updateUI() {
    this.ui.update()
  }

  makeTree() {
    const width = Math.random() * (this.TREE_MAX_WIDTH - this.TREE_MIN_WIDTH) + this.TREE_MIN_WIDTH
    const height = Math.random() * (this.TREE_MAX_HEIGHT - this.TREE_MIN_HEIGHT) + this.TREE_MIN_HEIGHT
    const crownGray = Math.random() * 100 + 25
    const trunkGray = crownGray - 10
    this.treePool.get({
      anchor: {
        x: 0.5, 
        y: 1
      },
      width: width,
      height: height,
      x: this.WIDTH + width,
      y: this.FLOOR,
      dx: -this.PLAYER_SPEED,

      crownRatio: Math.random() * 0.2 + 0.6,
      crownGray: crownGray,
      trunkGray: trunkGray,

      render: function() {
        const ctx = this.context
        ctx.fillStyle = `rgba(${this.trunkGray}, ${this.trunkGray}, ${this.trunkGray}, 1)`
        ctx.fillRect(this.x - this.width * 0.4 / 2, this.y - (1 - this.crownRatio + 0.15) * this.height, this.width * 0.4, this.height * (1 - this.crownRatio + 0.15))
        ctx.fillStyle = `rgba(${this.crownGray}, ${this.crownGray}, ${this.crownGray}, 1)`
        ctx.fillRect(this.x - this.width / 2, this.y - this.height, this.width, this.height * this.crownRatio)
      }
    })
  }

  updateTrees() {
    this.treePool.update()
  }

  randomUpgrade() {
    const totalWeight = this.UPGRADES.reduce((prev, cur) => {
      return prev + cur.weight
    }, 0)
    const dice = Math.random()
    let percent = 0
    for(let upgrade of this.UPGRADES) {
      let ratio = upgrade.weight / totalWeight
      if (dice >= percent && dice < percent + ratio) {
        upgrade.func()
        this.showMessage(upgrade.msg)
        break
      } else {
        percent += ratio
      }
    }
    Sound.upgrade()
  }

  showMessage(msg) {
    this.message = msg
    this.messageDuration = 3
  }

  formatTime(timeInMill) {
    const ms = timeInMill % 1000
    const s = (timeInMill - ms) / 1000 % 60
    const m = Math.floor((timeInMill - ms) / 1000 / 60)
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}:${['00', '0', ''][Math.floor(Math.log10(ms))] + ms}`
  }

  onGameOver() { }

  onGameBeaten() { }
}
