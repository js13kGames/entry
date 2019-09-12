# 20461-dioretsa

Named after the [damocloid](https://en.wikipedia.org/wiki/20461_Dioretsa), 20461 Dioretsa is a local multiplayer Asteroids-like, desktop entry for [Js13kGames 2019](https://2019.js13kgames.com/entries).

AI will attack PLayer 1, so the game can be played singleplayer versus 1-3 AI. Supports one player with [WASD/QZSD, E, X], one with [ARROW KEYS, SPACE, ESC], and 1-4 with gamepads. Nintendo Joy-Cons have mapped keys (and even attempt to match colours when connected), but other controllers aren't guaranteed to work.

Includes advanced collision detection via a [Collisions library](https://sinova.github.io/Collisions), realistic circle-based elastic collision physics with calculations based on [pi2.js](https://github.com/fahadhaidari/pi2.js/blob/master/pi2.js), and the main GameLoop and a few other bits from the mini game library [Kontra.js](https://straker.github.io/kontra/).

Each of the 4 spaceships have different hitboxes, physics properties and stats, which can be seen in [`src/js/ships`](src/js/ships) although some had to be merged to save space!

### Build
A [Rollup](https://www.npmjs.com/package/rollup) + [terser](https://www.npmjs.com/package/terser) build script was created [just before](https://github.com/burntcustard/js13k-build-scripts/) the competition, and has been adapted specifically for 20461 Dioretsa, with some _**very**_ precarious property mangling and regex-replacing chunks of code.

### Font
The game includes a Path2D-based custom font, which can be played around with in it's [CodePen demo](https://codepen.io/burntcustard/pen/PoYpXJm?editors=1111)

### Local install
1. Clone this repo or download it as a zip and extract it.

2. Install dependencies with `$ npm i`

3. `$ npm run build` will create a playable `dist/index.html` file, or `$ npm start` will start up [browsersync](https://www.browsersync.io/) for live-reloading any changes to the source files.
