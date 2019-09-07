let Sword = function(g) {
    this.degrees = 0;
    this.active = false;
    this.sprite = g.rectangle(40,5,'gray');
    this.sprite.visible = false;
    this.sprite.rotation = 0;
    this.deltaAngle = Math.PI / 16;
    this.frame = 0;
    this.damage = 1;
    this.maxFrame = 12;
};

Sword.prototype.startSwing = function(dir, x, y) {
    switch(dir) {
        case 'left':
            this.degrees = Math.PI / 2;
            break;
        case 'right':
            this.degrees = Math.PI * 3 / 2;
            break;
        case 'up':
            this.degrees = Math.PI;
            break;
        case 'down':
            this.degrees = 0;
            break;
    }
    // this.sprite.x = player.sprite.x + player.sprite.halfWidth;
    // this.sprite.y = player.sprite.y + player.sprite.helfHeight;
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.rotation = this.degrees;
    this.sprite.visible = true;
    this.active = true;
};

Sword.prototype.swing = function() {
    this.degrees += this.deltaAngle;
    this.sprite.rotation = this.degrees;
    this.frame++;
    if (this.frame > this.maxFrame) {
        this.active = false;
        this.degrees = 0;
        this.frame = 0;
        this.sprite.visible = false;
    }
};

export default Sword;