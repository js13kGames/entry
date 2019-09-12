//initialization
let { keyPressed, bindKeys, keyMap, Sprite, load, imageAssets, GameLoop, setImagePath, SpriteSheet, getCanvas, getContext, init, initKeys, initPointer } = kontra;
init();
initKeys();
initPointer();
let { canvas, context } = init();
canvas = getCanvas();
context = getContext();
keyMap[16] = "shift";



//sfx and music
let sfx = [
  { name: "music", songData: [{ i: [0, 255, 107, 1, 0, 255, 92, 0, 1, 32, 4, 6, 35, 0, 0, 0, 0, 0, 0, 2, 36, 0, 9, 21, 0, 5, 0, 0], p: [27, 27], c: [{ n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [147, , , , , , , 147, , , 147, 147, , , 147, 147, 147, , , , , 147, , 147, , , 147, 147, , , 147, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 139], f: [, , , , , , , 24, , , 24, 24, , , 24, 24, , , , , , 24, , 24, , , 24, 24, , , 24, 24, , , , , , , , 47, , , 49, 51, , , 49, 49, , , , , , 47, , 49, , , 47, 41, , , 37, 36] }] }, { i: [3, 0, 128, 0, 3, 68, 128, 0, 1, 218, 4, 4, 40, 0, 0, 1, 0, 0, 1, 2, 67, 115, 124, 190, 0, 6, 39, 1], p: [27, 27], c: [{ n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [, , , , 147, , , , , , , , 147, , , , , , , , 147, , , , , , , , 147], f: [] }] }, { i: [0, 91, 128, 0, 0, 95, 128, 12, 0, 0, 12, 0, 72, 0, 0, 0, 0, 0, 0, 1, 34, 0, 17, 32, 83, 3, 130, 6], p: [27, 27], c: [{ n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [147, 151, 154, , , , , , , , , , , , , , 146, 149, 153], f: [, , , , , 21, 21, 21, 21, 23, , , 28, , , , , , , , , , , , , , , , , , , , , , , , , 67, 46, 44, 34, 17, , , 6] }] }, { i: [0, 255, 92, 1, 0, 255, 92, 0, 1, 0, 0, 7, 101, 0, 0, 0, 0, 0, 0, 2, 255, 0, 1, 8, 83, 5, 25, 1], p: [12, 12], c: [{ n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [147, , , , , , , 147, , , 151, 154, , , , , 146, , , , , 146, , 149, , , 146, 153], f: [13, , , , , , , 13, , , 13, 13, 24, 24, 24, 24, 24, , , , , 13, , 13, , , 13, 13, , , , , 154, , , , , , , 92, , , 92, 89, 12, 12, 12, 9, 8, , , , , 96, , 99, , , 101, 101] }] }, { i: [0, 0, 128, 0, 0, 0, 128, 0, 0, 72, 0, 1, 56, 0, 0, 0, 0, 0, 0, 1, 193, 171, 0, 4, 39, 3, 0, 3], p: [27, 27], c: [{ n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [, , 147, , , , , , , , 147, , , , , , , , 147, , , , , , , , 147], f: [] }] }, { i: [1, 192, 128, 0, 1, 191, 116, 9, 0, 0, 6, 22, 34, 0, 0, 0, 0, 0, 1, 1, 0, 167, 0, 28, 77, 6, 17, 6], p: [23, 24], c: [{ n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [147, , , 151, , , 154, , , 149, , , 156, , 158, , 146, , , 153, , , 149, , , , 148, , 142, , 144], f: [21, , , , , , , , , , , , , , , 27, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 17] }, { n: [147, , , 151, , , 154, , , , 149, , 156, 157, 158, , 146, 149, 151, 152, 153, , , , 151, 153, 154, 156, 158], f: [] }] }, { i: [0, 31, 131, 1, 0, 83, 128, 0, 1, 210, 4, 7, 41, 0, 0, 0, 0, 0, 1, 2, 255, 0, 12, 17, 61, 5, 0, 0], p: [, 27], c: [{ n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 146, 139, 135], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 147, , , 147, , , 147, , , 147, , 147, 154, 144, 139, 135], f: [] }] },], rowLen: 5513, patternLen: 32, endPattern: 1, numChannels: 7 },
  { name: "portal", songData: [{ i: [0, 146, 128, 0, 0, 224, 128, 3, 0, 0, 37, 0, 81, 0, 0, 3, 0, 0, 1, 2, 124, 135, 0, 32, 0, 3, 0, 6], p: [27], c: [{ n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [147, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 151, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 154], f: [] }] }, { i: [0, 232, 142, 1, 0, 0, 164, 0, 1, 0, 29, 0, 57, 0, 0, 0, 0, 0, 0, 3, 85, 0, 1, 39, 76, 5, 0, 0], p: [15], c: [{ n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [], f: [] }, { n: [135], f: [] }] },], rowLen: 5513, patternLen: 32, endPattern: 0, numChannels: 2 },
  { name: "jump", songData: [{ i: [3, 255, 128, 0, 0, 255, 147, 0, 0, 127, 2, 2, 23, 0, 0, 0, 0, 0, 1, 3, 94, 79, 0, 32, 0, 2, 0, 4], p: [1], c: [{ n: [147], f: [] }] },], rowLen: 5513, patternLen: 32, endPattern: 0, numChannels: 1 },
  { name: "gunshot", songData: [{ i: [3, 148, 157, 1, 1, 125, 128, 0, 1, 85, 4, 7, 43, 0, 0, 0, 0, 0, 1, 2, 177, 0, 2, 32, 0, 5, 0, 6], p: [1], c: [{ n: [147], f: [10, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 85] }] },], rowLen: 5513, patternLen: 32, endPattern: 0, numChannels: 1 }
];


