const {
  Sprite,
  GameLoop,
  initPointer,
  onPointerDown,
  setStoreItem,
  getStoreItem,
  load,
  init
} = kontra;

const { canvas, context } = init();
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const COLOR_1: string = "#010A43";
const COLOR_2: string = "#FF3F98";
const COLOR_3: string = "#EDA593";
const COLOR_4: string = "#F3D3D3";
const frequency = 0.5;
let timer = 1 / frequency;
let hiScore = getStoreItem("luon_hi_score") ? getStoreItem("luon_hi_score") : 0;
let luon, topBar, bottomBar, bars, score, scoreText, title, rules, credits;
let state = "menu";
const gameState = {
  game: {
    init: () => {
      const createBar = (y: number): void =>
        Sprite({
          x: 0,
          y: y,
          width: width,
          height: 64,
          color: COLOR_1,
          type: "bar"
        });

      luon = Sprite({
        width: 26,
        height: 26,
        anchor: { x: 0.5, y: 0.5 },
        x: 80,
        y: centerY,
        dy: 2.5,
        color: COLOR_3,
        border: COLOR_2,
        face: COLOR_1,
        type: "luon",
        render: function() {
          this.draw();
          // Draw outer
          context.beginPath();
          context.fillStyle = this.color;
          context.strokeStyle = this.border;
          context.lineWidth = 4;
          context.arc(this.x, this.y, 14, 0, 2 * Math.PI);
          context.fill();
          context.stroke();
          // Draw inner
          context.beginPath();
          context.strokeStyle = this.face;
          context.lineWidth = 2;
          context.arc(this.x, this.y - 4, 4, 0, 2 * Math.PI);
          context.stroke();
          context.moveTo(this.x, this.y - 1);
          context.lineTo(this.x, this.y + 10);
          context.stroke();
        }
      });
      topBar = createBar(0);
      bottomBar = createBar(height - 64);
      scoreText = Sprite({
        color: COLOR_3,
        render: function() {
          context.fillStyle = this.color;
          context.font = "bold 40px Arial";
          context.textAlign = "center";
          context.fillText(`${score}`, centerX, 50);
        }
      });
      bars = [];
      score = 0;
    },
    update: dt => {
      timer -= dt;

      if (timer < 0) {
        timer = 1 / frequency;
        bars = bars.concat(generateBar());
      }

      luon.update();
      topBar.update();
      bottomBar.update();
      scoreText.update();

      for (let bar of bars) {
        bar.update();

        if (bar.x + 64 === luon.x) {
          if (!bar.type.includes("double")) score++;
        }

        if (bar.collidesWith(bottomBar) || bar.collidesWith(topBar))
          bar.dy = -bar.dy;

        if (bar.collidesWith(luon)) {
          if (score > hiScore) {
            hiScore = score;
            setStoreItem("luon_hi_score", hiScore);
          }

          state = "menu";
          gameOver.play();
        }
      }

      if (luon.collidesWith(bottomBar) || luon.collidesWith(topBar)) {
        if (score > hiScore) {
          hiScore = score;
          setStoreItem("luon_hi_score", hiScore);
        }

        state = "menu";
        gameOver.play();
      }
    },
    render: () => {
      luon.render();
      topBar.render();
      bottomBar.render();
      scoreText.render();

      for (let bar of bars) {
        bar.render();
      }
    },
    click: () => {
      luon.dy = -luon.dy;
    }
  },
  menu: {
    init: () => {
      title = Sprite({
        color: COLOR_2,
        border: COLOR_1,
        render: function() {
          // Draw title
          context.fillStyle = this.color;
          context.textAlign = "center";
          context.font = "bold 55px Arial";
          context.strokeStyle = this.border;
          context.lineWidth = 3;
          context.fillText("LUON", centerX, 50);
          context.strokeText("LUON", centerX, 50);

          context.fillStyle = this.border;

          // Draw high score
          context.font = "bold 40px Arial";
          context.fillText(`High score: ${hiScore}`, centerX, 110);

          // Draw rules
          context.font = "28px Arial";
          context.fillText("RULES", centerX, 180);
          context.font = "24px Arial";
          context.fillText("Click to play", centerX, 220);
          context.fillText("Avoid dark blocks", centerX, 260);

          // Draw credits
          context.font = "28px Arial";
          context.fillText("CREDITS", centerX, 320);
          context.font = "24px Arial";
          context.fillText("Design & code: Phong Duong", centerX, 360);
        }
      });
    },
    update: () => {
      title.update();
    },
    render: () => {
      title.render();
    },
    click: () => {
      state = "game";

      gameState[state].init();
    }
  }
};

const generateBar = () => {
  const type = Math.floor(Math.random() * 3 + 1);
  const x = 500;
  const sprites = [];

  switch (type) {
    case 1:
      const position = Math.floor(Math.random() * 4 + 1);

      sprites.push(
        Sprite({
          x: x,
          y: 64 * position,
          width: 64,
          height: 64,
          anchor: {
            x: 0.5,
            y: 0
          },
          dy: 3,
          dx: -2,
          color: COLOR_1,
          type: "bar"
        })
      );
      break;

    case 2:
      const y1 = Math.floor(Math.random() * 2 + 1) === 1 ? 64 : 96;
      const y2 = y1 + 160;

      sprites.push(
        Sprite({
          x: x,
          y: y1,
          width: 64,
          height: 64,
          anchor: {
            x: 0.5,
            y: 0
          },
          dx: -2,
          color: COLOR_1,
          type: ["bar", "double"]
        })
      );

      sprites.push(
        Sprite({
          x: x,
          y: y2,
          width: 64,
          height: 64,
          anchor: {
            x: 0.5,
            y: 0
          },
          dx: -2,
          color: COLOR_1,
          type: "bar"
        })
      );

      break;

    default:
      const y = Math.floor(Math.random() * 2 + 1) === 1 ? 64 : 160;

      sprites.push(
        Sprite({
          x: x,
          y: y,
          width: 64,
          height: 160,
          anchor: {
            x: 0.5,
            y: 0
          },
          dx: -2,
          color: COLOR_1,
          type: "bar"
        })
      );

      break;
  }

  return sprites;
};

const loop = GameLoop({
  update: function(dt) {
    const updateGame = gameState[state].update;

    updateGame(dt);
  },
  render: function() {
    const renderGame = gameState[state].render;

    renderGame();
  }
});

const ac = new AudioContext();
const tempo = 120;
const click = new TinyMusic.Sequence(ac, tempo, ["D4 es"]);
click.loop = false;
click.gain.gain.value = 0.5;
const gameOver = new TinyMusic.Sequence(ac, tempo, ["C3 es", "F0 es"]);
gameOver.loop = false;

gameState["menu"].init();
initPointer();
loop.start();

onPointerDown(() => {
  click.play();
  gameState[state].click();
});
