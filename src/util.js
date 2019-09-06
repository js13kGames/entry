function renderList(ctx, list, fillRect) {
    for (var i = 0; i < list.length; ++i) {
        var pos = idToCanvasPosition(list[i]);
        if (typeof fillRect === 'function') {
            fillRect(pos[0], pos[1], game.gridSize);
        }
        else {
            ctx.fillRect(pos[0], pos[1], game.gridSize, game.gridSize);
        }
    }
}

function renderSnake(ctx, list, isDead) {
    var snakeColor = isDead ? game.colorSnakeDead : game.colorSnake;
    renderList(ctx, list, function (x, y) {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(x, y, game.gridSize, game.gridSize);
        ctx.fillStyle = game.colorGrass;
        var d = 2;
        ctx.fillRect(x + d, y + d, game.gridSize - d * 2, game.gridSize - d * 2);
        ctx.fillStyle = snakeColor;
        ctx.fillRect(x + d * 2, y + d * 2, game.gridSize - d * 4, game.gridSize - d * 4);
    });
}

function renderGraphic(ctx, list, pos, scale, dx, dy) {
    pos = idToCanvasPosition(pos);
    var size = game.gridSize * scale;
    for (var i = 0; i < list.length; ++i) {
        ctx.fillRect(
            pos[0] + list[i][0] * size + dx * scale,
            pos[1] + list[i][1] * size + dy * scale,
            size,
            size
        );
    }
}

function renderHeart(ctx, pos) {
    ctx.fillStyle = game.colorFood;
    var list = [
        [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
        [1, 1], [5, 1], [7, 1], [11, 1],
        [0, 2], [3, 2], [6, 2], [9, 2], [12, 2],
        [0, 3], [2, 3], [3, 3], [4, 3], [8, 3], [9, 3], [10, 3], [12, 3],
        [0, 4], [3, 4], [4, 4], [5, 4], [7, 4], [8, 4], [9, 4], [12, 4],
        [1, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [11, 5],
        [2, 6], [5, 6], [6, 6], [7, 6], [10, 6],
        [3, 7], [6, 7], [9, 7],
        [4, 8], [8, 8],
        [5, 9], [7, 9],
        [6, 10]
    ];
    renderGraphic(ctx, list, pos, 1 / 12, 0, 1 / 12);
}

function renderCircle(ctx, pos) {
    ctx.beginPath();
    var pos = idToCanvasPosition(pos);
    var halfGrid = game.gridSize / 2;
    ctx.arc(pos[0] + halfGrid, pos[1] + halfGrid, halfGrid, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function idToCanvasPosition(pos) {
    return [
        (pos[0] + game.marginGrids) * game.gridSize,
        (pos[1] + game.marginGrids) * game.gridSize
    ];
}