let audiosrc = {
  music: "",
  jump: "",
  gunshot: "",
  portal: ""
};

let audiodone = {
  music: false,
  jump: false,
  gunshot: false,
  portal: false
};

function generateWave(song) {
  var done = false;
  let p = new CPlayer();
  p.init(song);
  setInterval(function () {
    if (done) {
      return;
    }
    done = p.generate() >= 1;
    if (done) {
      // Put the generated song in an Audio element.
      var wave = p.createWave();

      audiosrc[song.name] = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
      audiodone[song.name] = true;
    }
  }, 0);
}

sfx.map(s => generateWave(s));

var music = document.createElement("audio");
var jump = document.createElement("audio");
var gunshot = document.createElement("audio");
var portal = document.createElement("audio");

let audiomap = setInterval(() => {
  if (audiosrc.music == "" || audiosrc.jump == "" || audiosrc.gunshot == "" || audiosrc.portal == "") {
    return;
  }

  music.src = audiosrc.music;
  jump.src = audiosrc.jump;
  gunshot.src = audiosrc.gunshot;
  portal.src = audiosrc.portal;


  clearInterval(audiomap);
}, 0);

music.volume = 0.1;
music.loop = true;
//end of music and sfx
var gameRunning = false;
var sfxEnabled = true;
var musicEnabled = true;
var gameOverDisplay = false;
var loading = true;
var highScore = 0;
function muteMusic() {
  if (musicEnabled) {
    var promise = music.play();

    if (promise !== undefined) {
      promise.then(_ => {

      }).catch(error => {

        musicEnabled = false;
      });
    }
    loading = false;

  } else {
    music.pause();
    loading = false;
  }
}

