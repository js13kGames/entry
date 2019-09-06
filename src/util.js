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
