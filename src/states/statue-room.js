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
    g.stage.putCenter(this.statue.img, -25, -15);
    
    this.pitSprites = this.pits.map(p => p.img);
    this.scene = g.group(this.statue.img, this.pitSprites[0], this.pitSprites[1], this.pitSprites[2], this.pitSprites[3]);
    this.scene.visible = false;
    this.actionKey = g.keyboard(70);
    this.cancelKey = g.keyboard(68);
    this.actionKey.press = () => {
        if (this.canUseStatue && !this.statue.active) {
            this.scene.alpha = 0.1;
            this.player.img.alpha = 0.1;
            this.statue.activate();
        }
    };
    this.cancelKey.press = () => {
        if (this.statue.active) {
            this.scene.alpha = 1;
            this.player.img.alpha = 1;
            this.statue.deactivate();
        }
    };
};

StatueRoom.prototype.load = function(sentence, shownChar) {
    this.statue.initialize(sentence.toLowerCase(), shownChar);
    this.g.stage.putCenter(this.player.sprite, 0, 100);
    this.g.stage.putCenter(this.player.img, 0, 100);
};

StatueRoom.prototype.placePlayer = function(dir) {
    let size = this.pits[0].sprite.width;
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
    this.g.stage.putCenter(this.player.img, x, y);
};

StatueRoom.prototype.loop = function() {
    let p = this.player.sprite;
    if (! this.statue.active) {
        this.g.move(p);
    }
    this.g.contain(p, this.g.stage.localBounds);

    if (p.vx != 0 || p.vy != 0) {
        this.canUseStatue = false;
    }

    if (this.g.rectangleCollision(p, this.statue.sprite)) {
        this.canUseStatue = true;
    }
    this.pits.forEach(pit => {
        if (this.g.hitTestRectangle(p, pit.sprite)) {
            this.loadNext(pit.dir);
        }
    })
};  

export default StatueRoom;