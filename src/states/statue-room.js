import directions from './../directions.js';
import Statue from './../objects/statue.js';
import Pit from './../objects/pit.js';

let StatueRoom = function(g, mode, loadNext) {
    this.g = g;
    this.player = g.player;
    this.loadNext = loadNext;
    this.mode = mode;
    this.statue = new Statue(g, mode);
    this.canUseStatue = false;
    this.pits = [new Pit(g, directions.UP), new Pit(g, directions.D), new Pit(g, directions.L), new Pit(g, directions.R)];
    
    g.stage.putCenter(this.statue.sprite);
    
    this.pitSprites = this.pits.map(p => p.sprite);
    this.scene = g.group(this.statue.sprite, this.pitSprites[0], this.pitSprites[1], this.pitSprites[2], this.pitSprites[3]);
    this.scene.visible = false;
    this.actionKey = g.keyboard(70);
    this.cancelKey = g.keyboard(68);
    this.actionKey.press = () => {
        if (this.canUseStatue && !this.statue.active) {
            this.scene.alpha = 0.1;
            this.player.sprite.alpha = 0.1;
            this.statue.activate();
        }
    };
    this.cancelKey.press = () => {
        if (this.statue.active) {
            this.scene.alpha = 1;
            this.player.sprite.alpha = 1;
            this.statue.deactivate();
        }
    };
};

StatueRoom.prototype.load = function(sentence, shownChar) {
    this.statue.initialize(sentence.toLowerCase(), shownChar);
    this.g.stage.putCenter(this.player.sprite, 0, 100);
};

StatueRoom.prototype.placePlayer = function(dir) {
    let size = this.pitSprites[0].width;
    let x, y;
    if (dir === directions.UP) {
        y = 2 * size - this.g.canvas.height / 2;
        x = 0;
    } else if (dir === directions.D) {
        x = 0;
        y = this.g.canvas.height / 2 - 2 * size;
    } else if (dir === directions.L) {
        x = 2 * size - this.g.canvas.width / 2;
        y = 0;
    } else if (dir === directions.R) {
        x = this.g.canvas.width / 2 - 2 * size;
        y = 0;
    } 
    this.g.stage.putCenter(this.player.sprite, x, y);
};

StatueRoom.prototype.loop = function() {
    if (! this.statue.active) {
        this.g.move(this.player.sprite);
    }
    this.g.contain(this.player.sprite, this.g.stage.localBounds);
    if (this.g.rectangleCollision(this.player.sprite, this.statue.sprite)) {
        if (this.player.sprite.direction === directions.UP) {
            this.canUseStatue = true;
        }
    }
    if (this.player.sprite.direction !== directions.UP) {
        this.canUseStatue = false;
    }
    this.pits.forEach(pit => {
        if (this.g.hitTestRectangle(this.player.sprite, pit.sprite)) {
            this.loadNext(pit.dir);
        }
    })
};  

export default StatueRoom;