const {
  init,
  Sprite,
  GameLoop,
  load,
  setImagePath,
  imageAssets,
  on,
  SpriteSheet,
  initPointer,
  onPointerDown,
  setStoreItem,
  getStoreItem
} = kontra;

// Color constant, variables
const COLOR_1: string = "#9F2000";
const COLOR_2: string = "#DD8B00";
const COLOR_3: string = "#FFC869";
const COLOR_4: string = "#FFFCA4";
let numAssets: number = 1;
let assetsLoaded: number = 0;
let gameState = "loading";
let highScore =
  getStoreItem("coiner_highscore") !== null
    ? getStoreItem("coiner_highscore")
    : 0;
let coin,
  coiner,
  coinerSpriteSheet,
  ground,
  bar,
  time,
  score,
  timeImage,
  scoreText,
  logo,
  highScoreText,
  rules,
  credits,
  progressBar,
  loadingText;

// create a new Web Audio API context
const ac = new AudioContext();

// set the playback tempo (120 beats per minute)
const tempo = 120;

const jumpSound = new TinyMusic.Sequence(ac, tempo, ["A4 s"]);
jumpSound.loop = false;

const coinSound = new TinyMusic.Sequence(ac, tempo, ["B4 e"]);
coinSound.loop = false;

const clickSound = new TinyMusic.Sequence(ac, tempo, ["F4 e"]);
clickSound.loop = false;

// Init game and canvas
const { canvas, context } = init();
const canvasWidth = canvas.width;
const centerX = canvasWidth / 2;
// Set image path and init pointer
setImagePath("./assets/sprites");
initPointer();

// Check loaded assets
on("assetLoaded", (asset, url) => {
  assetsLoaded++;

  if (assetsLoaded === numAssets) {
    initMenuVariables();
    gameState = "menu";
  }
});

// Loading assets
load("Coiner.png")
  .then(function(assets) {
    initLoadingVariables();

    // Game loop
    const loop = GameLoop({
      update: function(dt) {
        if (gameState === "game") {
          updateGame();
        } else if (gameState === "menu") {
          updateMenu();
        } else if (gameState === "loading") {
          updateLoaing();
        }
      },
      render: function() {
        if (gameState === "game") {
          renderGame();
        } else if (gameState === "menu") {
          renderMenu();
        } else if (gameState === "loading") {
          renderLoaing();
        }
      }
    });

    loop.start();

    onPointerDown(function(e, object) {
      if (gameState === "game") {
        if (coiner.touchingGround && coiner.canJump) {
          jumpSound.play();
          coiner.isJumping = true;
          coiner.touchingGround = false;
          coiner.canJump = false;
          coiner.dy = -5;
          coiner.dx = 0;
        }
      } else if (gameState === "menu") {
        initGameVariables();
        clickSound.play();
        gameState = "game";
      }
    });
  })
  .catch(function(err) {
    console.log(err);
  });

const initGameVariables = () => {
  // init score
  score = 0;
  time = 100;

  // Time image
  timeImage = Sprite({
    color: COLOR_2,
    render: function() {
      let width = (200 * time) / 100;

      context.beginPath();
      context.rect(centerX - width / 2, 10, width, 30);
      context.fillStyle = this.color;
      context.fill();
    }
  });

  // Score text
  scoreText = Sprite({
    color: COLOR_1,
    render: function() {
      context.textAlign = "center";
      context.font = "bold 40px Arial";
      context.fillStyle = this.color;
      context.fillText(`${score}`, centerX, 90);
    }
  });

  // Coin image and sprite
  coin = Sprite({
    x: centerX,
    y: 140,
    width: 64,
    height: 64,
    anchor: {
      x: 0.5,
      y: 0.5
    },
    color: COLOR_3,
    border: COLOR_1,
    type: "coin",
    render: function() {
      context.beginPath();
      context.arc(centerX, 140, 28, 0, 2 * Math.PI);
      context.fillStyle = this.color;
      context.strokeStyle = this.border;
      context.lineWidth = 4;
      context.stroke();
      context.fill();
    }
  });

  // Bar sprite
  bar = Sprite({
    x: 0,
    y: 280,
    width: 64,
    height: 16,
    color: COLOR_1,
    dx: 4,
    type: "bar"
  });

  // Ground image and sprite
  ground = Sprite({
    x: centerX,
    y: 400,
    width: 64,
    height: 64,
    anchor: {
      x: 0.5,
      y: 0
    },
    type: "ground",
    color: COLOR_2,
    circle: COLOR_3,
    border: COLOR_1,
    render: function() {
      // draw square
      context.beginPath();
      context.rect(centerX - 30, 402, 60, 60);
      context.fillStyle = this.color;
      context.strokeStyle = this.border;
      context.lineWidth = 4;
      context.fill();
      context.stroke();
      // draw a line
      context.beginPath();
      context.moveTo(centerX - 30, 432);
      context.lineTo(centerX + 30, 432);
      context.lineWidth = 4;
      context.stroke();
      // draw circle
      context.beginPath();
      context.arc(centerX, 432, 20, 0, 2 * Math.PI);
      context.fillStyle = this.circle;
      context.strokeStyle = this.border;
      context.lineWidth = 4;
      context.stroke();
      context.fill();
    }
  });

  // Coiner image and sprite
  coinerSpriteSheet = SpriteSheet({
    image: imageAssets["Coiner"],
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: {
        frames: 0
      },
      coin: {
        frames: 1
      }
    }
  });
  coiner = Sprite({
    x: centerX - 32,
    y: 300,
    width: 64,
    height: 64,
    dy: 5,
    animations: coinerSpriteSheet.animations,
    type: "coiner",
    animation: "idle",
    canJump: false,
    isJumping: false,
    touchingGround: false,
    coinerVelocity: 0,
    MAX_JUMPING_HEIGHT: 160,
    havingCoin: false
  });
};