function main() {
  var sprites = [];
  var y = [430, 340, 244, 148, 52];
  var level = 1;
  var score = 0;
  let g = 0.1;
  var facingleft = false;
  var t = 0;
  var jumpt = 0;
  var playerIsDead = false;

  //loading images
  setImagePath("./assets");
  load("platform.png", "walkcycle.png", "ghost.png").then(function () {

    //Background & map
    let platform = Sprite({
      image: imageAssets["platform"],
      y: 464,
      type: "platform"
    });

    let platform1 = [
      Sprite({
        image: imageAssets["platform"],
        y: 374,
        x: 80,
        type: "platform"
      }),
      Sprite({
        image: imageAssets["platform"],
        y: 278,
        x: -128,
        type: "platform"
      }),
      Sprite({
        image: imageAssets["platform"],
        y: 182,
        x: 144,
        type: "platform"
      }),
      Sprite({
        image: imageAssets["platform"],
        y: 86,
        x: -80,
        type: "platform"
      })
    ];

    //fix for platform edges
    let platform2 = [
      Sprite({
        height: 11,
        width: 1,
        y: 378,
        x: 80,
        type: "platform"
      }),
      Sprite({
        height: 11,
        width: 1,
        y: 282,
        x: -128 + platform1[1].width,
        type: "platform"
      }),
      Sprite({
        height: 11,
        width: 1,
        y: 184,
        x: 144,
        type: "platform"
      }),
      Sprite({
        height: 11,
        width: 1,
        y: 89,
        x: -80 + platform1[3].width,
        type: "platform"
      })

    ];

    // portal
    let portalIn = Sprite({
      x: 10,
      y: 46,
      width: 30,
      height: 40,
      color: "blue",
      render: function () {
        this.draw();
        this.context.strokeStyle = "black";
        this.context.strokeRect(this.x, this.y, this.width, this.height);
      }
    });

    let portalOut = Sprite({
      x: 814,
      y: 424,
      width: 30,
      height: 40,
      color: "orange",
      render: function () {
        this.draw();
        this.context.strokeStyle = "black";
        this.context.strokeRect(this.x, this.y, this.width, this.height);

      }
    });
    //player animation
    let character = SpriteSheet({
      image: imageAssets["walkcycle"],
      frameWidth: 32,
      frameHeight: 31,
      animations: {
        walkRight: {
          frames: "0..2",
          frameRate: 14
        },
        walkLeft: {
          frames: "3..5",
          frameRate: 14
        },
        shootL: {
          frames: "7..7",
          frameRate: 1

        },
        shootR: {
          frames: "6..6",
          frameRate: 1

        }

      }
    });

    //Player
    let player = Sprite({
      x: portalOut.x,
      y: 400,
      animations: character.animations,
      onGround: false,
      type: "player",
    });

    sprites.push(platform, ...platform1, portalIn, portalOut, player);

    //global variables;
    let p0 = platform1[0].y + platform1[0].height;
    let p1 = platform1[1].y + platform1[1].height;
    let p2 = platform1[2].y + platform1[2].height;
    let p3 = platform1[3].y + platform1[3].height;


    function collidesWithPlatForm(player) {
      let pos = player.y + player.height;

      //+10 is for player pixel correction
      return (
        !(pos >= platform.y) &&
        !(pos >= platform1[0].y && pos < p0 && player.x + player.width >= platform1[0].x + 10) &&
        !(pos >= platform1[1].y && pos < p1 && player.x <= platform1[1].x + platform1[1].width - 10) &&
        !(pos >= platform1[2].y && pos < p2 && player.x + player.width >= platform1[2].x + 10) &&
        !(pos >= platform1[3].y && pos < p3 && player.x <= platform1[3].x + platform1[3].width - 10)
      );
    }

    function headbump(player) {
      return (
        (player.y <= p0 && player.y > p0 - 5 && (player.x + player.width >= platform1[0].x + 10)) ||
        (player.y <= p1 && player.y > p1 - 5 && (player.x <= platform1[1].x + platform1[1].width - 10)) ||
        (player.y <= p2 && player.y > p2 - 5 && (player.x + player.width >= platform1[2].x + 10)) ||
        (player.y <= p3 && player.y > p3 - 5 && (player.x <= platform1[3].x + platform1[3].width - 10))

      )
    }

    //small fix for edge of platform
    function xplatfrom(player) {
      return (
        player.collidesWith(platform2[0]) || player.collidesWith(platform2[1]) || player.collidesWith(platform2[2]) || player.collidesWith(platform2[3])
      )
    }



    function addGhost() {
      let counter = 0;
      y.map(y1 => {
        counter++;
        for (let i = 1; i <= Math.floor(Math.random() * level) + 1; i++) {
          let x = 10;
          switch (counter) {
            case 1:
              x = Math.floor(Math.random() * 500);
              break;
            case 2:
              x = Math.floor(Math.random() * 772) + 80;
              break;
            case 3:
              x = Math.floor(Math.random() * (platform1[1].x + platform1[1].width));
              break;
            case 4:
              x = Math.floor(Math.random() * 706) + 144;
              break;
            case 5:
              x = Math.floor(Math.random() * (platform1[3].x + platform1[3].width));
              break;
            default:
              break;
          };
          let ghost = Sprite({
            type: "ghost",
            x: x,
            y: y1,
            height: 32,
            width: 21,
            score: 10,
            dx: (Math.random() * 5) + 1,
            image: imageAssets["ghost"]
          });
          sprites.push(ghost);
        }
      });
    }

    addGhost();

    let loop = GameLoop({
      update: function () {
        t += 1 / 60;
        jumpt += 1 / 60;

        //keyboard input
        if (keyPressed("space") && t > 0.75) {
          t = 0;
          if (sfxEnabled) {
            gunshot.load();
            gunshot.play();
          }
          if (facingleft) {
            player.playAnimation("shootL");
          } else {
            player.playAnimation("shootR");
          }

          let bullet = Sprite({
            type: "bullet",
            x: facingleft ? player.x : player.x + player.width,
            y: player.y + 10,
            dx: facingleft ? -6 : 6,
            width: 4,
            height: 2,
            ttl: 30,
            color: "white"
          });

          sprites.push(bullet);
          bullet.update();

        }
        if (keyPressed("d") || keyPressed("right")) {
          if (player.x < 809) {
            if (!xplatfrom(player)) {
              if (keyPressed("shift")) {
                player.x += 4.0;
              } else {
                player.x += 2.5;
              }
            }
            player.playAnimation("walkRight");
            facingleft = false;
          }
          if (player.onGround) {
            player.update();
          }
        } else if (keyPressed("a") || keyPressed("left")) {

          if (player.x > 0) {
            if (!xplatfrom(player)) {
              if (keyPressed("shift")) {
                player.x -= 4.0;
              } else {
                player.x -= 2.5;
              }
            }
            player.playAnimation("walkLeft");
            facingleft = true;
          }
          if (player.onGround) {
            player.update();
          }
        }
        if ((keyPressed("w") || keyPressed("up")) && player.onGround && jumpt > 0.25) {
          jumpt = 0;
          if (sfxEnabled) {
            jump.load();
            jump.play();
          }
          player.dy -= 4.5;
          player.update();
        }

        //player gravity and platform collision checking
        if (player.y <= 0) {
          player.dy = g;
          player.update();
        }
        if (collidesWithPlatForm(player)) {
          player.dy += g;
          player.onGround = false;
          player.update();
        } else {
          player.onGround = true;
          player.dy = 0;
        }
        if (headbump(player)) {
          player.onGround = false;
          player.dy = g;
          player.update();
        }

        //portal
        if (player.collidesWith(portalIn)) {
          player.x = portalOut.x;
          player.y = portalOut.y;
          if (sfxEnabled) {
            portal.load();
            portal.play();
          }
          level++;
          addGhost();

        }


        //ghost events
        sprites.map(s => {
          if (s.type == "ghost") {
            if (s.y == 430) {
              if (s.x < 2) {
                s.dx = Math.abs(s.dx);
              } else if (s.x > 500) {
                s.dx = -Math.abs(s.dx);
              }
            }
            else if (s.y == 340) {
              if (s.x < 82) {
                s.dx = Math.abs(s.dx);
              } else if (s.x > 833) {
                s.dx = -Math.abs(s.dx);
              }
            } else if (s.y == 244) {
              if (s.x < 2) {
                s.dx = Math.abs(s.dx);
              } else if (s.x > (platform1[1].x + platform1[1].width - s.width)) {
                s.dx = -Math.abs(s.dx);
              }
            } else if (s.y == 148) {
              if (s.x < 144) {
                s.dx = Math.abs(s.dx);
              } else if (s.x > 833) {
                s.dx = -Math.abs(s.dx);
              }
            } else if (s.y == 52) {
              if (s.x < 2) {
                s.dx = Math.abs(s.dx);
              } else if (s.x > (platform1[3].x + platform1[3].width - s.width)) {
                s.dx = -Math.abs(s.dx);
              }
            }

            sprites.map(sprite => {
              if (sprite.type == "bullet") {
                if (s.collidesWith(sprite)) {
                  score += s.score * level;
                  s.ttl = 0;
                  sprite.ttl = 0;
                }
              }
              if (sprite.type == "player") {
                if (s.collidesWith(sprite)) {
                  player.ttl = 0;
                  playerIsDead = true;
                }
              }
            });
          }
        });

        sprites.map(s => {
          if (s.type == "bullet" || s.type == "ghost") {
            s.update();
          }
        });
        sprites = sprites.filter(sprite => sprite.isAlive());



      },

      render: function () {
        sprites.map(s => s.render());
        context.font = "20px Helvetica, Verdana, san-serif";
        context.fillStyle = "#fff";
        context.textAlign = "left";
        context.fillText("Level: " + level, 10, 25);
        context.textAlign = "center";
        context.fillText("HighScore: " + highScore, canvas.width / 2, 25);
        context.textAlign = "right";
        context.fillText("Score: " + score, canvas.width - 10, 25);



        //player dead check
        if (playerIsDead) {
          gameOver.display();
          highScore = score;
          setData();
          loop.stop();
        }
      }

    }
    );
    loop.start();
  });

}



