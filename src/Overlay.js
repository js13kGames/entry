import { Graphics, Canvas, resetTransform } from './Graphics'

export class Overlay {
  constructor (scene) {
    this.scene = scene
  }

  render () {
    this.scene.paused = true
    this.scene.render()
    this.scene.paused = false

    resetTransform()
    Graphics.fillStyle = 'rgba(0,0,0,0.8)'
    Graphics.fillRect(0, 0, Canvas.width, Canvas.height)
  }
}
