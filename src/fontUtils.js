import { Font } from './Assets'
import { Graphics } from './Graphics';

export const GLYPH_WIDTH = 6
export const GLYPH_HEIGHT = 6

export function getTextWidth(text) {
  return text.length * GLYPH_WIDTH
}

export function drawText (text, x, y, scale = 1, extraPadding = 0) {
  let ox = x
  let px = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      px += GLYPH_WIDTH + extraPadding
    } else {
      let index = text.charCodeAt(i) - 43
      if (index >= 4) {
        index--
      }
      if (index > 15) {
        index -= 6
      }
      Graphics.drawImage(
        Font.renderable,
        index * GLYPH_WIDTH,
        0,
        GLYPH_WIDTH - 1,
        GLYPH_HEIGHT,
        ox + scale * px, y,
        scale * (GLYPH_WIDTH - 1),
        scale * (GLYPH_HEIGHT)
      )
      px += GLYPH_WIDTH + extraPadding
    }
  }
}

export function drawBoldText (text, x, y, scale = 1) {
  drawText(text, x, y, scale, 1)
  drawText(text, x + scale, y, scale, 1)
}
