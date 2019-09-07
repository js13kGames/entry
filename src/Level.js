import { Graphics, Canvas, drawSprite, drawAt, resetTransform, fillAndStrokeRectangle } from "./Graphics"
import { TetrominoT } from './Tetrominoes/TetrominoT'
import { TetrominoController } from './TetrominoController'
import { TILE_SIZE, HOLD, ACTION_ROTATE, T_SPIN_MINI, T_SPIN, ALL_CLEAR, SINGLE_CLEAR, PAUSE, GOAL } from './constants'
import { ClearAnimation } from './Animations/ClearAnimation'
import { Input } from './Input'
import { Board } from './Board'
import { EndAnimation } from './Animations/EndAnimation'
import { playSample } from './Audio'
import { LineClearSounds, HoldSound, TSpinSound, AllClearSound, MainSong, TextsSprite, EyesSprite, VictorySong } from './Assets'
import { resetScore, addToScore, currentScore, resetLineClears, addLineClears, currentLevel, lineClears, setScene } from './globals'
import { zeroPad } from './utils'
import { drawText, drawBoldText } from './fontUtils'
import { ScoreAnimation } from './Animations/ScoreAnimation'
import { Back2BackAnimation } from './Animations/Back2BackAnimation'
import { MoveTypeAnimation } from './Animations/MoveTypeAnimation'
import { TetrominoSource } from './TetrominoSource'
import { Tetromino } from './Tetrominoes/Tetromino'
import { ScaredTetrominoController } from './ScaredTetrominoController'
import { FallingEyePair } from './Animations/FallingEyePair'
import { PauseScreen } from './PauseScreen';
import { Background } from './Animations/Background';

export class Level {
  constructor () {
    Input.reset()

    resetScore()
    resetLineClears()

    this.tileCountX = 10
    this.tileCountY = 20

    this.time = 0

    this.board = new Board(this.tileCountX, this.tileCountY)

    this.width = TILE_SIZE * this.tileCountX
    this.height = TILE_SIZE * this.tileCountY

    this.lastClearWasSpecial = false
    this.clearStreak = 0

    this.scaredTetrominoControllers = new Set()

    this.scoreAnimations = []
    this.fallingEyes = new Set()

    Graphics.lineWidth = 2

    this.background = new Background()

    this.tetrominoSource = new TetrominoSource()
    this.heldTetromino = null
    this.nextTetrominoes = Array.from(Array(6), () => this.tetrominoSource.getNext())
    this.nextTetromino()

    this.started = false
  }

  step () {
    if (!this.started) {
      this.started = true
      MainSong.play()
    }

    if (Input.getKeyDown(PAUSE)) {
      setScene(new PauseScreen(this))
      return
    }

    if (!this.endAnimation) {
      this.time++
    } else {
      if (this.endAnimation.done) {
        if (Input.getAnyKey()) {
          setScene(new Level())
          return
        }
      }
    }

    this.updateAnimations()

    if (this.clearAnimation) {
      if (this.clearAnimation.done) {
        this.board.clearRows(this.clearAnimation.rows)
        this.clearAnimation = null

        this.scaredTetrominoControllers = this.getScaredTetrominoControllers(this.fleeingTetrominoesCandidates)

        for (let controller of this.scaredTetrominoControllers) {
          this.board.removeTetromino(controller.tetromino)
        }
        if (this.scaredTetrominoControllers.size > 0) {
          this.currentTetromino = null
        } else {
          this.nextTetromino()
        }
      }
      return
    }

    let previousScore = currentScore

    this.updateControllers()

    if (currentScore !== previousScore) {
      this.scoreAnimations.push(new ScoreAnimation(currentScore - previousScore))
      if (this.scoreAnimations.length === 4) {
        this.scoreAnimations.shift()
      }
    }
  }

  updateAnimations () {
    if (this.moveTypeAnimation && !this.moveTypeAnimation.done) {
      this.moveTypeAnimation.step()
    }

    if (this.back2BackAnimation && !this.back2BackAnimation.done) {
      this.back2BackAnimation.step()
    }

    this.background.step()

    if (this.clearAnimation && !this.clearAnimation.done) {
      this.clearAnimation.step()
      return
    }

    if (this.endAnimation) {
      this.endAnimation.step()
    }

    for (let animation of this.fallingEyes) {
      animation.step()
      if (animation.done) {
        this.fallingEyes.delete(animation)
      }
    }

    for (let animation of this.scoreAnimations) {
      animation.step()
    }

    for (let tetromino of this.board.tetrominoes) {
      tetromino.updateEyes()
    }
  }

