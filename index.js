import { init, GameLoop, initKeys, keyPressed, assets } from "kontra";
import { sequence, sequenceBase, sequenceBase5th, when } from "./src/music";
import { createTCVS, drawText } from "./src/text";
const { canvas, context } = init();

import { dino } from "./src/createDino";
import { createGround } from "./src/createGround";
import { createEnemy } from "./src/createEnemy";
import { createFuture } from "./src/createFuture";
import { createPast } from "./src/createPast";

const intersect = (rect, circle) => {
  const cx = Math.abs(circle.x - rect.x - rect.halfWidth);
  const xDist = rect.halfWidth + circle.radius;
  if (cx > xDist) {
    return false;
  }
  const cy = Math.abs(circle.y - rect.y - rect.halfHeight);
  const yDist = rect.halfHeight + circle.radius;
  if (cy > yDist) return false;
  if (cx <= rect.halfWidth || cy <= rect.halfHeight) {
    return true;
  }

  const xCornerDist = cx;
  const yCornerDist = cy;
  const xCornerDistSq = xCornerDist * xCornerDist;
  const yCornerDistSq = yCornerDist * yCornerDist;
  const maxCornerDistSq = circle.radius * circle.radius;

  if (Math.abs(xCornerDistSq + yCornerDistSq) <= maxCornerDistSq) {
    return true;
  } else {
    return false;
  }
};

/*
======== ONE TIME VAR INITIALIZATION =================
*/

var x = canvas.getContext("2d");
x.imageSmoothingEnabled = false;
x.webkitImageSmoothingEnabled = false;
x.mozImageSmoothingEnabled = false;
x.msImageSmoothingEnabled = false;
x.oImageSmoothingEnabled = false;
var imgPath = "assets/";
//colors
var c1 = "#70c1b3";
var c2 = "#ffe066";
var c3 = "#f25f5c";
var c4 = "#247ba0";
var c5 = "#50514f";
let TCTX = createTCVS(canvas);

// /*
// ===== PRE-LOADING ASSETS then start the game ============
// */
// assets
//   .load(
//     imgPath + "dino.png",
//   )
//   .then(function() {
//     //load data
//     startLoop();
//     if (window.localStorage) {
//       personalBest = parseInt(localStorage.getItem("RECORD")) || 0;
//     } else {
//       // can't be used
//     }
//     pixels = [];
//     bgPixels = [];
//     create_pool();

//     initVar();
//     initializeGame();

//     particleBg();
//   })
//   .catch(function(err) {
//     // error loading an asset
//   });

const $restart = document.querySelector("#restart");

const GAME_PHASES = {
  hold: -1,
  dead: 1,
  play: 2,
  restart: 3,
};

const GAME_TEXT = {
  title: "Back In Dino",
  gameBy: "a game by Nicolantonio Vignola - js13kgames 2019",
  gameOver: "Game Over",
};
let gamePhase;
let future;
let past;
let enemies = [];
let isMoving = false;
let grounds = [];
let sprites = [];
const VELOCITY = 1.5;

initKeys();

let collideGround = () => {
  if (dino.y >= canvas.height - dino.height) {
    dino.y = canvas.height - dino.height;
    dino.grounded = true;
    dino.jumping = false;
    dino.dy = 0;
  }
};

function initGame() {
  gamePhase = GAME_PHASES.hold;
  dino.grounded = true;
  dino.x = canvas.width / 2 - dino.width / 2;
  dino.y = canvas.height - dino.height / 2;
  future = createFuture(canvas);
  past = createPast(canvas);
  grounds = [];
  enemies = [];
  isMoving = false;
  sprites = [];
  function createEnemies() {
    let enemy = createEnemy(context);
    enemies.push(enemy);
  }
  for (var i = 0; i < 4; i++) {
    createEnemies();
  }

  for (var i = 0; i <= canvas.width; i++) {
    let ground = createGround(context, i);
    grounds.push(ground);
  }
  sprites = [].concat(enemies, dino);
}

