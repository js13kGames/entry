import Actor from './actor.js';
import {getRand, toRadians} from './../utils.js';

let Boss = function(g, ps) {
    this.ps = ps;
    this.sprite = g.rectangle(64, 64, 'red');
    this.sprite.alpha = 0.5;
    Actor.call(this, g, 20, 400, 10);
    this.sprite.visible = false;
    this.img = g.text('🐉', '64px Times');
    this.img.visible = false;
    this.hSprite.visible = false;
    this.img.layer = 5;
    this.dmg = 2;
    this.speed = 3;
    this.box = g.rectangle(128,128,'red');;
    this.box.visible = false;
    this.g.wait(this.invinceTime * 2, () => this.warp());
};

Boss.prototype = Object.create(Actor.prototype);

Boss.prototype.takeDamage = function(amount, direction) {
    if (this.invinc) {
        return;
    }
    this.hp -= amount;
    if (this.hp <= 0) {
        this.dead = true;
        this.hSprite.visible = false;
        return;
    }
    this.invinc = true;
    this.hSprite.content = Array(this.hp).fill('💗').join('');
    this.speed = 0;
    this.img.alpha = 0.5;
    this.g.wait(this.invinceTime, () => this.delayWarp());
};

Boss.prototype.delayWarp = function() {
    this.img.visible = false;
    this.hSprite.visible = false;
    this.g.wait(this.invinceTime, () => this.warp());
};

Boss.prototype.warp = function() {
    let angle;
    let x = this.ps.x;
    let y = this.ps.y;
    let d = this.g.canvas.width / 2;
    let point;
    do {
        angle = getRand(360)
        point = this.g.rotateAroundPoint(x, y, d, d, toRadians(angle));
        this.box.x = point.x;
        this.box.y = point.y;
    } while (this.g.hitTestRectangle(this.box, this.ps));
    this.sprite.x = point.x + 32;
    this.sprite.y = point.y + 32;
    this.invinc = false;
    this.speed = 3;
    this.img.alpha = 1;
    this.show();
};

export default Boss;