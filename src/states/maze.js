import StatueRoom from './statue-room.js';
import EnemyRoom from './enemy-room.js';
import Treasure from './../objects/treasure.js';
import directions from './../directions.js';
import getSentence from '../actions/senGen.js';
import {getRand} from './../utils.js';
import modes from './../modes';
import GameOver from './game-over.js';

let Maze = function(g, mode) {
    this.g = g;
    this.player = g.player;
    this.level = 0;
    this.endLevel = 10;
    this.goodDir = '';
    this.treasureDir = '';
    this.mode = mode;
    this.statueRoom = new StatueRoom(this.g, mode, function(dir){this.loadNext(dir);}.bind(this));
    this.enemyRoom = {};
    this.treasureRoom = {};
    this.explored = [];
    this.showingChar = false;
    this.shownSprite = null;
    this.treasures = [
        new Treasure(this.g, 'Potion', 'HP up 5', () => this.g.player.heal(5)),
        new Treasure(this.g, 'Sword', 'Damage up 1', () => this.g.player.sword.dmg += 1),
    ];
    switch(mode) {
        case modes[0]:
        case modes[1]:
            this.treasures.push(new Treasure(this.g, 'Dictionary', 'A character is revealed', function(){this.showingChar = true;}.bind(this)));
            break;
        case modes[2]:
            this.treasures.push(new Treasure(this.g, "Monochrome", 'Morse speed down', function(){this.g.tempo -= 60;}.bind(this)))
    }
    this.dirs = directions.ALL;
    this.room = this.statueRoom;
    this.numWrongRooms = 0;
    this.levelText = g.text(`${this.level}`, "28px sans-serif", "black");
    this.levelText.layer = 1000;
    this.loadNext(this.goodDir);
    g.player.show();

    return () => this.loop();
};

Maze.prototype.loadNext = function(dir, fromDir) {
    if (this.level === this.endLevel) {
        this.endGame();
        return;
    }
    this.room.scene.visible = false;
    this.player.invinc = true;
    this.player.loseInvincibility();
    let numEnemy = this.numWrongRooms + 1;
    if (dir === directions.BACK) {
        this.statueRoom.placePlayer(fromDir);
        this.room = this.statueRoom;
    } else if (dir === this.goodDir) {
        this.enterNextLevel();
    } else if (dir === this.treasureDir) {
        if (this.explored.includes(dir)) {
            this.treasureRoom.load(dir, true, numEnemy, true, {});
        } else {
            let treasure = getRand(this.treasures.length);
            this.treasureRoom.load(dir, false, numEnemy, true, this.treasures.splice(treasure, 1)[0]);
        }
        this.room = this.treasureRoom;
        this.explored.push(dir);
    } else {
        this.enemyRoom.load(dir, this.explored.includes(dir), numEnemy, false);
        this.room = this.enemyRoom;
        if (!this.explored.includes(dir)) {
            this.explored.push(dir);
            this.numWrongRooms++;
        }
    }
    this.room.scene.visible = true;
    this.player.stopMoving();
};

Maze.prototype.enterNextLevel = function() {
    this.level++;
    this.enemyRoom = new EnemyRoom(this.g, function(dir, fromDir){this.loadNext(dir, fromDir);}.bind(this));
    this.treasureRoom = new EnemyRoom(this.g, function(dir, fromDir){this.loadNext(dir, fromDir);}.bind(this));
    this.levelText.content = `lv ${this.level}`;
    let goodInd = getRand(this.dirs.length);
    // goodInd = 0;
    this.goodDir = this.dirs[goodInd];
    if (this.level === this.endLevel) {
        if (this.treasures.length === 0) {
            this.enemyRoom.loadBoss();
            this.room = this.enemyRoom;
        } else {
            this.endGame();
            return;
        }
    } else {
        let treasureInd;
        let hasTreasure = (getRand(this.endLevel - this.level) < this.treasures.length);
        if (hasTreasure) {
            do {
                treasureInd = getRand(this.dirs.length);
            } while (treasureInd === goodInd);
            // treasureInd = 1;
            this.treasureDir = this.dirs[treasureInd];
        }  else {
            this.treasureDir = '';
        }
        this.statueRoom.load(getSentence(this.goodDir, hasTreasure, this.treasureDir), this.showingChar);
        this.explored = [];
        this.room = this.statueRoom;
    }
};

Maze.prototype.endGame = function() {
    this.room.scene.alpha = 0;
    this.player.hide();
    this.player.sword.sprite.visible = false;
    this.g.state = new GameOver(this.g, this.treasures.length === 0 ?
        ['You found the kids', 'and made it back.', 'Congratulations hero.'] :
        ['You made it back,', 'but the kids were', 'never seen again.']);
};


Maze.prototype.loop = function() {
    this.room.loop();
    this.player.moveImage();
    let w = this.g.canvas.width / 2;
    this.g.stage.putTop(this.levelText, w - 50, 20);
    this.g.stage.putTop(this.player.hSprite, -w + this.player.hSprite.halfWidth + 10, 20);
};

export default Maze;