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
      'YOUR GOAL IS PLAIN AND SIMPLE.\n\n' +
      'MAKE 250 LINES WITH THE TETROMINOES THAT FALL DOWN\n' +
      'EITHER AS FAST AS POSSIBLE OR WITH AN END SCORE AS\n' +
      'HIGH AS POSSIBLE.\n' +
      'THERE IS ONE CATCH THOUGH: THESE TETROMINOES WILL\n' +
      'TRY FLEEING ONCE THEY REALIZE THEIR FATE IS TO BE\n' +
      'DISINTEGRATED! SO TRY TO NEUTRALIZE THEM BEFORE\n' +
      'THEY GO BACK UP.\n\n' +
      'TRY TO CLEAR AS MUCH LINES AT THE SAME TIME AS\n' +
      'POSSIBLE, AND ALSO TRY OUT SOME TRICKS... THEY MIGHT\n' +
      'REWARD YOU SOME EXTRA POINTS...\n\n' +
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
