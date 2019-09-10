import Spikes from './../objects/spikes.js';
import directions from './../directions.js';
import Enemy from './../actors/enemy.js';
import Boss from './../actors/boss.js';
import GameOver from './game-over.js';
import {toRadians, reverseDirection} from './../utils.js';

let EnemyRoom = function(g, loadNext) {
    this.g = g;
    this.player = g.globals.player;
    this.exitPit = g.rectangle(50,50,'yellow');
    this.loadNext = loadNext;
    this.spikes = [new Spikes(g, directions.UP), new Spikes(g, directions.DOWN), new Spikes(g, directions.LEFT), new Spikes(g, directions.RIGHT)];
    this.scene = g.group(this.exitPit, this.spikes[0].sprite, this.spikes[1].sprite, this.spikes[2].sprite, this.spikes[3].sprite);
    this.scene.visible = false;
    this.fromDir = '';
    this.enemies = [];
    this.treasure = null;
    this.hasTreasure = false;
    this.canOpen = false;
    this.deathCount = 0;
    this.bossRoom = false;
    this.deathMax = 30;
    this.actionKey = g.keyboard(70);
    this.actionKey.press = () => {
        if (this.canOpen) {
            this.treasure.activate();
        } else if (!this.player.sword.active && this.scene.visible) {
            this.player.sword.startSwing(this.player.sprite.direction, 
                this.player.sprite.x + this.player.sprite.halfWidth, 
                this.player.sprite.y - this.player.sprite.halfHeight);
        }
    }
};

EnemyRoom.prototype.load = function(fromDir, explored, numEnemies, hasTreasure, treasure) {
    this.g.stage.putCenter(this.player.sprite, 0, 0);
    this.exitPit.visible = false;
    this.g.stage.putCenter(this.exitPit, 0, -50);
    this.fromDir = fromDir;
    this.hasTreasure = hasTreasure;
    if (!explored) {
        if (hasTreasure) {
            this.loadEnemies(Math.floor(numEnemies * 1.5), 2);
            this.treasure = treasure;
            this.scene.addChild(treasure.sprite);
        } else {
            this.loadEnemies(numEnemies, 1);
        }
        this.enemies.length > 0 && this.placeEnemies();
    }
};

EnemyRoom.prototype.loadBoss = function() {
    this.g.stage.putCenter(this.player.sprite, 0, 0);
    this.enemies.push(new Boss(this.g, this.player.sprite));
    this.bossRoom = true;
    this.exitPit.visible = false;
    this.g.stage.putCenter(this.exitPit, 0, -50);
};

EnemyRoom.prototype.loadEnemies = function(num, lvl) {
    for (let i = 0; i < num; i++) {
        this.enemies.push(new Enemy(this.g, lvl));
    }
};

EnemyRoom.prototype.placeEnemies = function() {
    let deltaAngle = 360 / this.enemies.length;
    let angle = 0;
    let x = this.g.canvas.width / 2;
    let y = this.g.canvas.height / 2;
    let distance = this.g.canvas.width / 4;
    this.enemies.forEach((e, i) => {
        let point = this.g.rotateAroundPoint(x, y, distance, distance, toRadians(angle));
        angle += deltaAngle;
        e.sprite.x = point.x;
        e.sprite.y = point.y;
    });
};

EnemyRoom.prototype.loop = function() {
    if (this.player.dead) {
        this.deathCount++;
        this.scene.alpha -= 0.02;
        if (this.deathCount >= this.deathMax) {
            this.g.state = new GameOver(this.g, ['You have died']);
        }
        return;
    }

    if (!this.player.sword.active) {
        this.g.move(this.player.sprite);
    }
    if (this.player.sprite.vx != 0 || this.player.sprite.vy != 0) {
        this.canOpen = false;
    }
    this.g.contain(this.player.sprite, this.g.stage.localBounds);
    if (this.exitPit.visible && this.g.hitTestRectangle(this.player.sprite, this.exitPit)) {
        this.loadNext(directions.BACK, this.fromDir);
    }

    if (this.hasTreasure && this.treasure.sprite.visible && this.g.rectangleCollision(this.player.sprite, this.treasure.sprite)) {
        this.canOpen = true;
    }

    this.spikes.forEach(spike => {
        if (this.g.hitTestRectangle(this.player.sprite, spike.sprite)) {
            this.player.takeDamage(1, spike.side);
        }
    })

    if(this.player.sword.active) {
        this.g.rotateAroundSprite(this.player.sword.sprite, this.player.sprite, this.player.sprite.width, this.player.sword.degrees);
        this.player.sword.swing();
    }

    if (this.enemies.length === 0 && !this.exitPit.visible) {
        if (this.g.hitTestRectangle(this.exitPit, this.player.sprite)) {
            this.exitPit.y = 50;
        }
        this.exitPit.visible = true;
        if (this.hasTreasure) {
            this.treasure.sprite.visible = true;
            this.g.stage.putCenter(this.treasure.sprite, 0, this.g.canvas.height / 4);
        }
    } else {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            let e = this.enemies[i];
            if (this.player.sword.active && !e.invincible) {
                let side = this.g.hitTestRectangle(this.player.sword.sprite, e.sprite)
                if (side) {
                    e.takeDamage(this.player.sword.damage, reverseDirection(this.player.sprite.direction), this.player.sprite);
                }
            }
            
            if (!e.dead) {
                if (e.sprite.visible) {
                    this.g.followConstant(e.sprite, this.player.sprite, e.speed);
                    this.g.contain(e.sprite, this.g.stage.localBounds);
                    e.moveHealth();
                    if (!this.player.invincible) {
                        let side = this.g.rectangleCollision(this.player.sprite, e.sprite, true);
                        if(side) {
                            this.player.takeDamage(e.damage, side);
                        }
                    }
                }
            } else {
                this.g.remove(e.sprite);
                this.g.remove(e.healthSprite);
                this.enemies.splice(i, 1);
            }
        }
    }
}; 

export default EnemyRoom;