function renderList(ctx, list, gridSize) {
    for (var i = 0; i < list.length; ++i) {
        var pos = list[i];
        ctx.fillRect(pos[0] * gridSize, pos[1] * gridSize, gridSize, gridSize);
    }
}
