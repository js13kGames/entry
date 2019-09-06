window.game = {
    /*
     * 0: waiting for new game start
     * 1: in game
     * 2: waiting for new round start
     * 3: game over
     */
    status: 0,

    round: 0,
    snake: null,
    historySnakes: [],
    roundScore: 0,
    gameScore: 0,
    heartScore: 3,
    maxHeartScore: 9,

    ctx: null,
    width: 800,
    height: 500,
    gridSize: 20,
    marginGrids: 0,

    roundFrames: 0,

    colorGrass: '#d1c4af',
    colorSnake: '#786f69',
    colorSnakeDead: '#b2a699',
    colorFood: '#504a4b'
};
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

    document.addEventListener('keydown', onKeydown);

    newGame();
    // renderHeart(game.ctx, getRandomPos());
}

function newGame() {
    game.gameScore = 0;
    game.status = 1;
    newRound();
}

function newRound() {
    ++game.round;
    game.roundScore = 0;
    game.roundFrames = 0;

    updateScore();

    var pos = getRandomPos(4);
    game.snake = new Snake(pos[0], pos[1], 3, 1 / 16, game);
    setFood();

    game.status = 1;

    tick();
}

function gameOver() {
    console.log('game over');
}

function tick() {
    if (game.status !== 1) {
        return;
    }

    game.snake.tick();

    if (game.snake.checkCollision()) {
        game.status = 2;
        console.log('collision');
        game.gameScore += game.roundScore;
        game.roundScore = 0;
        --game.heartScore;
        updateScore();

        if (game.heartScore === 0) {
            gameOver();
            return;
        }

        game.historySnakes.push(game.snake.getHistory());

        setTimeout(function () {
            newRound();
        }, 3000);

        return;
    }

    if (game.snake.checkScore(game.snake.food)) {
        game.roundScore = game.roundScore > 0 ? game.roundScore * 2 : 1;
        console.log('eat!', game.gameScore);
        updateScore();

        if (game.roundScore % 2 === 0) {
            game.snake.speedUp();
        }
        setFood();
    }
    else if (game.snake.checkScore(game.snake.heart)) {
        game.heartScore = Math.min(game.heartScore + 1, game.maxHeartScore);
        game.snake.heart = null;
        updateScore();
    }

    render();

    requestAnimationFrame(tick);
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
    ctx.globalAlpha = 1;
}

function onKeydown(event) {
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
    else if (event.keyCode === 88) { // s
        direction = 3;
    }
    if (direction !== null && Math.abs(direction - game.snake.direction) !== 2) {
        game.snake.direction = direction;
    }
}

function setFood() {
    game.snake.food = getRandomPos();

    if (game.roundScore > 1 && Math.random() > 0.05) {
        game.snake.heart = getRandomPos();
        console.log('heart', game.snake.heart)
    }
    else {
        game.snake.heart = null;
    }
}

function getRandomPos(margin) {
    margin = margin || 0;
    return [
        margin + Math.floor(Math.random() * (game.insideGridWidth - margin * 2)),
        margin + Math.floor(Math.random() * (game.insideGridHeight - margin * 2))
    ];
}
