import { Font } from './Assets'
import { Graphics } from './Graphics';

export const GLYPH_WIDTH = 6
export const GLYPH_HEIGHT = 6

export function getTextWidth(text) {
  return text.length * GLYPH_WIDTH
}

export const specialGlyphs = {
  '.': [0, 2],
  ':': [2, 2],
  '+': [4, 6],
  '-': [10, 6]
}

export function drawText (text, x, y, scale = 1, extraPadding = 0) {
  let ox = x
  let px = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      px += GLYPH_WIDTH + extraPadding
    } else {
      const custom = specialGlyphs[text[i]]
      let offset
      let width = GLYPH_WIDTH
      if (custom) {
        offset = custom[0]
        width = custom[1]
      } else if (text[i] < 'A') {
        offset = 16 + (text.charCodeAt(i) - 48) * GLYPH_WIDTH
      } else {
        offset = 76 + (text.charCodeAt(i) - 65) * GLYPH_WIDTH
      }
      Graphics.drawImage(
        Font.renderable,
        offset,
        0,
        width - 1,
        GLYPH_HEIGHT,
        ox + scale * px, y,
        scale * (width - 1),
        scale * (GLYPH_HEIGHT)
      )
      px += width + extraPadding
    }
  }
}

export function drawBoldText (text, x, y, scale = 1) {
  drawText(text, x, y, scale, 1)
  drawText(text, x + scale, y, scale, 1)
}
