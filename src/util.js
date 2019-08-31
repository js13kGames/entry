function renderList(ctx, list, gridSize, marginGrids) {
    for (var i = 0; i < list.length; ++i) {
        var pos = list[i];
        ctx.fillRect((pos[0] + marginGrids) * gridSize,
            (pos[1] + marginGrids) * gridSize, gridSize, gridSize);
    }
}
