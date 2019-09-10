let Actor = function(g, hp, invinceTime, healthWidth) {
    this.g = g;
    this.hp = hp;
    this.invinc = false;
    this.invinceTime = invinceTime || 1000;
    this.dead = false;
    this.healthWidth = healthWidth;
    this.hSprite = g.rectangle(this.healthWidth * this.hp, this.healthWidth, 'purple');
    // this.hSprite.layer = 1000;
    this.hSprite.visible = false;
    this.hSprite.alpha = 0.5;
};

Actor.prototype.show = function() {
    this.sprite.visible = true;
    this.hSprite.visible = true;
};

Actor.prototype.hide = function() {
    this.sprite.visible = false;
    this.hSprite.visible = false;
};

Actor.prototype.stopMoving = function() {
    this.sprite.vx = 0;
    this.sprite.vy = 0;
};

Actor.prototype.heal = function(amt) {
    this.hp += amt;
    this.hSprite.width += this.healthWidth * amt;
};

Actor.prototype.takeDamage = function(amount, dir) {
    if (this.invinc) {
        return;
    }
    this.hp -= amount;
    if (this.hp <= 0) {
        this.dead = true;
        this.hSprite.width = 0;
        return;
    }
    this.invinc = true;
    this.sprite.alpha = 0.5;
    this.hSprite.width -= this.healthWidth * amount;
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
        this.sprite.alpha = 1;
    });
};

Actor.prototype.moveHealth = function() {
    this.hSprite.x = this.sprite.x;
    this.hSprite.y = this.sprite.y - this.healthWidth;
};

export default Actor;