  updateControllers () {
    let disableControls = this.scaredTetrominoControllers.size > 0 || this.endAnimation

    if (this.scaredTetrominoControllers.size > 0) {
      for (let controller of this.scaredTetrominoControllers) {
        controller.step()
        if (controller.done) {
          this.scaredTetrominoControllers.delete(controller)
        }
      }
      if (this.scaredTetrominoControllers.size === 0) {
        this.nextTetromino()
      }
    }

    if (!disableControls) {
      if (Input.getKeyDown(HOLD) && !this.controller.wasHeld) {
        this.holdTetromino()
      } else {
        this.controller.step()
        if (this.controller.done) {
          this.currentTetromino.eyeDirection = [0, 0]
          const positions = this.currentTetromino.getBlockPositions()
          let rows = new Set()
          for (let position of positions) {
            rows.add(position[1])
          }

          this.board.putTetromino(this.currentTetromino)

          this.checkState(rows)
        }
      }
    }
  }

  render () {
    resetTransform()

    Graphics.clearRect(0, 0, Canvas.width, Canvas.height)

    this.background.render()

    const width = TILE_SIZE * this.tileCountX
    const height = TILE_SIZE * this.tileCountY

    Graphics.translate((Canvas.width - width) / 2, (Canvas.height - height) / 2)

    Graphics.strokeStyle = '#fff'
    Graphics.fillStyle = '#000'
    fillAndStrokeRectangle(-1, -1, width + 2, height + 2)

    if (!this.paused) {
      this.renderBoard()
    }

    Graphics.translate(width + 25, 0)

    Graphics.fillStyle = '#000'
    fillAndStrokeRectangle(-16, -1, 48, 170)

    drawText(`TIME:`, -17, 27 * 7)
    drawBoldText(this.getTimeText(), -17, 28 * 7)
    drawText(`LEVEL:`, -17, 30 * 7)
    drawBoldText(zeroPad(currentLevel, 2), -17, 31 * 7)
    drawText(`LINES:`, -17, 33 * 7)
    drawBoldText(zeroPad(lineClears, 4), -17, 34 * 7)

    drawText(`SCORE:`, -17, 297)
    drawBoldText(zeroPad(currentScore, 9), -17, 309, 2)

    for (let animation of this.scoreAnimations) {
      animation.render()
    }

    if (!this.paused) {
      this.renderNextTetrominoes()
    }

    resetTransform()

    Graphics.translate((Canvas.width - width) / 2 - 40, (Canvas.height - height) / 2 + 10)

    Graphics.fillStyle = '#000'
    fillAndStrokeRectangle(-17, -11, 48, 40)

    drawBoldText(`HOLD`, -6, -8)

    if (this.heldTetromino) {
      if (this.controller.wasHeld) {
        this.renderGhostTetromino(this.heldTetromino, 0, TILE_SIZE / 2, 2)
        Graphics.fillStyle = 'rgba(0,0,0,0.5)'
        Graphics.fillRect(-TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE * 2, TILE_SIZE)
      } else {
        this.renderTetromino(this.heldTetromino, TILE_SIZE / 2, 2)
      }
    }

    drawAt(-10, 50, () => {
      if (this.clearStreak > 1) {
        drawSprite(TextsSprite, 0, 0, 7)
        drawBoldText(`${this.clearStreak < 10 ? ' ' : ''}${this.clearStreak - 1}`, -5, 7, 2)
      }

      if (this.moveTypeAnimation) {
        this.moveTypeAnimation.render()
      }

      if (this.back2BackAnimation) {
        this.back2BackAnimation.render()
      }
    })
  }

