import { initKeys, GameLoop } from 'kontra';
import { setSizing } from '../setSizing';
import { pollGamepads } from '../gamepad';
import { renderText } from '../text';
import { Menu } from '../menu';
import { createMeteor } from '../meteor';
import { Player } from '../player';
import { colors } from '../colors';
import { detectNewInput } from '../detectInput';
import zzfx from '../zzfx';

var game;
var mainMenu;
var scenes;
var noSpace;

let mainMenuLoop = GameLoop({  // create the main game loop
    update() { // update the game state
        pollGamepads(game);

        game.sprites[0].rotation += game.sprites[0].dr;

        game.players.forEach((player, i) => {

            if (player.controls === 'ai') {
                return;
            }

            // If esc or x pressed on keyboard, remove keyboard player
            // this doesn't work for gamepads as you could get 'em back!
            if (player.keys.back() && player.controls !== 'gamepad') {
                player.debounce.back--;
                if (player.debounce.back <= 0) {
                    if (player.controls !== 'gamepad') {
                        game.unusedControls += '(' + player.controls + ')'
                    }
                    game.players.splice(i, 1);
                    return;
                }
            } else {
                player.debounce.back = 0;
            }

            if (player.keys.up()) {
                if (player.debounce.up > 0) {
                    player.debounce.up--;
                    return;
                }
                mainMenu.prev();
                zzfx(.2,0,1000,.2,.03,.1,.1,0,.86); // ZzFX 42665
                player.debounce.up = 15;
            } else {
                player.debounce.up = 0;
            }

            if (player.keys.down()) {
                if (player.debounce.down > 0) {
                    player.debounce.down--;
                    return;
                }
                mainMenu.next();
                zzfx(.2,0,1000,.2,.03,.1,.1,0,.86); // ZzFX 42665
                player.debounce.down = 15;
            } else {
                player.debounce.down = 0;
            }

            if (player.keys.accept()) {
                if (player.debounce.accept > 0) {
                    player.debounce.accept--;
                    return;
                }
                zzfx(.2,0,1000,.2,.03,.1,.1,0,.86); // ZzFX 42665
                if (mainMenu.items[mainMenu.focus].text[0] === 'p') {
                    mainMenuLoop.stop()
                    scenes.startShipSelect(game, scenes);
                } else if (mainMenu.items[mainMenu.focus].text[0] === 's') {
                    game.size += .25;
                    if (game.size === 1.5) {
                        game.size = .75;
                    }
                    setSizing(game);
                    mainMenu.items[mainMenu.focus].text = 'scale ' + game.size * 100 + '%';
                    game.sprites.splice(0, 1);
                    // Big asteroid in the middle (dioretsa)
                    createMeteor({
                        x: game.width * .4,
                        y: game.height * .8,
                        radius: Math.min(game.width / 2, game.height / 2),
                        dx: 0,
                        dy: 0,
                        dr: .05,
                        noCollision: true,
                        game: game
                    });
                } else {
                    mainMenu.items[mainMenu.focus].text = 'credits - no room!'
                }
                player.debounce.accept = 15;

            } else {
                player.debounce.accept = 0;
            }
        });

    },

    render() {
        game.sprites[0].render(game.scale * 2);

        if (game.players.length) {
            mainMenu.render(game.scale);
            game.players.forEach((player, i) => {
                renderText({
                    alignBottom: true,
                    text: 'P' + (i + 1) + ' ' + player.controls,
                    color: player.color,
                    size: .8,
                    x: 30,
                    y: game.height - 30 - ((game.players.length - 1) * 20) + i * 20,
                    scale: game.scale,
                    context: game.context
                });
            });
        } else {
            renderText({
                alignRight: true,
                alignBottom: true,
                text: 'Press arrow keys,',
                size: .8,
                x: game.width - 30,
                y: game.height - 50,
                scale: game.scale,
                context: game.context
            });
            renderText({
                alignRight: true,
                alignBottom: true,
                text: 'gamepad, or wasd/qzsd',
                size: .8,
                x: game.width - 30,
                y: game.height - 30,
                scale: game.scale,
                context: game.context
            });
        }

        renderText({
            alignRight: true,
            text: '20461 Dioretsa',
            size: 2 * game.size,
            x: game.width - 30,
            y: 30,
            scale: game.scale,
            context: game.context
        });
    }
});

export function startMainMenu(newGame, otherScenes) {

    game = newGame;
    scenes = otherScenes;

    detectNewInput();

    game.meteors = [];
    game.pickups = [];
    game.sprites = [];

    mainMenu = new Menu({
        context: game.context,
        x: 30,
        y: 30,
        items: [
            { text: 'play' },
            // All the code calls this size uhhh
            { text: 'scale ' + game.size * 100 + '%' },
            { text: 'credits' }
        ]
    });

    // Big asteroid in the middle (dioretsa)
    createMeteor({
        x: game.width * .4,
        y: game.height * .8,
        radius: Math.min(game.width / 2, game.height / 2),
        dx: 0,
        dy: 0,
        dr: .05,
        noCollision: true,
        game: game
    });

    mainMenuLoop.start(game, scenes);
}
