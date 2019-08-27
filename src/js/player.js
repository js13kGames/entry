import { keyPressed } from 'kontra';
import { Ship } from './ship.js';
import { renderText } from './text';
import getKeys from './controls';

export class Player {
    constructor(props) {
        this.color = props.color || '#fff';
        this.shipType = props.shipType || 'tri';
        this.controls = props.controls;
        this.sprites = props.sprites; // Ref to all the sprites in the game
        this.cs = props.cs; // Ref to the game's collision system
        this.ready = false;
        this.score = 0;
        this.context = props.context;

        // Set control scheme
        if (this.controls) {
            this.keys = getKeys(this.controls);
        }
    }

    handleKeyPresses(sprites) {
        if (this.ship && this.ship.isAlive) {
            // Rewind is first here so it has priority over everything
            if (keyPressed(this.keys.rewind)) {
                this.ship.rewind();
            }

            if (keyPressed(this.keys.thrust)) {
                this.ship.engineOn();
            } else {
                this.ship.engineOff();
            }

            if (keyPressed(this.keys.left)) {
                this.ship.turnLeft();
            }

            if (keyPressed(this.keys.right)) {
                this.ship.turnRight();
            }

            if (keyPressed(this.keys.fire)) {
                this.ship.fire(sprites);
            }
        }
    }

    update(sprites) {
        if (this.keys && this.keys !== 'AI') {
            this.handleKeyPresses(sprites);
        }
    }

    scoreInc() {
        this.score++;
        console.log((this.shipType + ':').padEnd(9) + this.score);
    }

    scoreDec() {
        // Can't go lower than 0
        if (this.score > 0) {
            this.score--;
        }
        console.log((this.shipType + ':').padEnd(9) + this.score);
    }

    spawn(ships, sprites) {
        // Create a whole new ship for the player

        this.ship = new Ship({
            x: 20 + Math.random() * 400,
            y: 20 + Math.random() * 200,
            width: 6,
            color: this.color,
            shipType: this.shipType,
            collisionSystem: this.cs,
            player: this,

            update() {
                this.shipUpdate(); // Calls this.advance() itself
            }
        });

        ships.push(this.ship);
        sprites.push(this.ship);
    }

    respawn(ships, sprites) {
        // Reset anything ???

        // Spawn an entirely new ship for the player ???
        this.spawn(ships, sprites);
        this.ship.invuln = 3; // Invulnerability for 3 seconds while respawning
    }

    renderScore(i) {
        var textProps = {
            color: this.color,
            context: this.context,
            text: this.score,
        };

        // Render the scores
        if (i === 0) {
            textProps.x = 10;
            textProps.y = 10;
        } else if (i === 1) {
            textProps.x = this.context.canvas.width - 20;
            textProps.y = 10;
        } else if (i === 2) {
            textProps.x = 10;
            textProps.y = this.context.canvas.height - 20;
        } else if (i === 3) {
            textProps.x = this.context.canvas.width - 20;
            textProps.y = this.context.canvas.height - 20;
        }

        renderText(textProps);
    }
}
