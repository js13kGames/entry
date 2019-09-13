import { Input } from './Input'
import { Level } from './Level'
import { StartScreen } from './StartScreen'
import { setScene, currentScene } from './globals'

let accumulatedElapsedTime = 0
let oldTime = 0

export let Game = {
  start () {
    setScene(new StartScreen(new Level()))
    requestAnimationFrame(Game.tick)
  },

  tick (time) {
    requestAnimationFrame(Game.tick)

    let dt = oldTime ? time - oldTime : 0
    oldTime = time

    accumulatedElapsedTime += dt

    // Not sure if this still holds, but...
    // https://github.com/4ian/GDevelop/blob/5b3bb9d0cf0b16fc2ea945ea30047717d327d97a/GDJS/Runtime/runtimegame.js#L367
    if (1000 / accumulatedElapsedTime > 67) {
      return
    }

    accumulatedElapsedTime = 0

    let scene = currentScene

    Input.preUpdate()

    scene.step()

    Input.postUpdate()

    scene.render()
  }
}
