import { Font } from './Assets'
import { Graphics } from './Graphics';

const GLYPH_WIDTH = 6
const GLYPH_HEIGHT = 6

export function getTextWidth (text, scale = 1, extraPadding = 0) {
  let width = 0
  let x = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      x += GLYPH_WIDTH + extraPadding
    } else if (text[i] === '\n') {
      x = 0
    } else {
      x += GLYPH_WIDTH + extraPadding
      width = Math.max(x, width)
    }
  }

  return width * scale
}

export function drawText (text, x, y, scale = 1, extraPadding = 0) {
  let ox = x
  let oy = y
  let px = 0
  let py = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      px += GLYPH_WIDTH + extraPadding
    } else if (text[i] === '\n') {
      px = 0
      py += GLYPH_HEIGHT + 1
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
        ox + scale * px, oy + scale * py,
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

export function drawTextCentered (text, x, y, scale = 1, extraPadding = 0) {
  const width = getTextWidth(text, scale, extraPadding)
  drawText(text, x - width / 2, y, scale, extraPadding)
}

export function drawBoldTextCentered (text, x, y, scale = 1) {
  drawTextCentered(text, x, y, scale, 1)
  drawTextCentered(text, x + scale, y, scale, 1)
}
