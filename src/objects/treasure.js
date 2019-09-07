import Interactable from './interactable.js';

let Treasure = function(g, name, action) {
    let act = () => {
        this.open();
        action();
    };
    Interactable.call(this, g, act, {});
    this.name = name;
    this.sprite = g.rectangle(32, 32, 'gold');
    this.sprite.visible = false;
};

Treasure.prototype = Object.create(Interactable.prototype);

Treasure.prototype.open = function() {
    this.sprite.fillStyle = "brown";
};

export default Treasure;