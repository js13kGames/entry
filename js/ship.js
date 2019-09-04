AFRAME.registerComponent('ship', {
  schema: {},

  init: function () {
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
  },

  tick: function(time, timeDelta) {
    const pos = this.el.getAttribute("position");
    this.el.setAttribute("position", {x: pos.x + this.vx, y: pos.x + this.vy, z: pos.z + this.vz});
  }
});