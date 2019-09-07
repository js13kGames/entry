import Actor from './actor.js';

let Enemy = function(g, lvl) {
    this.sprite = g.rectangle(32, 32, 'red');
    Actor.call(this, g, lvl, 500, 10);
    this.damage = 1;
    this.speed = 1;
    this.show();
};

Enemy.prototype = Object.create(Actor.prototype);

export default Enemy;
