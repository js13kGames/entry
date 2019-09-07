import Actor from './actor.js';
import Sword from './../objects/sword.js';

let Player = function(g) {
    this.sprite = g.rectangle(32, 32, 'blue');
    this.sprite.visible = false;
    this.actionKey = g.keyboard(70);
    this.cancelKey = g.keyboard(68);
    g.fourKeyController(this.sprite, 5, 38, 39, 40, 37);
    this.sword = new Sword(g);
    Actor.call(this, g, 5, 1000, 30);
};

Player.prototype = Object.create(Actor.prototype);

export default Player;