const updateGame = () => {
  timeImage.update();
  coin.update();
  bar.update();
  ground.update();
  coiner.update();
  scoreText.update();

  // deduct coinAmount
  if (time > 0) {
    time -= 0.1;
  } else {
    if (score > highScore) {
      highScore = score;
      setStoreItem("coiner_highscore", highScore);
    }
    gameState = "menu";
  }

  // Play animation of coiner
  coiner.playAnimation(coiner.animation);

  // Bouce back when touching edge
  if (bar.x === 0) {
    bar.dx = Math.abs(bar.dx);

    if (coiner.dx !== 0) coiner.dx = bar.dx;
  } else if (bar.x + 64 == canvasWidth) {
    bar.dx = -Math.abs(bar.dx);

    if (coiner.dx !== 0) coiner.dx = bar.dx;
  }

  // Check if coiner is jumping
  if (coiner.isJumping) {
    coiner.coinerVelocity += 5;

    if (coiner.coinerVelocity === coiner.MAX_JUMPING_HEIGHT) {
      coiner.isJumping = false;
      coiner.coinerVelocity = 0;
      coiner.dy = 5;
    }
  }

  // Check if coiner is colliding with bar
  if (coiner.collidesWith(bar)) {
    if (coiner.y > bar.y) {
      coiner.dy = 5;
    } else if (coiner.y < bar.y) {
      if (coiner.x + 62 === bar.x || bar.x + 62 === coiner.x) {
        coiner.dy = Math.abs(coiner.dy);

        if (bar.dx < 0) {
          coiner.dx = bar.dx;
        } else if (bar.dx > 0) {
          coiner.dx = bar.dx;
        }
      } else {
        coiner.canJump = true;
        coiner.touchingGround = true;
        coiner.dy = 0;
        coiner.y--;
        coiner.dx = bar.dx;
      }
    }
  } else {
    if (coiner.y > bar.y) {
      coiner.dx = 0;
    }
  }

  // Check coiner is colliding with ground
  if (coiner.collidesWith(ground)) {
    coiner.canJump = true;
    coiner.touchingGround = true;
    coiner.dy = 0;
    coiner.y--;

    if (coiner.havingCoin) {
      coinSound.play();
      coiner.havingCoin = false;
      coiner.animation = "idle";
      time += 20;
      score++;

      if (time > 100) time = 100;
    }
  }

  // Check coiner is colliding with coin
  if (coiner.collidesWith(coin)) {
    coiner.havingCoin = true;
    coiner.animation = "coin";
  }

  // Check if coiner falling
  if (coiner.y > 510) {
    coiner.x = centerX - 32;
    coiner.y = 300;
  }
};

const renderGame = () => {
  timeImage.render();
  bar.render();
  coin.render();
  ground.render();
  coiner.render();
  scoreText.render();
};

const initMenuVariables = () => {
  logo = Sprite({
    color: COLOR_3,
    border: COLOR_1,
    render: function() {
      context.textAlign = "center";
      context.font = "bolder 3em Arial";
      context.fillStyle = this.color;
      context.strokeStyle = this.border;
      context.lineWidth = 4;
      context.fillText("COINER", centerX, 50);
      context.strokeText("COINER", centerX, 50);
    }
  });

  highScoreText = Sprite({
    color: COLOR_1,
    render: function() {
      context.font = "bolder 2em Arial";
      context.fillStyle = this.color;
      context.fillText(`HIGH SCORE: ${highScore}`, centerX, 130);
    }
  });

  rules = Sprite({
    color: COLOR_1,
    render: function() {
      context.font = "2em Arial";
      context.fillText("RULES", centerX, 200);
      context.font = "1.5em Arial";
      context.fillText("Click to play", centerX, 250);
      context.fillText(
        "Collect and bring the coin to your chest",
        centerX,
        300
      );
    }
  });

  credits = Sprite({
    color: COLOR_1,
    render: function() {
      context.font = "2em Arial";
      context.fillText("CREDITS", centerX, 400);
      context.font = "1.5em Arial";
      context.fillText("Design and code: Phong Duong", centerX, 450);
    }
  });
};

const updateMenu = () => {
  logo.update();
  highScoreText.update();
  rules.update();
  credits.update();
};

const renderMenu = () => {
  logo.render();
  highScoreText.render();
  rules.render();
  credits.render();
};

const initLoadingVariables = () => {
  progressBar = Sprite({
    color: COLOR_1,
    render: function() {
      context.textAlign = "center";
      context.font = "2em Arial";
      context.fillStyle = this.color;
      context.fillText(`Loading`, centerX, 130);
    }
  });

  loadingText = Sprite({
    color: COLOR_3,
    border: COLOR_1,
    render: function() {
      let width: number = (assetsLoaded / numAssets) * 100 - 4;

      // draw border progress bar
      context.beginPath();
      context.rect(centerX - 50, 150, 100, 20);
      context.fillStyle = COLOR_4;
      context.lineWidth = "4";
      context.strokeStyle = this.border;
      context.fill();
      context.stroke();
      // draw progress
      context.beginPath();
      context.rect(centerX - 48, 150 + 2, width, 16);
      context.fillStyle = this.color;
      context.fill();
    }
  });
};
const updateLoaing = () => {
  progressBar.update();
  loadingText.update();
};

const renderLoaing = () => {
  progressBar.render();
  loadingText.render();
};
