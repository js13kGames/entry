import { initKeys, GameLoop } from 'kontra';
import { pollGamepads } from '../gamepad';
import { renderText } from '../text';
import { Menu } from '../menu';
import { createMeteor } from '../meteor';
import { Player } from '../player';
import { colors } from '../colors';
import { detectNewInput } from '../detectInput';

var game;
var mainMenu;
var scenes;

let mainMenuLoop = GameLoop({  // create the main game loop
    update() { // update the game state
        pollGamepads(game);

        game.sprites[0].rotation += game.sprites[0].dr;

        game.players.forEach(player => {

            if (player.keys.up()) {
                if (player.debounce.up > 0) {
                    player.debounce.up--;
                    return;
                }
                mainMenu.prev();
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
                player.debounce.down = 15;
            } else {
                player.debounce.down = 0;
            }

            if (player.keys.accept()) {
                if (player.debounce.accept > 0) {
                    player.debounce.accept--;
                    return;
                }

                mainMenuLoop.stop()
                if (mainMenu.items[mainMenu.focus].text === 'play') {
                    scenes.startShipSelect(game, scenes);
                }
                player.debounce.accept = 15;

            } else {
                player.debounce.accept = 0;
            }
        });

    },

    render() {
        game.sprites[0].render(game.scale * 2);
        mainMenu.render(game.scale);
        renderText({
            alignRight: true,
            text: '20461 Dioretsa',
            color: '#fff',
            size: 2,
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
        color: '#fff',
        items: [
            { text: 'play' },
            { text: 'settings' },
            { text: 'credits' }
        ]
    });

    // Big asteroid in the middle (dioretsa)
    createMeteor({
        x: game.width * .4,
        y: game.height * .8,
        radius: Math.min(game.width / 2, game.height / 2),
        mass: 100000,
        dx: 0,
        dy: 0,
        dr: .05,
        noCollision: true,
        game: game
    });

    mainMenuLoop.start(game, scenes);
}