  getTSpin () {
    if (!(this.currentTetromino instanceof TetrominoT) || this.controller.lastMove !== ACTION_ROTATE) {
      return false
    }

    let x = this.currentTetromino.x
    let y = this.currentTetromino.y

    let corners = [
      this.board.isSolidAt(x - 1, y + 1),
      this.board.isSolidAt(x + 1, y + 1),
      this.board.isSolidAt(x + 1, y - 1),
      this.board.isSolidAt(x - 1, y - 1)
    ]

    let emptyCorners =
      !corners[0] +
      !corners[1] +
      !corners[2] +
      !corners[3]

    if (emptyCorners > 1) {
      return false
    }

    let betweens = [
      this.board.getItemAt(x - 1, y) === this.currentTetromino,
      this.board.getItemAt(x, y + 1) === this.currentTetromino,
      this.board.getItemAt(x + 1, y) === this.currentTetromino,
      this.board.getItemAt(x, y - 1) === this.currentTetromino
    ]


    const filled = [
      corners[0] + betweens[1] + corners[1],
      corners[1] + betweens[2] + corners[2],
      corners[2] + betweens[3] + corners[3],
      corners[3] + betweens[0] + corners[0]
    ]

    return filled.filter(x => x === 3).length < 2 ? T_SPIN_MINI : T_SPIN
  }

  checkState (rows) {
    let rowsToClear = []
    for (let row of rows) {
      if (this.board.isFullRow(row)) {
        rowsToClear.push(row)
      }
    }

    rowsToClear.sort((a, b) => a - b)

    let tSpinType = this.getTSpin()
    let clearedRowsCount = rowsToClear.length
    let allClear = this.isAllClearConfig(rowsToClear)

    this.updateScore(tSpinType, clearedRowsCount, allClear)

    if (clearedRowsCount === 0) {
      if (this.board.overflows(this.nextTetrominoes[0])) {
        this.setGameOver()
        return
      }
      this.nextTetromino()
    } else {
      this.startClearingLines(rowsToClear)
      this.currentTetromino = null
    }
  }

  isAllClearConfig (rowsToClear) {
    for (let y = rowsToClear.length; y < this.tileCountY; y++) {
      if (!this.board.isEmptyRow(y)) {
        return false
      }
    }
    return true
  }

  startClearingLines (rowsToClear) {
    this.clearAnimation = new ClearAnimation(this, rowsToClear)
    let effectedTetrominoes = this.board.getTetrominoesInRows(rowsToClear)
    this.board.changeTetrominoesToBlocks(effectedTetrominoes)

    for (let tetromino of effectedTetrominoes) {
      let [px, py] = tetromino.getEyesPosition()
      let y = (this.tileCountY - 1 - py + 0.5) * TILE_SIZE
      let x = (px + 0.5) * TILE_SIZE
      this.fallingEyes.add(new FallingEyePair(x, y))
    }

    const scaredTetrominoes = this.getScaredTetrominoes(rowsToClear, effectedTetrominoes)
    const alreadyScared = new Set()
    for (let tetromino of scaredTetrominoes) {
      if (tetromino.scared) {
        alreadyScared.add(tetromino)
      }
      tetromino.scared = true
      tetromino.lookDown()
    }

    this.fleeingTetrominoesCandidates = alreadyScared
  }

  updateScore (tSpinType, clearedRowsCount, allClear) {
    // Combo
    addToScore(currentLevel * 50 * this.clearStreak)

    addLineClears(clearedRowsCount)

    if (tSpinType) {
      playSample(TSpinSound, 1, true)
    }

    if (allClear) {
      this.setMoveType(ALL_CLEAR)

      playSample(AllClearSound, 1, true)

      addToScore(1500 * currentLevel)
    } else if (clearedRowsCount > 0) {
      playSample(LineClearSounds[clearedRowsCount - 1], 1, true)

      if (this.lastClearWasSpecial && clearedRowsCount === 4) {
        this.setBack2Back()
        addToScore(1200 * currentLevel)
      } else {
        addToScore({
          1: 100,
          2: 300,
          3: 500,
          4: 800
        }[clearedRowsCount] * currentLevel)
      }

      this.setMoveType(SINGLE_CLEAR - 1 + clearedRowsCount)
    }

    if (tSpinType === T_SPIN) {
      if (this.lastClearWasSpecial && clearedRowsCount > 0) {
        this.setBack2Back()
        addToScore(600 * (clearedRowsCount + 1) * currentLevel)
      } else {
        addToScore(400 * (clearedRowsCount + 1) * currentLevel)
      }
      this.setMoveType(T_SPIN + clearedRowsCount)
    } else if (tSpinType === T_SPIN_MINI) {
      addToScore(currentLevel * (clearedRowsCount + 1) * 100)
      this.setMoveType(T_SPIN_MINI + clearedRowsCount)
    }

    if (clearedRowsCount > 0) {
      this.clearStreak++
      this.lastClearWasSpecial = tSpinType || clearedRowsCount === 4
    } else {
      this.clearStreak = 0
    }
  }

