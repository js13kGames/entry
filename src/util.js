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

function renderTitle() {
    var titleSize = [68, 10];
    var scale = 0.5;
    var dx = (game.insideGridWidth - titleSize[0] * scale) / 2 / scale;
    var dy = (game.insideGridHeight - titleSize[1] * scale) / 2 / scale - 5;

    var list = [
        [4, 1], [3, 0], [2, 0], [1, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 6], [2, 6], [3, 6], [4, 7], [4, 8], [3, 9], [2, 9], [1, 9], [0, 8],

        [6, 9], [6, 8], [6, 7], [6, 6], [6, 5], [6, 4], [6, 3], [6, 2], [6, 1],
        [6, 0], [7, 1], [8, 2], [9, 3], [10, 0], [10,1], [10,2], [10,3], [10,4],
        [10,5], [10,6], [10,7], [10,8], [10,9],

        [12, 9], [12, 8], [12, 7], [12, 6], [12, 5], [12, 4], [12, 3], [12, 2],
        [12, 1], [13, 0], [14, 0], [15, 0], [16, 1], [16, 2], [16, 3], [16, 4],
        [16, 5], [16, 6], [16, 7], [16, 8], [16, 9], [13, 6], [14, 6], [15, 6],

        [18, 0], [18, 1], [18, 2], [18, 3], [18, 4],
        [18, 5], [18, 6],
        [18, 7], [18, 8], [18, 9], [19, 6], [22, 0], [22, 1], [21, 2], [21, 3],
        [20, 4], [20, 5], [19, 6], [20, 7], [21, 8], [22, 9],

        [25, 0], [26, 0], [27, 0], [28, 0], [24, 1], [24, 2], [24, 3], [24, 4],
        [24, 5], [24, 6], [24, 7], [24, 8], [24, 9], [25, 0], [26, 0], [27, 0],
        [28, 0], [25, 6], [26, 6], [27, 6], [28, 6], [25, 9], [26, 9], [27, 9],
        [28, 9],

        [34, 0], [34, 1], [34, 2], [34, 3], [34, 4],
        [34, 5], [34, 6],
        [34, 7], [34, 8], [34, 9], [36, 0], [37, 0], [38, 0], [39, 0], [40, 0],
        [38, 1], [38, 2], [38, 3], [38, 4], [38, 5], [38, 6],
        [38, 7], [38, 8],
        [38, 9],

        [45, 0], [45, 1], [45, 2], [45, 3], [45, 4],
        [45, 5], [45, 6],
        [45, 7], [45, 8], [45, 9], [46, 0], [47, 0], [48, 0], [49, 1], [49, 2],
        [49, 3], [49, 4], [49, 5], [48, 6], [47, 6], [46, 6], [49, 7], [49, 8],
        [48, 9], [47, 9], [46, 9],

        [51, 9], [51, 8], [51, 7], [51, 6], [51, 5], [51, 4], [51, 3], [51, 2],
        [51, 1], [52, 0], [53, 0], [54, 0], [55, 1], [55, 2], [55, 3], [55, 4],
        [55, 5], [55, 6], [55, 7], [55, 8], [55, 9], [52, 6], [53, 6], [54, 6],

        [61, 1], [60, 0], [59, 0], [58, 0], [57, 1], [57, 2], [57, 3], [57, 4],
        [57, 5], [57, 6], [57, 7], [57, 8], [58, 9], [59, 9], [60, 9], [61, 8],

        [63, 0], [63, 1], [63, 2], [63, 3], [63, 4],
        [63, 5], [63, 6],
        [63, 7], [63, 8], [63, 9], [67, 0], [67, 1], [66, 2], [66, 3], [65, 4],
        [65, 5], [64, 6], [65, 7], [66, 8], [67, 9]
    ].map(function (pos) {
        return [pos[0] + dx, pos[1] + dy];
    });

    var ctx = game.ctx;
    renderList(ctx, list, function (x, y) {
        x *= scale;
        y *= scale;
        var gridSize = game.gridSize * scale;

        ctx.fillStyle = game.colorSnake;
        ctx.fillRect(x, y, gridSize, gridSize);
        ctx.fillStyle = game.colorGrass;
        var d = 1;
        ctx.fillRect(x + d, y + d, gridSize - d * 2, gridSize - d * 2);
        ctx.fillStyle = game.colorSnake;
        ctx.fillRect(x + d * 2, y + d * 2, gridSize - d * 4, gridSize - d * 4);
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
