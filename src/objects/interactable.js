let Interactable = function(g, action, stop) {
    this.g = g;
    this.active = false;
    this.action = action || {};
    this.stop = stop || {};
};

Interactable.prototype.activate = function() {
    if (this.active) {
        return;
    }
    this.active = true;
    this.action();
};

Interactable.prototype.deactivate = function() {
    this.active = false;
    this.stop();
};

export default Interactable;