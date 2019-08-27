import { Font } from './Assets'
import { Graphics } from './Graphics';

const GLYPH_WIDTH = 6
const GLYPH_HEIGHT = 6

export function drawText (text, x, y, extraPadding = 0) {
  let px = x
  let py = y
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      px += GLYPH_WIDTH + extraPadding
    } else if (text[i].match(/\n|#/)) {
      px = x
      py += GLYPH_HEIGHT + 1
    } else {
      let index = text.charCodeAt(i) - 43
      if (index >= 5) {
        index -= 4
      }
      if (index > 10) {
        index -= 7
      }
      Graphics.drawImage(
        Font.renderable,
        index * GLYPH_WIDTH,
        0,
        GLYPH_WIDTH - 1,
        GLYPH_HEIGHT,
        px, py,
        GLYPH_WIDTH - 1,
        GLYPH_HEIGHT
      )
      px += GLYPH_WIDTH + extraPadding
    }
  }
}

export function drawBoldText (text, x, y) {
  drawText(text, x, y, 1)
  drawText(text, x + 1, y, 1)
}