function setData() {
  let data = {
    hScore: highScore,
    musicOn: musicEnabled,
    sfxOn: sfxEnabled
  }
  localStorage.setItem("BackToThePortal", JSON.stringify(data));
}


if (localStorage.getItem("BackToThePortal")) {
  var { hScore, musicOn, sfxOn } = JSON.parse(localStorage.getItem("BackToThePortal"));
  highScore = hScore;
  musicEnabled = musicOn;
  sfxEnabled = sfxOn;
} else {
  setData();
}

muteMusic();

let gameOver = Sprite({
  display: function () {
    context.font = "40px Helvetica, Verdana, san-serif";
    context.fillStyle = "#fff";
    context.textAlign = "center";
    context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    context.font = "20px Helvetica, Verdana, san-serif";
    context.fillText("Press [R] to replay.", canvas.width / 2, canvas.height / 2 + 30);
    context.fillText("Press [B] to go back to main menu.", canvas.width / 2, canvas.height / 2 + 60);
    gameOverDisplay = true;
  }
});


var onMainMenu = true;
let menu = Sprite({
  mainMenu: function () {
    context.font = "50px Helvetica, Verdana, san-serif";
    context.strokeStyle = "#fff";
    context.textAlign = "center";
    context.strokeText("Press [Enter] to play.", canvas.width / 2, canvas.height / 2);
    context.font = "30px Helvetica, Verdana, san-serif";
    context.fillStyle = "#fff";
    context.fillText("Controls", canvas.width / 2, canvas.height - 100);
    context.fillText("HighScore: " + highScore, canvas.width / 2, canvas.height / 2 + 50);
    context.font = "20px Helvetica, Verdana, san-serif";
    context.fillText("Press [Space] to fire.", canvas.width / 2, canvas.height - 70);
    context.fillText("Press [W] or [↑] to jump.", canvas.width / 2, canvas.height - 40);
    context.fillText("Press [A] [D] or [←] [→] to move Left and Right. Use [Shift] to sprint.", canvas.width / 2, canvas.height - 10);

    context.font = "italic 35px Comic Sans Ms";
    context.fillText("i", 22, canvas.height - 10);
    context.beginPath();
    context.arc(25, canvas.height - 22, 20, 0, 2 * Math.PI);
    context.font = "20px Comic Sans Ms";
    context.fillText("[M] Music", canvas.width - 60, canvas.height - 30);
    context.fillText("[S] sfx", canvas.width - 60, canvas.height - 10);
    context.fillText("[C]", 60, canvas.height - 15);
    if (!sfxEnabled) {
      context.moveTo(797, 465);
      context.lineTo(829, 465);
      context.strokeStyle = "#fff";
    }
    if (!musicEnabled) {
      context.moveTo(785, 445);
      context.lineTo(839, 445);
      context.strokeStyle = "#fff";
    }
    context.stroke();
  }
});

