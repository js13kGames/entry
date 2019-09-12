let Actor = function(g, hp, invinceTime, height) {
    this.g = g;
    this.hp = hp;
    this.invinc = false;
    this.invinceTime = invinceTime || 1000;
    this.dead = false;
    this.height = height;
    this.hSprite = g.text(Array(hp).fill('💗').join(''), `${height}px times`);
    this.hSprite.visible = false;
    this.hSprite.alpha = 1;
    // this.img = g.text('nothing');
};

Actor.prototype.show = function() {
    this.img.visible = true;
    this.hSprite.visible = true;
};

Actor.prototype.hide = function() {
    this.img.visible = false;
    this.hSprite.visible = false;
};

Actor.prototype.stopMoving = function() {
    this.sprite.vx = 0;
    this.sprite.vy = 0;
};

Actor.prototype.heal = function(amt) {
    this.hp += amt;
    this.hSprite.content = Array(this.hp).fill('💗').join('');
};

Actor.prototype.takeDamage = function(amount, dir) {
    if (this.invinc) {
        return;
    }
    this.hp -= amount;
    if (this.hp <= 0) {
        this.dead = true;
        this.hSprite.visibel = false;
        return;
    }
    this.invinc = true;
    this.img.alpha = 0.5;
    this.hSprite.content = Array(this.hp).fill('💗').join('');
    let bounce = 40;
    this.loseInvincibility(this.invinceTime);
    switch(dir) {
        case 'right':
            this.sprite.x -= bounce;
            break;
        case 'left':
            this.sprite.x += bounce;
            break;
        case 'up':
            this.sprite.y += bounce;
            break;
        case 'down':
            this.sprite.y -= bounce;
            break;
    }
};

Actor.prototype.loseInvincibility = function(invinceTime) {
    this.g.wait(invinceTime, () => {
        this.invinc = false;
        this.img.alpha = 1;
    });
};

Actor.prototype.moveHealth = function() {
    this.hSprite.x = this.sprite.x;
    this.hSprite.y = this.sprite.y - this.height - this.hSprite.height;
};

Actor.prototype.moveImage = function() {
    this.img.x = this.sprite.x - 3;
    this.img.y = this.sprite.y;
};

export default Actor;