JS13k 2019 - Turtle Back
========================

Oh no, Turtle is on its back! Help it get right-side up!

Playable at [games.jayther.com/js13k2019/](https://games.jayther.com/js13k2019/).

Game created for the [2019 js13k games competition](https://2019.js13kgames.com/).

Files: 3 (`index.html`, `b.js`, `c.css`)

unminified: 82.5 KB

minified: 33.1 KB

gzipped: **10.25 KB**

### Dev

Setup:

1. Clone repo
2. `npm install` to install dev stuff.
3. (optional) `npm install -g gulp` to install gulp globally.

Commands:

* `gulp build-dev` to build files for local dev. This produces concatenated files, but not minified.
* `gulp dev` to run game on `localhost:8080` on a lightweight server with non-minified files. This runs `gulp build-dev` before starting the server. `Ctrl+C` to stop the server.
* `gulp build` to build files for prod. This produces minified files.
* `gulp prod` to run game on `localhost:8080` with minified files. This runs `gulp build` before starting the server. `Ctrl+C` to stop the server.
* `gulp dist` to produce a zipped file of the game files (into `dist/archive.zip`).
* `gulp deploy` to deploy to website via FTP (for personal website). Needs `.env` file with the appropriate vars.
