import { Input } from './Input'
import { Level } from './Level'

export let Game = {
  scene: new Level(),

  start () {
    Game.tick()
  },

  tick () {
    requestAnimationFrame(Game.tick)

    Game.scene.step()
    Game.scene.render()

    Input.postUpdate()
  }
}
