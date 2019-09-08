import Actor from './actor.js';
import {getRand, toRadians} from './../utils.js';

let Boss = function(g, playerSprite) {
    this.playerSprite = playerSprite;
    this.sprite = g.rectangle(64, 64, 'red');
    Actor.call(this, g, 20, 400, 10);
    this.sprite.visible = false;
    this.healthSprite.visible = false;
    this.damage = 1.3;
    this.speed = 3;
    this.boundaryBox = g.rectangle(128,128,'red');;
    this.boundaryBox.visible = false;
    this.g.wait(this.invinceTime * 2, () => this.warp());
};

Boss.prototype = Object.create(Actor.prototype);

Boss.prototype.takeDamage = function(amount, direction) {
    if (this.invincible) {
        return;
    }
    this.health -= amount;
    if (this.health <= 0) {
        this.dead = true;
        this.healthSprite.width = 0;
        return;
    }
    this.invincible = true;
    this.healthSprite.width -= this.healthWidth * amount;
    this.speed = 0;
    this.sprite.alpha = 0.5;
    this.g.wait(this.invinceTime, () => this.delayWarp());
};

Boss.prototype.delayWarp = function() {
    this.sprite.visible = false;
    this.healthSprite.visible = false;
    this.g.wait(this.invinceTime, () => this.warp());
};

Boss.prototype.warp = function() {
    let angle;
    let x = this.playerSprite.x;
    let y = this.playerSprite.y;
    let distance = this.g.canvas.width / 2;
    let point;
    do {
        angle = getRand(360)
        point = this.g.rotateAroundPoint(x, y, distance, distance, toRadians(angle));
        this.boundaryBox.x = point.x;
        this.boundaryBox.y = point.y;
    } while (this.g.hitTestRectangle(this.boundaryBox, this.playerSprite));
    this.sprite.x = point.x + 32;
    this.sprite.y = point.y + 32;
    this.invincible = false;
    this.speed = 3;
    this.sprite.alpha = 1;
    this.show();
};

export default Boss;