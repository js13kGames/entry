import { renderText } from './text';

/**
 * Render an end-game type screen. This isn't _quite_ a scene, because
 * it's displayed over the top of the game scene.
 * @param  {[type]} game [description]
 * @return {[type]}      [description]
 */
export function render(game) {
    var pad = game.width / 16; // Padding around set of 4 cards
    var margin = 7; // Padding in game units between each card
    var contWidth = game.width - pad * 2; // Card container width
    var cardWidth = contWidth / 4 - margin * 2;
    var cardHeight = game.height - (pad + margin) * 2
    var y = pad + margin;

    game.players.forEach((player, i) => {
        var x = pad + (cardWidth + margin * 2) * i + margin;

        game.context.save();
        game.context.scale(game.scale, game.scale);
        game.context.clearRect(
            x,
            y,
            cardWidth,
            cardHeight,
        );
        game.context.strokeStyle = player.color;
        game.context.strokeRect(
            x,
            y,
            cardWidth,
            cardHeight
        )
        game.context.restore();

        if (player.place === 0) {
            renderText({
                text: 'winner!',
                color: player.color,
                x: x + margin,
                y: y + margin + 1,
                size: 1.3,
                scale: game.scale,
                context: game.context
            });
            game.context.save();
            game.context.scale(game.scale, game.scale);
            game.context.strokeStyle = player.color;
            game.context.strokeRect(
                x - 6,
                y - 6,
                cardWidth + 12,
                cardHeight + 12
            )
            game.context.strokeRect(
                x - 3,
                y - 3,
                cardWidth + 6,
                cardHeight + 6
            )
            game.context.restore();
        } else {
            renderText({
                text: player.place + 1,
                color: player.color,
                x: x + margin,
                y: y + margin + 1,
                size: 1.3,
                scale: game.scale,
                context: game.context
            });
            if (player.place === 1) {
                renderText({
                    text: 'nd',
                    color: player.color,
                    x: x + margin + 17,
                    y: y + margin + 12,
                    size: .5,
                    scale: game.scale,
                    context: game.context
                });
            } else if (player.place === 2) {
                renderText({
                    text: 'rd',
                    color: player.color,
                    x: x + margin + 17,
                    y: y + margin + 11, // 'rd' is a bit wonky
                    size: .5,
                    scale: game.scale,
                    context: game.context
                });
            } else if (player.place === 3) {
                renderText({
                    text: 'th',
                    color: player.color,
                    x: x + margin + 16, // 'th' is a bit wonky too
                    y: y + margin + 12,
                    size: .5,
                    scale: game.scale,
                    context: game.context
                });
            }
        }

        renderText({
            text: 'player ' + (i + 1),
            color: player.color,
            size: .8,
            x: x + margin,
            y: y + 50,
            scale: game.scale,
            context: game.context
        });

        renderText({
            text: 'score',
            color: player.color,
            size: .5,
            x: x + margin,
            y: y + 85,
            scale: game.scale,
            context: game.context
        });

        renderText({
            text: player.score,
            color: player.color,
            alignRight: true,
            x: x + cardWidth - margin,
            y: y + 80,
            scale: game.scale,
            context: game.context
        });

        renderText({
            text: 'deaths',
            color: player.color,
            size: .5,
            x: x + margin,
            y: y + 115,
            scale: game.scale,
            context: game.context
        });

        renderText({
            text: player.deaths,
            color: player.color,
            alignRight: true,
            x: x + cardWidth - margin,
            y: y + 110,
            scale: game.scale,
            context: game.context
        });

        renderText({
            text: 'accuracy' ,
            color: player.color,
            size: .5,
            x: x + margin,
            y: y + 145,
            scale: game.scale,
            context: game.context
        });

        renderText({
            text: ((player.shotsFired && player.shotsLanded) ? Math.round(100 / player.shotsFired * player.shotsLanded) : 0) + '%',
            color: player.color,
            alignRight: true,
            x: x + cardWidth - margin,
            y: y + 140,
            scale: game.scale,
            context: game.context
        });

        renderText({
            text: 'crashes' ,
            color: player.color,
            size: .5,
            x: x + margin,
            y: y + 175,
            scale: game.scale,
            context: game.context
        });

        renderText({
            text: player.crashes,
            color: player.color,
            alignRight: true,
            x: x + cardWidth - margin,
            y: y + 170,
            scale: game.scale,
            context: game.context
        });

        renderText({
            text: player.ready ? 'next>' : 'ready!',
            color: player.color,
            alignRight: true,
            alignBottom: true,
            x: x + cardWidth - margin,
            y: y + cardHeight - margin,
            scale: game.scale,
            context: game.context
        });

    });
}
