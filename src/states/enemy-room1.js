let EnemyRoom1 = function(loadNextRoom, hasTreasure, treasure) {
    
    this.exitPit = g.rectangle(50,50,'yellow');
    this.loadNextRoom = loadNextRoom;
    this.spikes = [new Spikes(UP), new Spikes(DOWN), new Spikes(LEFT), new Spikes(RIGHT)];
    this.scene = g.group(this.exitPit, this.spikes[0].sprite, this.spikes[1].sprite, this.spikes[2].sprite, this.spikes[3].sprite);
    this.scene.visible = false;
    this.fromDir = UP;
    this.enemies = [];
    this.hasTreasure = hasTreasure;
    if (hasTreasure) {
        this.treasure = treasure;
        this.scene.addChild(treasure.sprite);
    }
    this.canOpen = false;
    this.actionKey = g.keyboard(70);
    this.actionKey.press = () => {
        if (this.canOpen) {
            this.treasure.activate();
        } else if (!player.sword.active && this.scene.visible) {
            player.sword.startSwing(player.sprite.direction);
        }
    }
};

EnemyRoom1.prototype.load = function(fromDir, explored, numEnemies) {
    g.stage.putCenter(player.sprite, 0, 0);
    this.exitPit.visible = false;
    g.stage.putCenter(this.exitPit, 0, -50);
    this.fromDir = fromDir;
    if (!explored) {
        if (this.hasTreasure) {
            this.loadEnemies(Math.floor(numEnemies * 1.5), 2);
        } else {
            this.loadEnemies(numEnemies, 1);
        }
        this.placeEnemies();
    }
    if (this.hasTreasure) {
        this.scene.addChild(this.treasure.sprite);
        if (explored) {
            this.treasure.sprite.visible = true;
        }
        g.stage.putCenter(this.treasure.sprite, 0, g.canvas.height / 4);
    }
};

EnemyRoom1.prototype.loadEnemies = function(num, lvl) {
    for (let i = 0; i < num; i++) {
        this.enemies.push(new Enemy(lvl));
    }
};

EnemyRoom1.prototype.placeEnemies = function() {
    let deltaAngle = 360 / this.enemies.length;
    let angle = 0;
    let x = g.canvas.width / 2;
    let y = g.canvas.height / 2;
    let distance = g.canvas.width / 4;
    this.enemies.forEach((e, i) => {
        let point = g.rotateAroundPoint(x, y, distance, distance, toRadians(angle));
        angle += deltaAngle;
        e.sprite.x = point.x;
        e.sprite.y = point.y;
    });
};

EnemyRoom1.prototype.loop = function() {
    if (!player.sword.active) {
        g.move(player.sprite);
    }
    if (player.sprite.vx != 0 || player.sprite.vy != 0) {
        this.canOpen = false;
    }
    g.contain(player.sprite, g.stage.localBounds);
    if (this.exitPit.visible && g.hitTestRectangle(player.sprite, this.exitPit)) {
        // if (this.hasTreasure) {
        //     this.treasure.sprite.visible = false;
        //     this.treasure = null;
        //     this.hasTreasure = false;
        // }
        this.loadNextRoom(BACK, this.fromDir);
    }

    if (this.hasTreasure && this.treasure.sprite.visible && g.hit(player.sprite, this.treasure.sprite, true)) {

        this.canOpen = true;
    }

    this.spikes.forEach(spike => {
        if (g.hitTestRectangle(player.sprite, spike.sprite)) {
            player.takeDamage('spikes', spike.side);
        }
    })

    if(player.sword.active) {
        g.rotateAroundSprite(player.sword.sprite, player.sprite, player.sprite.width, player.sword.degrees);
        player.sword.swing();
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
        let e = this.enemies[i];


        if (player.sword.active && !e.invincible) {
            let side = g.hitTestRectangle(player.sword.sprite, e.sprite)
            if (side) {
                e.takeDamage(player.sword.damage, reverseDirection(player.sprite.direction));
            }
        }
        
        if (! e.dead) {
            g.followConstant(e.sprite, player.sprite, e.speed);
            g.contain(e.sprite, g.stage.localBounds);
            e.moveHealth();
            if (!player.invincible) {
                let side = g.rectangleCollision(player.sprite, e.sprite, true);
                if(side) {
                    player.takeDamage(e.damage, side);
                }
            }
        } else {
            g.remove(e.sprite);
            g.remove(e.healthSprite);
            this.enemies.splice(i, 1);
        }
    }

    if (this.enemies.length === 0) {
        this.exitPit.visible = true;
        if (this.hasTreasure) {
            this.treasure.sprite.visible = true;
            g.stage.putCenter(this.treasure.sprite, 0, g.canvas.height / 4);
        }
    }
}; 