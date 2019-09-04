import { keyPressed } from 'kontra';
import { Ship } from './ship';
import { renderText } from './text';
import getKeys from './controls';

let gamepadIndex = 0;

export class Player {
    constructor(props) {
        this.color = props.color || '#fff';
        this.shipType = props.shipType || 'tri';
        this.controls = props.controls;
        this.game = props.game;
        this.ready = false;
        this.score = 0;
        this.context = props.context;

        // Set control scheme
        if (this.controls === 'gamepad') {
            this.keys = getKeys(this.controls, gamepadIndex++);
        } else if (this.controls) {
            this.keys = getKeys(this.controls);
        }
    }

    handleKeyPresses() {
        if (this.ship && this.ship.isAlive) {
            // Rewind is first here so it has priority over everything
            if (this.keys.rewind()) {
                this.ship.rewind();
            }

            if (this.keys.thrust()) {
                this.ship.engineOn();
            } else {
                this.ship.engineOff();
            }

            if (this.keys.left()) {
                this.ship.turnLeft();
            }

            if (this.keys.right()) {
                this.ship.turnRight();
            }

            if (this.keys.fire()) {
                this.ship.fire();
            }
        }
    }

    update() {
        if (this.keys && this.keys !== 'AI') {
            this.handleKeyPresses();
        }
    }

    scoreInc() {
        this.score++;
    }

    scoreDec() {
        // Can't go lower than 0
        if (this.score > 0) {
            this.score--;
        }
    }

    spawn() {
        // Create a whole new ship for the player

        this.ship = new Ship({
            x: 20 + Math.random() * (this.game.width - 40),
            y: 20 + Math.random() * (this.game.height - 40),
            width: 6,
            color: this.color,
            shipType: this.shipType,
            game: this.game,
            player: this,

            update() {
                this.shipUpdate(); // Calls this.advance() itself
            }
        });

        this.game.sprites.push(this.ship);

        this.ship.invuln = 3; // Invulnerability for 3 seconds while respawning
    }

    respawn() {
        // Reset anything ???

        // Spawn an entirely new ship for the player ???
        this.spawn();
        this.ship.invuln = 3; // Invulnerability for 3 seconds while respawning
    }

    renderScore(i) {
        var textProps = {
            color: this.color,
            context: this.context,
            text: this.score,
            scale: this.game.scale
        };

        // Render the scores
        if (i === 0) {
            textProps.x = this.game.width / 2 - 20;
            textProps.y = this.game.height / 2 - 20;
        } else if (i === 1) {
            textProps.x = this.game.width / 2 + 10;
            textProps.y = this.game.height / 2 - 20;
        } else if (i === 2) {
            textProps.x = this.game.width / 2 - 20;
            textProps.y = this.game.height / 2 + 10;
        } else if (i === 3) {
            textProps.x = this.game.width / 2 + 10;
            textProps.y = this.game.height / 2 + 10;
        }

        renderText(textProps);
    }
}