let loop = GameLoop({
  update: function(dt) {
    isMoving = false;
    collideGround();

    if (keyPressed("left")) {
      dino.playAnimation("moonwalk");
      isMoving = true;
      dino.x -= VELOCITY;

      past.x += 1;
      future.x += 1;
    }
    if (keyPressed("right")) {
      dino.playAnimation("walk");
      dino.x += VELOCITY;
      isMoving = true;

      past.x -= 1;
      future.x -= 1;
    }
    // Determine when to stop jumping if not colliding with anything
    if (dino.lastY - dino.y >= 60) {
      dino.jumping = false;
    }

    // Pull dino down if not jumping and in the air
    if (!dino.grounded && !dino.jumping) {
      dino.dy += 0.15;
      dino.playAnimation("jump");
    }
    if (keyPressed("up") && dino.grounded) {
      dino.dy = -dino.gravity - 2;
      dino.grounded = false;
      dino.jumping = true;
      dino.lastY = dino.y;
      dino.playAnimation("jump");
      isMoving = true;
    }
    if (!isMoving && !dino.jumping) {
      dino.playAnimation("idle");
    }
    enemies.map(enemy => {
      enemy.update();
      // enemy is beyond the left edge
      if (enemy.x < 0 - enemy.radius) {
        enemy.x = canvas.width;
      }
      // enemy is beyond the right edge
      else if (enemy.x > canvas.width + enemy.radius) {
        enemy.x = 0;
      }
      // enemy is beyond the top edge
      if (enemy.y < 0 - enemy.radius) {
        enemy.y = canvas.height;
      }
      // enemy is beyond the bottom edge
      else if (enemy.y > canvas.height + enemy.radius) {
        enemy.y = 0;
      }
    });
    grounds.map(ground => ground.update());
    dino.update();
    future.update();
    past.update();

    if (future.x - dino.x - dino.width + 5 < 1) {
      dino.ttl = 0;
      dino.playAnimation("cry");
      loop.stop();
    }

    if (past.width + past.x - dino.x - dino.width + 20 >= 0) {
      dino.ttl = 0;
      dino.playAnimation("cry");
      loop.stop();
    }

    // collision detection
    for (let i = 0; i < sprites.length; i++) {
      // only check for collision against bullets
      if (sprites[i].type === "bullet") {
        for (let j = 0; j < sprites.length; j++) {
          // don't check bullet vs. bullet collisions
          if (sprites[j].type !== "bullet") {
            let bullet = sprites[i];
            let sprite = sprites[j];
            if (intersect(sprite, bullet)) {
              sprite.playAnimation("cry");
              bullet.ttl = 0;
              sprite.ttl = 0;
              TCTX.fillStyle = c5;
              initializeGame();
              loop.stop();
              break;
            }
          }
        }
      }
    }
    // sprites = sprites.filter(sprite => {
    //   return sprite.isAlive();
    // });
  },
  render: function() {
    dino.render();
    enemies.map(enemy => enemy.render());
    grounds.map(ground => ground.render());
    future.render();
    past.render();
  },
});

sequence.play(when);
sequenceBase.play(when);
sequenceBase5th.play(when);

initializeGame();
setTimeout(() => {
  initGame();
}, 1000);

$restart.addEventListener("click", () => {
  initGame();
  loop.start();
});

//initialization of title screen
function initializeGame() {
  TCTX.fillStyle = c2;

  drawText(GAME_TEXT.title, 1, {
    x: GAME_TEXT.title.length * 2.5,
    y: GAME_TEXT.title.length,
  });
  drawText(GAME_TEXT.gameBy, 0.3, {
    x: 2,
    y: canvas.height - 8,
  });

  TCTX.fillStyle = c4;
  drawText("- press arrow right to move right", 0.3, {
    x: 30,
    y: 70,
  });
  drawText("- press arrow left to move left", 0.3, {
    x: 30,
    y: 90,
  });
  drawText("- press arrow up to jump", 0.3, {
    x: 30,
    y: 110,
  });
}
