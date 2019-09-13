/**
 * Some mathematical utilities
 */

export function sign (x) {
  if (x > 0) return 1
  if (x < 0) return -1
  return 0
}

export function clamp (x, min, max) {
  return Math.min(Math.max(x, min), max)
}

export function approach (x, target, acc) {
  return x > target ? Math.max(x - acc, target) : Math.min(x + acc, target)
}

export function ease (t) {
  return t * t * (3 - 2 * t)
}

export function overlapping (rect1, rect2) {
  return (
    rect1.x + rect1.width > rect2.x && rect1.x < rect2.x + rect2.width &&
    rect1.y + rect1.height > rect2.y && rect1.y < rect2.y + rect2.height
  )
}

export function manhattanDistance (x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

export function distanceSquared(x1, y1, x2, y2) {
  let dx = Math.abs(x1 - x2)
  let dy = Math.abs(y1 - y2)
  return dx * dx + dy * dy
}

export let forRectangularRegion = (x0, y0, x1, y1, callback) => {
  for (let yi = y0; yi <= y1; yi++) {
    for (let xi = x0; xi <= x1; xi++) {
      callback(xi, yi)
    }
  }
}

/**
 * Image generation utilities
 */

export async function generateImage (width, height, callback) {
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  await callback(canvas.getContext('2d'))

  // We could technically return the canvas, but having lots of canvases is slower
  // than having lots of images. Sure the generation time goes up, but at least
  // the gameplay doesn't suffer as much.

  let blob = await new Promise(resolve => canvas.toBlob(resolve))

  return new Promise(resolve => {
    let img = new Image()
    img.onload = () => resolve(img)
    img.src = URL.createObjectURL(blob)
  })
}

/**
 * Color utilities
 */

export function makeColorWithAlpha (color, alpha) {
  let [_, type, args] = /^(\w+)\((.*)\)$/.exec(color)
  return `${type}(${args},${alpha})`
}

/**
 * Animation and audio utils
 */
export class EnvelopeSampler {
  constructor (envelope, logarithmic = false) {
    this.envelope = envelope
    this.logarithmic = logarithmic
    this.reset()
  }

  reset () {
    this.i = 0
  }

  sample (position) {
    while (this.i < this.envelope.length - 1) {
      let [t1, v1, curve = 1] = this.envelope[this.i]
      let [t2, v2] = this.envelope[this.i + 1]
      if (t1 <= position && position < t2) {
        let t = (position - t1) / (t2 - t1)
        if (curve > 1) {
          t = t ** curve
        } else {
          t = 1 - (1 - t) ** (1 / curve)
        }
        return this.logarithmic ? v1 * (v2 / v1) ** t : v1 + t * (v2 - v1)
      }
      this.i++
    }
    return this.envelope[this.envelope.length - 1][1]
  }
}

/**
 * Waiting for the next frame is useful for preventing the browser to hang
 * while the assets are being generated
 */
export async function waitForNextFrame () {
  await new Promise(resolve => requestAnimationFrame(resolve))
}


export function zeroPad (str, n) {
  str = str.toString()
  if (str.length > n) {
    return Array(n).fill(9).join('')
  }

  return Array(n - str.length).fill(0).join('') + str
}

