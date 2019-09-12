import Spikes from './../objects/spikes.js';
import dirs from './../directions.js';
import Enemy from './../actors/enemy.js';
import Boss from './../actors/boss.js';
import GameOver from './game-over.js';
import {toRadians, reverseDirection} from './../utils.js';

let EnemyRoom = function(g, loadNext) {
    this.g = g;
    this.player = g.player;
    this.sword = g.player.sword;
    this.exitPit = g.rectangle(50,50,'yellow');
    this.exitPit.visible = false;
    this.exitPitImg = g.text('🚪', '50px times');
    this.exitPitImg.visible = false;
    this.loadNext = loadNext;
    this.spikes = [new Spikes(g, dirs.UP), new Spikes(g, dirs.D), new Spikes(g, dirs.L), new Spikes(g, dirs.R)];
    this.scene = g.group(this.exitPitImg);
    this.spikes.forEach(s => {
        s.imgs.forEach(img => {
            this.scene.addChild(img);
        });
    });
    this.player.hSprite.layer = 200;
    this.scene.visible = false;
    this.fromDir = '';
    this.enemies = [];
    this.treasure = null;
    this.hasTreasure = false;
    this.canOpen = false;
    this.deathCount = 0;
    this.deathMax = 30;
    this.actionKey = g.keyboard(70);
    this.actionKey.press = () => {
        if (this.canOpen) {
            this.treasure.activate();
        } else if (!this.sword.active && this.scene.visible) {
            this.sword.startSwing(this.player.sprite.direction, 
                this.player.sprite.x + this.player.sprite.halfWidth, 
                this.player.sprite.y - this.player.sprite.halfHeight);
        }
    }
};

EnemyRoom.prototype.load = function(fromDir, explored, numEnemies, hasTreasure, treasure) {
    this.g.stage.putCenter(this.player.sprite, 0, 0);
    this.exitPitImg.visible = false;
    this.g.stage.putCenter(this.exitPit, 0, -50);
    this.g.stage.putCenter(this.exitPitImg, -20, -65);
    this.fromDir = fromDir;
    this.hasTreasure = hasTreasure;
    if (!explored) {
        if (hasTreasure) {
            this.treasure = treasure;
            this.scene.addChild(treasure.sprite);
            this.scene.addChild(treasure.img);
        }
        this.loadEnemies(numEnemies, numEnemies);
        this.enemies.length > 0 && this.placeEnemies();
    }
};

EnemyRoom.prototype.loadBoss = function() {
    this.g.stage.putCenter(this.player.sprite, 0, 0);
    this.enemies.push(new Boss(this.g, this.player.sprite));
    this.exitPitImg.visible = false;
    this.g.stage.putCenter(this.exitPit, 0, -50);
    this.g.stage.putCenter(this.exitPitImg, -20, -65);
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
    let p = this.player.sprite;

    if (this.player.dead) {
        this.deathCount++;
        this.scene.alpha -= 0.02;
        if (this.deathCount >= this.deathMax) {
            this.g.state = new GameOver(this.g, ['You have died']);
        }
        return;
    }

    if (!this.sword.active) {
        this.g.move(p);
    }
    if (p.vx != 0 || p.vy != 0) {
        this.canOpen = false;
    }
    this.g.contain(p, this.g.stage.localBounds);
    if (this.exitPitImg.visible && this.g.hitTestRectangle(p, this.exitPit)) {
        this.loadNext(dirs.BACK, this.fromDir);
    }

    if (this.hasTreasure && this.treasure.img.visible && this.g.rectangleCollision(p, this.treasure.sprite)) {
        this.canOpen = true;
    }

    this.spikes.forEach(spike => {
        if (this.g.hitTestRectangle(p, spike.sprite)) {
            this.player.takeDamage(1, spike.side);
        }
    })

    if(this.sword.active) {
        this.g.rotateAroundSprite(this.sword.sprite, p, p.width, this.sword.degrees);
        this.sword.swing();
    }

    if (this.enemies.length === 0 && !this.exitPitImg.visible) {
        if (this.g.hitTestRectangle(this.exitPit, p)) {
            this.exitPit.y = 50;
            this.exitPitImg.y = 55;
        }
        this.exitPitImg.visible = true;
        if (this.hasTreasure) {
            this.treasure.img.visible = true;
            this.g.stage.putCenter(this.treasure.sprite, 0, this.g.canvas.height / 4);
            this.g.stage.putCenter(this.treasure.img, -13, this.g.canvas.height / 4 - 10);
        }
    } else {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            let e = this.enemies[i];
            if (this.sword.active && !e.invinc) {
                let side = this.g.hitTestRectangle(this.sword.sprite, e.sprite)
                if (side) {
                    e.takeDamage(this.sword.dmg, reverseDirection(p.direction), p);
                }
            }
            
            if (!e.dead) {
                if (e.img.visible) {
                    this.g.followConstant(e.sprite, p, e.speed);
                    this.g.contain(e.sprite, this.g.stage.localBounds);
                    e.moveHealth();
                    e.moveImage();
                    if (!this.player.invinc) {
                        let side = this.g.rectangleCollision(p, e.sprite, true);
                        if(side) {
                            this.player.takeDamage(e.dmg, side);
                        }
                    }
                }
            } else {
                this.g.remove(e.sprite);
                this.g.remove(e.img);
                this.g.remove(e.hSprite);
                this.enemies.splice(i, 1);
            }
        }
    }
}; 

export default EnemyRoom;