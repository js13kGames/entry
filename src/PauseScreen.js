import { drawBoldText, drawText } from './fontUtils';
import { drawSprite, Graphics, Canvas } from './Graphics';
import { GamepadSprite } from './Assets';
import { setScene } from './globals';
import { Input } from './Input';

export class PauseScreen {
  constructor (scene) {
    this.scene = scene
  }

  step () {
    if (Input.getAnyKey()) {
      Input.reset()
      setScene(this.scene)
    }
  }

  render () {
    this.scene.paused = true
    this.scene.render()
    this.scene.paused = false

    Graphics.setTransform(1, 0, 0, 1, Canvas.width / 2, 0)

    for (let i = 0; i < 8; i++) {
      Graphics.fillStyle = 'rgba(0,0,0,0.2)'
      Graphics.fillRect(-160 + i * 4, 0, 320 - i * 8, Canvas.height)
    }

    drawBoldText('TETRIS BUT WITH A TWIST', -59, 80)
    drawText(
      'FILL LINES TO CLEAR THEM. THIS TIME\n' +
      'THE TETROMINOES HAVE A WILL OF THEIR\n' +
      'OWN. SO TRY TO DESTROY THEM BEFORE\n' +
      'THEY FLEE BACK TO WHENCE THEY CAME.',
      -100, 100
    )

    Graphics.setTransform(1, 0, 0, 1, Canvas.width / 2, 120)

    drawBoldText('KEYBOARD CONTROLS', -59, 50)
    drawText(
      '     PAUSE GAME - ESC\n' +
      '      HARD DROP - SPACE\n' +
      '      SOFT DROP - ARROW DOWN\n' +
      '  ROTATE CLOCKW - ARROW UP/X\n' +
      'ROTATE C CLOCKW - CTRL/Z\n' +
      '           HOLD - SHIFT/C\n',
      -96,
      62
    )
    drawBoldText('GAMEPAD CONTROLS', 62-117, 128)
    drawSprite(GamepadSprite, 0, 150)

    drawText('HOLD', 106-118, 143)
    drawText('HARD\nDROP', 54-118, 161)
    drawText('SOFT\nDROP', 86-118, 194)
    drawText('ROTATE\nC.CLOCKW', 125-118, 194)
    drawText('ROTATE\nCLOCKW', 160-118, 164)
  }
}
