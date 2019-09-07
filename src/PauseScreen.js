import { Input } from './Input'
import { PAUSE } from './constants'
import { setScene } from './globals'
import { Overlay } from './Overlay';
import { GLYPH_WIDTH, drawBoldTextCentered, drawText } from './fontUtils';
import { Graphics, Canvas, drawSprite } from './Graphics';
import { GamepadSprite } from './Assets';

export class PauseScreen extends Overlay {
  constructor (scene, firstTime = false) {
    super(scene)
    this.firstTime = firstTime

    Input.reset()
  }

  step () {
    if (Input.getKeyDown(PAUSE) || this.firstTime && Input.getAnyKey()) {
      setScene(this.scene)
    }
  }

  render () {
    super.render()

    Graphics.setTransform(1, 0, 0, 1, Canvas.width / 2, 0)

    Graphics.scale(2, 2)
    drawBoldTextCentered('PAUSED', 0, 30)
    Graphics.scale(0.5, 0.5)

    drawBoldTextCentered('INSTRUCTIONS', 0, 100)

    let descriptionMaxCharCount = 50
    drawText(
      'MAKE FULL HORIZONTAL LINES WITH THE TETROMINOES.\n' +
      'THIS WILL DISINTEGRATE THE TETROMINOES AND PROVIDE\n' +
      'YOU POINTS.\n\n' +
      'TRY TO AIM FOR AS MANY LINES AT THE SAME TIME, AND\n' +
      'TRY OUT SOME TRICKS SUCH AS T-SPINS AS WELL!\n\n' +
      'DO NOTE THAT TETROMINOES WILL FLEE BACK UP IF THEY\n' +
      'CAN WHEN THEY HAVE SEEN FELLOW NEIGHBOURING TETRO-\n' +
      'MINOES DIE AT LEAST TWICE. FLEEING TETROMINOES WILL\n' +
      'REDUCE YOUR SCORE, SO TRY TO MURDER AS MUCH AS\n' +
      'YOU CAN.\n\n' +
      'GOOD LUCK!',
      -descriptionMaxCharCount * GLYPH_WIDTH / 2, 118
    )

    Graphics.setTransform(1, 0, 0, 1, Canvas.width / 2 - 100, 248)

    drawBoldTextCentered('KEYBOARD CONTROLS', 0, 0)
    drawText(
      'UN/PAUSE GAME   - ESC\n' +
      'HARD DROP       - SPACE\n' +
      'SOFT DROP       - ARROW DOWN\n' +
      'ROTATE CLOCKW   - ARROW UP/X\n' +
      'ROTATE C CLOCKW - CTRL/Z\n' +
      'HOLD            - SHIFT/C\n',
      -83,
      18
    )

    Graphics.setTransform(1, 0, 0, 1, Canvas.width / 2 + 100, 248)

    drawBoldTextCentered('GAMEPAD CONTROLS', 0, 0)
    drawSprite(GamepadSprite, 0, 150-128)

    drawText('HOLD', 106-118, 143-128)
    drawText('HARD\nDROP', 54-118, 161-128)
    drawText('SOFT\nDROP', 86-118, 194-128)
    drawText('ROTATE\nC.CLOCKW', 125-118, 194-128)
    drawText('ROTATE\nCLOCKW', 160-118, 164-128)
  }
}