  endGame () {
    this.endAnimation = new EndAnimation(this)
    MainSong.fadeOut()
    setTimeout(() => VictorySong.play(), 700)
  }

  setGameOver () {
    this.endAnimation = new EndAnimation(this, true)
    MainSong.tapeStop()
  }

  setBack2Back () {
    this.back2BackAnimation = new Back2BackAnimation()
  }

  setMoveType (type) {
    if (type) {
      this.moveTypeAnimation = new MoveTypeAnimation(type)
    }
  }

  getScaredTetrominoes (clearedRows, killedTetrominoes) {
    let killedBlocks = new Set()
    for (let y of clearedRows) {
      for (let x = 0; x < this.tileCountX; x++) {
        killedBlocks.add(`${x}:${y}`)
      }
    }

    for (let tetromino of killedTetrominoes) {
      for (let [x, y] of tetromino.getBlockPositions()) {
        killedBlocks.add(`${x}:${y}`)
      }
    }

    let minY = 1000
    let maxY = -1000

    for (let block of killedBlocks) {
      const y = Number(block.split(':')[1])
      minY = Math.min(y, minY)
      maxY = Math.max(y, maxY)
    }

    let result = new Set()

    for (let y = minY - 1; y <= maxY + 1; y++) {
      for (let x = 0; x < this.tileCountX; x++) {
        if (killedBlocks.has(`${x}:${y}`)) {
          continue
        }

        let item = this.board.getItemAt(x, y)
        if (!(item instanceof Tetromino)) {
          continue
        }

        const neighbours = [
          `${x - 1}:${y}`,
          `${x + 1}:${y}`,
          `${x}:${y - 1}`,
          `${x}:${y + 1}`
        ]

        for (let i = 0; i < 4; i++) {
          if (killedBlocks.has(neighbours[i])) {
            result.add(item)
            break
          }
        }
      }
    }

    return result
  }

  getScaredTetrominoControllers (tetrominoes) {
    let controllers = new Set()
    for (let tetromino of tetrominoes) {
      const controller = new ScaredTetrominoController(tetromino, this.board)
      if (controller.isFreeableTetromino()) {
        controllers.add(controller)
      }
    }
    return controllers
  }

  getGhostOffset () {
    const positions = this.currentTetromino.getBlockPositions()
    let maxDeltas = [0, 0, 0, 0]
    for (let i = 0; i < 4; i++) {
      const [x, y] = positions[i]
      for (let delta = 0; delta <= y; delta++) {
        let ghostY = y - delta
        if (!this.board.getItemAt(x, ghostY)) {
          maxDeltas[i] = delta
        } else {
          break
        }
      }
    }

    return -Math.min(...maxDeltas)
  }

  renderBoard () {
    for (let y = 0; y < this.board.height; y++) {
      for (let x = 0; x < this.board.width; x++) {
        const color = this.board.getColorAt(x, y)
        if (color) {
          this.renderBlock(x, this.tileCountY - 1 - y, color)
        }
      }
    }

    if (!this.endAnimation) {
      for (let tetromino of this.board.tetrominoes) {
        this.renderTetrominoEyes(tetromino)
      }

      if (this.currentTetromino) {
        this.renderGhostTetromino(this.currentTetromino, this.getGhostOffset(), TILE_SIZE, this.tileCountY - 1)
        this.renderTetromino(this.currentTetromino, TILE_SIZE, this.tileCountY - 1)
      }
    }

    if (this.clearAnimation) {
      this.clearAnimation.render()
    } else  {
      for (let controller of this.scaredTetrominoControllers) {
        this.renderTetromino(controller.tetromino, TILE_SIZE, this.tileCountY - 1)
      }
    }

    if (this.endAnimation) {
      this.endAnimation.render()
    }

    for (let animation of this.fallingEyes) {
      animation.render()
    }
  }

