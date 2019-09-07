let Actor = function(g, health, invinceTime, healthWidth) {
    this.g = g;
    this.health = health;
    this.invincible = false;
    this.invinceTime = invinceTime || 1000;
    this.dead = false;
    this.healthWidth = healthWidth;
    this.healthSprite = g.rectangle(this.healthWidth * this.health, this.healthWidth, 'purple');
    // this.healthSprite.layer = 1000;
    this.healthSprite.visible = false;
    this.healthSprite.alpha = 0.5;
};

Actor.prototype.show = function() {
    this.sprite.visible = true;
    this.healthSprite.visible = true;
};

Actor.prototype.hide = function() {
    this.sprite.visible = false;
    this.healthSprite.visible = false;
};

Actor.prototype.stopMoving = function() {
    this.sprite.vx = 0;
    this.sprite.vy = 0;
};

Actor.prototype.heal = function(amt) {
    this.health += amt;
    this.healthSprite.width += this.healthWidth * amt;
};

Actor.prototype.takeDamage = function(amount, direction) {
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
    this.sprite.alpha = 0.5;
    this.healthSprite.width -= this.healthWidth * amount;
    let bounce = 40;
    this.loseInvincibility(this.invinceTime);
    switch(direction) {
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
        this.invincible = false;
        this.sprite.alpha = 1;
    });
};

Actor.prototype.moveHealth = function() {
    this.healthSprite.x = this.sprite.x;
    this.healthSprite.y = this.sprite.y - this.healthWidth;
};

export default Actor;