AFRAME.registerComponent('ship', {
  schema: {},

  init: function () {
    console.log("ship init");

    const sceneEl = this.el.sceneEl;

    this.target = null;
    this.location = null;

    sceneEl.addEventListener("changeTarget", e => {
      console.log("Changing target to", e.detail);
      this.target = e.detail;
    });

    sceneEl.addEventListener("changeLocation", e => {
      console.log("Changing location to", e.detail);
      this.location = e.detail;
    });

    sceneEl.addEventListener("worldReady", e => {
      this.location = e.detail.nodes[0];
    });
  },

  tick: function(time, timeDelta) {
  }
});