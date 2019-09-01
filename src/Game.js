import { Input } from './Input'
import { Level } from './Level'
import { PauseScreen } from './PauseScreen'
import { nextScene, setScene } from './globals'

export let Game = {
  scene: new PauseScreen(new Level()),

  start () {
    Game.tick()
  },

  tick () {
    requestAnimationFrame(Game.tick)

    Input.preUpdate()

    Game.scene.step()

    Input.postUpdate()

    Game.scene.render()

    if (nextScene) {
      Game.scene = nextScene
      setScene(null)
    }
  }
}
