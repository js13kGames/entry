import { Input } from './Input'
import { Level } from './Level'
import { StartScreen } from './StartScreen'
import { setScene, currentScene } from './globals'

export let Game = {
  start () {
    setScene(new StartScreen(new Level()))
    Game.tick()
  },

  tick () {
    requestAnimationFrame(Game.tick)

    let scene = currentScene

    Input.preUpdate()

    scene.step()

    Input.postUpdate()

    scene.render()
  }
}