let credit = Sprite({
  credits: function () {
    context.font = "50px Helvetica, Verdana, san-serif";
    context.fillStyle = "#fff";
    context.textAlign = "center";
    context.fillText("Credits", canvas.width / 2, 100);
    context.font = "35px Helvetica, Verdana, san-serif";
    context.fillText("Sfx & Music", canvas.width / 2, 175);
    context.fillText("Sprites & Tiles", canvas.width / 2, 250);
    context.font = "25px Helvetica, Verdana, san-serif";
    context.fillText("Ash Blue", canvas.width / 2, 205);
    context.fillText("Kimmo Rundelin", canvas.width / 2, 280);
    context.fillText("thekingphoenix", canvas.width / 2, 310);
    context.fillText("Lanea Zimmerman", canvas.width / 2, 340);
    context.textAlign = "left";
    context.fillText("Press [B] to go back.", 10, canvas.height - 10);

  }
});

let loadin = Sprite({
  render: function () {
    context.font = "50px Helvetica, Verdana, san-serif";
    context.fillStyle = "#fff";
    context.textAlign = "center";
    context.fillText("Loading...", canvas.width / 2, canvas.height / 2);
  }
});

let loadInterval = setInterval(() => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (loading) {
    loadin.render();
  } else {
    menu.mainMenu();
    clearInterval(loadInterval);
  }
});


