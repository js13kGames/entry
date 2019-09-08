import { initKeys, GameLoop } from 'kontra';
import { pollGamepads } from '../gamepad';
import { Menu } from '../menu';
import { Player } from '../player';
import { colors } from '../colors';

var game;
var mainMenu;
var scenes;

let mainMenuLoop = GameLoop({  // create the main game loop
    update() { // update the game state
        pollGamepads();

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
                player.debounce.down--;
                if (player.debounce.down <= 0) {
                    mainMenu.next();
                    player.debounce.down = 15;
                }
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
                    game.players.forEach(player => {
                        player.pseudoSpawn();
                    });
                    scenes.startShipSelect(game, scenes);
                }
                player.debounce.accept = 15;

            } else {
                player.debounce.accept = 0;
            }
        });

    },

    render() {
        mainMenu.render(game.scale);
    }
});


export function startMainMenu(newGame, otherScenes) {

    game = newGame;
    scenes = otherScenes;

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

    if (!game.players.length) {

        game.players.push(new Player({
            color: colors.yellow,
            shipType: 'tri',
            controls: 'arrows',
            context: game.context,
            game: game
        }));

        game.players.push(new Player({
            color: colors.red,
            shipType: 'coback',
            controls: 'wasd',
            context: game.context,
            game: game
        }));
    }

    mainMenuLoop.start(game, scenes);
}
