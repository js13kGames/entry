let Maze1 = function(mode, player) {
    this.level = 0;
    this.endLevel = 10;
    this.player = player;
    this.goodDir = '';
    this.treasureDir = '';
    this.mode = mode;
    this.rooms = [];
    this.statueRoom = new StatueRoom(mode, function(dir){this.loadNextRoom(dir);}.bind(this));
    this.enemyRoom = new EnemyRoom1(function(dir, fromDir){this.loadNextRoom(dir, fromDir);}.bind(this));
    this.explored = [];
    this.shownChar = 'o';
    this.shownSprite = null;
    this.treasures = [
        new Treasure('A Health Potion', () => player.heal(5)),
        new Treasure('A Sharp Sword', () => player.sword.damage += 1),
    ];
    switch(mode) {
        case MODES[0]:
        case MODES[1]:
            this.treasures.push(new Treasure('Dictionary', function(){this.showChar();}.bind(this)));
            break;
        case MODES[2]:
            this.treasures.push(new Treasure("Monochrome", function(){GAME_TEMPO -= 60;}))
    }
    this.dirs = [UP, DOWN, LEFT, RIGHT];
    this.currentRoom = this.statueRoom;
    this.numWrongRooms = 0;
    this.levelText = g.text(`${this.level}`, "28px sans-serif", "black");
    this.loadNextRoom(this.goodDir);
    player.show();

    return () => this.loop();
};

Maze1.prototype.loadNextRoom = function(dir, fromDir) {
    this.currentRoom.scene.visible = false;
    this.player.invincible = true;
    this.player.loseInvincibility();
    if (dir === BACK) {
        this.statueRoom.placePlayer(fromDir);
        this.currentRoom = this.statueRoom;
    } else if (dir === this.goodDir) {
        this.enterNextLevel();
    } else if (dir === this.treasureDir) {
        if (!this.explored.includes(dir)) {
            
        }
        // let treasure = getRand(this.treasures.length);
        // this.EnemyRoom1.load(dir, this.explored.includes(dir), this.numWrongRooms / 2, true, this.treasures[treasure]);
        this.rooms[1].load(dir, this.explored.includes(dir), this.numWrongRooms / 2);
        // this.treasures.splice(treasure, 1);
        this.currentRoom = this.rooms[1];
        this.explored.push(dir);
    } else {
        
        this.enemyRoom.load(dir, this.explored.includes(dir), this.numWrongRooms / 2);
        this.currentRoom = this.enemyRoom;
        if (!this.explored.includes(dir)) {
            this.explored.push(dir);
            this.numWrongRooms++;
        }
    }
    this.currentRoom.scene.visible = true;
    this.player.stopMoving();
};

Maze1.prototype.enterNextLevel = function() {
    this.level++;
    this.levelText.content = `${this.level}`;
    let goodInd = getRand(this.dirs.length);
    this.rooms = [
        new EnemyRoom1(this.loadNextRoom.bind(this)), 
        new EnemyRoom1(this.loadNextRoom.bind(this)),
        new EnemyRoom1(this.loadNextRoom.bind(this)),
        new EnemyRoom1(this.loadNextRoom.bind(this))
    ];
    goodInd = 0;
    this.goodDir = this.dirs[goodInd];
    if (this.level === this.endLevel && this.treasures.length === 0) {
        this.enemyRoom.loadBoss();
        this.currentRoom = this.enemyRoom;
    } else {
        let treasureInd;
        let hasTreasure = (this.level + this.treasures.length >= this.endLevel) ||
            (getRand(this.endLevel - this.level) < this.treasures.length);
        console.log(`has treasure: ${hasTreasure}`);
        if (hasTreasure) {
            do {
                treasureInd = getRand(this.dirs.length);
            } while (treasureInd === goodInd);
            treasureInd = 1;
            this.treasureDir = this.dirs[treasureInd];
            this.rooms[treasureInd] = new EnemyRoom1(this.loadNextRoom.bind(this), true, this.treasures[0]);
            this.treasures.splice(0, 1);
        } 
        this.statueRoom.load(getSentence(this.goodDir, hasTreasure, this.treasureDir), this.shownChar);
        this.explored = [];
        this.currentRoom = this.statueRoom;
    }
};

Maze1.prototype.showChar = function() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz.,!12369';
    this.shownChar = alphabet[getRand(alphabet.length)];
};

Maze1.prototype.loop = function() {
    this.currentRoom.loop();
    g.stage.putTop(this.levelText, g.canvas.width / 2 - 30, 20);
    g.stage.putTop(player.healthSprite, -g.canvas.width / 2 + player.healthSprite.width / 1.5, 40);
};

