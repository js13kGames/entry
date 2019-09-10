
export function update(player) {
    if (!player.ship || !player.ship.isAlive || player.game.over) {
        return;
    }

    player.ship.engineOn();
}
