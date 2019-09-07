export let Canvas = document.querySelector('canvas')
export let Graphics = Canvas.getContext('2d')

Graphics.imageSmoothingEnabled = false

export function resetTransform () {
  // So that closure compiler recognizes it as an extern
  Graphics['resetTransform']()
}

export function fillAndStrokeRectangle(x, y, width, height) {
  Graphics.fillRect(x, y, width, height)
  Graphics.strokeRect(x, y, width, height)
}

export function drawAt(x, y, callback) {
  Graphics.save()

  Graphics.translate(x, y)

  callback()

  Graphics.restore()
}

export function drawSprite (obj, x, y, index = 0, scaleX = 1, scaleY = 1, rotation = 0) {
  drawAt(x, y, () => {
    Graphics.rotate(rotation)
    Graphics.scale(scaleX, scaleY)

    const frame = obj.frames[index]

    Graphics.drawImage(
      obj.renderable,
      frame.x,
      frame.y,
      frame.w,
      frame.h,
      -frame.oX,
      -frame.oY,
      frame.w,
      frame.h
    )
  })
}