bindKeys("enter", function (e){
  e.preventDefault();
  if (!gameRunning && onMainMenu){
    context.clearRect(0, 0, canvas.width, canvas.height);
    gameRunning = true;
    main();
  }
})

bindKeys("c", function (e){
  e.preventDefault();
  if (!gameRunning && onMainMenu){
    context.clearRect(0, 0, canvas.width, canvas.height);
    onMainMenu = false;
    credit.credits();
  }
})

bindKeys("m", function(e){
  e.preventDefault();
  if (!gameRunning && onMainMenu){
    musicEnabled = !musicEnabled;
    context.clearRect(0, 0, canvas.width, canvas.height);
    menu.mainMenu();
    muteMusic();
    setData();
  }
})

bindKeys("s", function(e){
  e.preventDefault();
  if (!gameRunning && onMainMenu){
    sfxEnabled = !sfxEnabled;
    context.clearRect(0, 0, canvas.width, canvas.height);
    menu.mainMenu();
    setData();
  }
})

bindKeys("b", function(e){
  e.preventDefault();
  if (!gameRunning && !onMainMenu) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    onMainMenu = true;
    menu.mainMenu();
      
  }
  if (gameOverDisplay) {
    onMainMenu = true;
      gameRunning = false;
      context.clearRect(0, 0, canvas.width, canvas.height);
      menu.mainMenu();
      gameOverDisplay = false;
  }
})

bindKeys("r", function(e){
  e.preventDefault();
  if(god){
    context.clearRect(0, 0, canvas.width, canvas.height);
    gameRunning = true;
    main();
  }
})