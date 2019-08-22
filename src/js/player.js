import { keyPressed } from 'kontra';
import { Ship } from './ship.js';
import getKeys from './controls';

export class Player {

    constructor(props) {
        this.color = props.color || '#fff';
        this.shipType = props.shipType || 'tri';
        this.controls = props.controls;
        this.ready = false;
        this.sprites = props.sprites; // Ref to all the sprites in the game
        this.cs = props.cs; // Ref to the game's collision system

        // Set control scheme
        if (this.controls) {
            this.keys = getKeys(this.controls);
        }
    }

    handleKeyPresses() {
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
                this.ship.fire(this.sprites);
            }
        }
    }

    update() {
        //console.log("updating player");
        if (this.keys && this.keys !== 'AI') {
            this.handleKeyPresses();
        }
    }

    spawn(ships, sprites) {
        // Create a whole new ship for the player

        this.ship = new Ship({
            x: 60,
            y: 60,
            width: 6,
            color: this.color,
            shipType: this.shipType,
            collisionSystem: this.cs,

            update() {
                this.shipUpdate(); // Calls this.advance() itself
            }
        });

        ships.push(this.ship);
        sprites.push(this.ship);
    }

    respawn() {
        // Reset anything ???

        // Spawn an entirely new ship for the player ???
        this.spawn();
    }
}
