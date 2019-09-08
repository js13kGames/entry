import Maze from './maze.js';
import modes from './../modes.js';

let Menu = function(g) {
    this.g = g;
    let padding = 50;
    let starty = g.stage.height / 4;
    let startX = g.stage.width / 2.5;
    this.selected = 0;
    this.actions = modes.map((e, i) => {
        return new Button(g, e, startX, starty + padding * i, e.length * 15, 20);
    });
    this.actions[0].select();
    this.actionKey = g.keyboard(70);
    this.cancelKey = g.keyboard(68);
    g.key.upArrow.press = () => {
        this.select(-1);
    }
    g.key.downArrow.press = () => {
        this.select(1);
    }
    this.actionKey.press = () => {
        this.actions.forEach(e => {
            this.g.remove(e.scene);
        });
        this.actionKey.press = null;
        this.cancelKey.press = null;
        g.state = new Maze(this.g, modes[this.selected]);
    };
    this.cancelKey.press = () => {
        this.actions[this.selected].deselect();
        this.selected = (this.selected + 1) % this.actions.length;
        this.actions[this.selected].select();
    };

    return () => {};
};

Menu.prototype.select = function(dir) {
    this.actions[this.selected].deselect();
    this.selected = (this.selected += dir) % this.actions.length;
    if (this.selected < 0) {
        this.selected = this.actions.length - 1;
    }
    this.actions[this.selected].select();
};

let Button = function(g, text, x, y, w, h) {
    this.text = g.text(text, '20px Monospace', 'black', x, y);
    this.rect = g.rectangle(w, h, 'gray', 'black', 1, x - 10, y);
    this.scene = g.group(this.rect, this.text);
};

Button.prototype.select = function() {
    this.rect.fillStyle = 'teal';
};

Button.prototype.deselect = function() {
    this.rect.fillStyle = 'gray';
};

export default Menu;