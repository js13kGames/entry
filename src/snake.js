/**
 * Snake
 *
 * length: length of body
 * body: positions of each grid
 * direction: 0: left, 1: top, 2: right, 3: bottom
 * food: positions of each food
 */
function Snake(x, y, length, speed) {
    this.body = [];
    for (var i = 0; i < length; ++i) {
        this.body.push([
            x > 20 ? x + i : x - length + 1 - i,
        y]);
    }

    this.direction = x > game.insideGridWidth / 2 ? 0 : 2;

    this._growNextTick = false;
    this._skippedFrames = 0;
    this._skipFramePeriod = 1 / speed;
    this.totalFrames = 0;

    this.history = {};
}

Snake.prototype.tick = function () {
    ++this.totalFrames;
    ++this._skippedFrames;
    if (this._skippedFrames < this._skipFramePeriod) {
        return false;
    }

    console.log('tick');
    var head = this.body[0];
    var newPos;
    if (this.direction === 1) {
        newPos = [head[0], head[1] - 1];
    }
    if (this.direction === 2) {
        newPos = [head[0] + 1, head[1]];
    }
    if (this.direction === 3) {
        newPos = [head[0], head[1] + 1];
    }
    if (this.direction === 0) {
        newPos = [head[0] - 1, head[1]];
    }

    this.body.splice(0, 0, newPos);

    if (!this._growNextTick) {
        this.body.splice(this.body.length - 1, 1);
    }
    this._growNextTick = false;

    this._recordHistory();

    this._skippedFrames = 0;
    return true;
};

Snake.prototype.render = function (ctx) {
    // render snake
    renderSnake(ctx, this.body, false);

    // render food
    ctx.fillStyle = game.colorFood;
    var size = 3;
    for (var i = 0; i < this.food.length; ++i) {
        var pos = [
            (this.food[i][0] + 0.5 + game.marginGrids) * game.gridSize,
            (this.food[i][1] + 0.5 + game.marginGrids) * game.gridSize
        ];

        ctx.fillRect(pos[0] - size, pos[1] - size * 3, size * 2, size * 2);
        ctx.fillRect(pos[0] - size, pos[1] + size, size * 2, size * 2);
        ctx.fillRect(pos[0] - size * 3, pos[1] - size, size * 2, size * 2);
        ctx.fillRect(pos[0] + size, pos[1] - size, size * 2, size * 2);

        // ctx.fillRect(pos[0], pos[1], game.gridSize, game.gridSize);
    }
};

Snake.prototype.checkEat = function () {
    var head = this.body[0];
    for (var i = 0; i < this.food.length; ++i) {
        var pos = this.food[i];
        var isEat = head[0] === pos[0] && head[1] == pos[1];
        if (isEat) {
            console.log(head, pos)
            this._growNextTick = true;
            return true;
        }
    }
    return false;
};

Snake.prototype.checkCollision = function () {
    var head = this.body[0];

    // wall collision
    if (head[0] < 0 || head[0] >= game.insideGridWidth || head[1] < 0 || head[1] >= game.insideGridHeight) {
        return true;
    }

    // self collision
    for (var i = 1; i < this.body.length; ++i) {
        if (this.body[i][0] === head[0] && this.body[i][1] === head[1]) {
            return true;
        }
    }

    // history snake collision
    for (var h = 0; h < game.historySnakes.length; ++h) {
        var history = game.historySnakes[h].items;
        var frame = history[this.totalFrames];
        if (frame) {
            for (var i = 0; i < frame.length; ++i) {
                if (frame[i][0] === head[0] && frame[i][1] === head[1]) {
                    return true;
                }
            }
        }
    }
    return false;
};

Snake.prototype.speedUp = function (speed) {
    this._skipFramePeriod /= 2;
};

Snake.prototype._recordHistory = function () {
    this.history[this.totalFrames] = this.body.slice();
};

Snake.prototype.getHistory = function () {
    return {
        keys: Object.keys(this.history).map(function (f) { return parseInt(f)}),
        items: this.history
    };
};