  renderNextTetrominoes () {
    let size = TILE_SIZE * 0.5
    for (let i = 0; i < this.nextTetrominoes.length; i++) {
      const tetromino = this.nextTetrominoes[i]
      this.renderTetromino(tetromino, size, 3)

      if (i === 0) {
        Graphics.translate(0, size * 5)
        size *= 0.75
      } else {
        Graphics.translate(0, size * 4)
      }
    }
  }

  holdTetromino () {
    if (this.heldTetromino && this.board.overflows(this.heldTetromino)) {
      this.setGameOver()
      return
    }

    playSample(HoldSound)

    const heldTetromino = this.heldTetromino
    this.heldTetromino = this.currentTetromino
    this.heldTetromino.x = 0
    this.heldTetromino.y = 0
    this.heldTetromino.rotation = 0
    if (heldTetromino) {
      this.currentTetromino = heldTetromino
      this.controller = new TetrominoController(this.currentTetromino, this.board)
    } else {
      this.nextTetromino()
    }
    this.controller.wasHeld = true
  }

  nextTetromino () {
    if (lineClears >= GOAL) {
      this.endGame()
      return
    }

    this.currentTetromino = this.nextTetrominoes.shift()
    this.nextTetrominoes.push(this.tetrominoSource.getNext())

    this.controller = new TetrominoController(this.currentTetromino, this.board)
  }

  renderTetromino (tetromino, size, bottom) {
    const positions = tetromino.getBlockPositions()
    const color = tetromino.getColor()
    for (let [px, py] of positions) {
      this.renderBlock(px, bottom - py, color, size)
    }
    if (size === TILE_SIZE) this.renderTetrominoEyes(tetromino)
  }

  renderTetrominoEyes (tetromino) {
    Graphics.fillStyle = '#000'

    let [px, py] = tetromino.getEyesPosition()
    let y = (this.tileCountY - 1 - py + 0.5) * TILE_SIZE
    let x1 = (px + 0.25) * TILE_SIZE
    let x2 = (px + 0.75) * TILE_SIZE

    if (tetromino.fleeing) {
      tetromino.eyesIndex = 0
      tetromino.eyeDirection = [0, -2]
    } else if (tetromino.scared) {
      tetromino.eyesIndex = 0
      let offsetX = Math.random() * 2 - 1
      x1 += offsetX
      x2 += offsetX
      y += Math.random() * 2 - 1
    }

    drawSprite(EyesSprite, x1, y, tetromino.eyesIndex)
    drawSprite(EyesSprite, x2, y, tetromino.eyesIndex)

    if (tetromino.eyesIndex === 0) {
      Graphics.fillRect(x1 - 1 + tetromino.eyeDirection[0], y - 1 + tetromino.eyeDirection[1], 2, 2)
      Graphics.fillRect(x2 - 1 + tetromino.eyeDirection[0], y - 1 + tetromino.eyeDirection[1], 2, 2)
    }
  }

  renderGhostTetromino (tetromino, offset, size, bottom) {
    const positions = tetromino.getBlockPositions()
    const color = tetromino.getColor()

    positions.forEach(el => el[1] += offset)
    for (let [px, py] of positions) {
      this.renderGhostBlock(px, bottom - py, color, size)
    }
  }

  renderBlock (x, y, color, size = TILE_SIZE) {
    Graphics.fillStyle = color
    Graphics.fillRect(x * size, y * size, size - 1, size - 1)
    Graphics.fillStyle = 'rgba(255,255,255,0.5)'
    Graphics.fillRect(x * size, y * size, 2, size)
    Graphics.fillRect(x * size, y * size, size, 2)
  }

  renderGhostBlock (x, y, color, size = TILE_SIZE) {
    Graphics.fillStyle = color
    Graphics.fillRect(x * size, y * size, size - 1, size - 1)
    Graphics.fillStyle = '#000'
    Graphics.fillRect(x * size + 1, y * size + 1, size - 3, size - 3)
  }

  getTimeText () {
    let milliseconds = Math.floor((this.time / 60) % 1 * 100)
    let seconds = Math.floor(this.time / 60)
    let hours = Math.floor(seconds / 3600)
    let minutes = Math.floor(seconds / 60)

    return `${zeroPad(hours, 2)}:${zeroPad(minutes % 60, 2)}:${zeroPad(seconds % 60, 2)}.${zeroPad(milliseconds, 2)}`
  }
}
