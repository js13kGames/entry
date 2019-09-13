var initialState = {
    round: 0,
    snake: null,
    historySnakes: [],
    roundScore: 0,
    gameScore: 0,
    heartScore: 5,
    maxHeartScore: 9,
}

window.game = Object.assign({
    demo: true,
    demoReady: false,

    /*
     * 0: waiting for new game start
     * 1: in game
     * 2: waiting for new round start
     * 3: game over
     */
    status: 0,

    ctx: null,
    width: 600,
    height: 420,
    gridSize: 15,
    marginGrids: 0,

    roundFrames: 0,

    colorGrass: '#d1c4af',
    colorSnake: '#786f69',
    colorSnakeDead: '#b2a699',
    colorFood: '#504a4b',

    mainEl: document.getElementById('main'),
    startEl: document.getElementById('start'),
    scoreEl: document.getElementById('score-panel')
}, initialState);

game.gridWidth = game.width / game.gridSize;
game.gridHeight = game.height / game.gridSize;
game.insideWidth = game.width - game.marginGrids * game.gridSize * 2;
game.insideHeight = game.height - game.marginGrids * game.gridSize * 2;
game.insideGridWidth = game.insideWidth / game.gridSize;
game.insideGridHeight = game.insideHeight / game.gridSize;

init();

function init() {
    var canvas = document.getElementById('main');
    canvas.width = game.width;
    canvas.height = game.height;
    game.ctx = canvas.getContext('2d');
    game.ctx.fillStyle = game.colorGrass;
    game.ctx.fillRect(game.marginGrids * game.gridSize, game.marginGrids * game.gridSize,
        game.insideWidth, game.insideHeight);

    document.addEventListener('keydown', onKeydown);
    game.startEl.addEventListener('click', start);

    // tickBeforeStart();
    // countDown();
    // setTimeout(function () {
    //     newGame();
    // }, 3000);
    newGame();
}

function newGame() {
    resetGameState();
    game.status = 1;
    newRound();
}

function resetGameState() {
    Object.assign(game, initialState);
    game.historySnakes = [];
}

function newRound() {
    ++game.round;
    game.roundScore = 0;
    game.roundFrames = 0;

    updateScore();

    var pos = getRandomPos(5);
    var speed = game.demo ? 0.3 : 0.1;
    game.snake = new Snake(pos[0], pos[1], 3, speed, game);
    setFood(true);

    game.status = 1;

    tick();
}

function newDemoHistorySnake() {
    var pos = getRandomPos(4);
    var snake = new Snake(pos[0], pos[1], 3, 0.1, game);
    snake.food = getRandomPos();
    return snake;
}

function gameOver() {
    setTimeout(function () {
        game.scoreEl.style.visibility = 'hidden';
        game.startEl.style.display = 'block';
        game.demo = true;
        var historySnakes = game.historySnakes;
        newGame();
        game.historySnakes = historySnakes;
    }, 1500);
}

function tick() {
    if (game.status !== 1) {
        return;
    }

    if (game.snake.heartTimeout !== null) {
        --game.snake.heartTimeout;
        if (game.snake.heartTimeout === 0) {
            game.snake.heart = null;
            game.snake.heartTimeout = null;
        }
    }

    game.snake.tick();

    if (game.snake.checkCollision()) {
        game.status = 2;
        game.gameScore += game.roundScore;
        game.roundScore = 0;
        --game.heartScore;
        updateScore();

        if (!game.demo) {
            if (game.heartScore === 0) {
                gameOver();
                return;
            }
            else {
                countDown();
            }
        }
        else {
            if (game.heartScore <= 0) {
                game.demoReady = true;
                game.startEl.style.display = 'block';
                var historySnakes = game.historySnakes;
                newGame();
                game.heartScore = 0;
                game.historySnakes = historySnakes;
                return;
            }
        }

        game.historySnakes.push(game.snake.getHistory());

        if (game.demo) {
            newRound();
        }
        else {
            setTimeout(function () {
                newRound();
            }, 3000);
        }

        return;
    }

    if (game.snake.checkScore(game.snake.food)) {
        game.roundScore = game.roundScore > 0 ? game.roundScore * 2 : 1;
        updateScore();

        game.snake.speedUp();
        setFood(false);
    }
    else if (game.snake.checkScore(game.snake.heart)) {
        game.heartScore = Math.min(game.heartScore + 1, game.maxHeartScore);
        game.snake.heart = null;
        updateScore();
    }

    if (!game.demo || game.demoReady) {
        render();
        requestAnimationFrame(tick);
    }
    else {
        tick();
    }
}

function render() {
    var ctx = game.ctx;
    ctx.clearRect(0, 0, game.width, game.height);

    ctx.fillStyle = game.colorGrass;
    ctx.fillRect(
        game.marginGrids * game.gridSize,
        game.marginGrids * game.gridSize,
        game.insideWidth,
        game.insideHeight
    );

    renderHistorySnakes();
    game.snake.render(ctx);

    if (game.demo) {
        renderTitle();
    }
}

function renderHistorySnakes() {
    var ctx = game.ctx;

    var frame = game.snake.totalFrames;
    for (var h = 0; h < game.historySnakes.length; ++h) {
        var history = game.historySnakes[h];
        var keys = history.keys;
        var lastFrame;
        for (var i = 1; i < keys.length; ++i) {
            if (keys[i] > frame) {
                lastFrame = history.items[keys[i - 1]];
                break;
            }
        }
        if (lastFrame) {
            renderSnake(game.ctx, lastFrame, true);
        }
    }
}

function onKeydown(event) {
    if (game.demo) {
        if (event.keyCode === 32 || event.keyCode === 13) { // space or reture
            start();
        }
        return;
    }
    var direction;
    if (event.keyCode > 36 && event.keyCode < 41) {
        // left, top, right, bottom
        direction = event.keyCode - 37;
    }
    else if (event.keyCode === 65) { // a
        direction = 0;
    }
    else if (event.keyCode === 87) { // w
        direction = 1;
    }
    else if (event.keyCode === 68) { // d
        direction = 2;
    }
    else if (event.keyCode === 83) { // s
        direction = 3;
    }
    if (direction != null && Math.abs(direction - game.snake.direction) !== 2) {
        game.snake.direction = direction;
    }
}

function start() {
    game.demo = false;
    game.scoreEl.style.visibility = 'visible';
    game.startEl.style.display = 'none';
    newGame();
}

function setFood(clearHeart) {
    game.snake.food = getRandomPos();

    if (game.roundScore >= 8 && Math.random() > 0.8
        && (clearHeart || !game.snake.heart)
    ) {
        game.snake.heart = getRandomPos();
        game.snake.heartTimeout = 60 * (game.roundScore > 16 ? 8 : 20);
    }
    else if (clearHeart) {
        game.snake.heart = null;
        game.snake.heartTimeout = null;
    }
}

function getRandomPos(margin) {
    margin = margin || 0;
    return [
        margin + Math.floor(Math.random() * (game.insideGridWidth - margin * 2)),
        margin + Math.floor(Math.random() * (game.insideGridHeight - margin * 2))
    ];
}
