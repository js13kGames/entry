import { Input } from './Input'
import { Level } from './Level'

export let Game = {
  scene: new Level(),

  start () {
    Game.tick()
  },

  tick () {
    requestAnimationFrame(Game.tick)

    Input.preUpdate()

    Game.scene.step()

    Input.postUpdate()

    Game.scene.render()
  }
}
