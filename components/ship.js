AFRAME.registerComponent('ship', {
  schema: {},

  init: function () {
    console.log("ship init");

    const el = this.el;
    const sceneEl = el.sceneEl;
    const fuelGuage = el.querySelector("#fuelGuage");
    const jumpGuage = el.querySelector("#jumpGuage");

    this.target = null;
    this.location = null;
    this.fuel = 0.8;
    this.scoopDeployed = false;

    function setBar(barEl, percent) {
      barEl.setAttribute("height", Math.max(0.5 * percent, .0001));
      barEl.object3D.position.y = 0.25 * (percent - 1);
    }

    setBar(fuelGuage, this.fuel);
    setBar(jumpGuage, 0);

    sceneEl.addEventListener("changeTarget", e => {
      console.log("Changing target to", e.detail.node, e.detail.cost);
      this.target = e.detail.node;
      setBar(jumpGuage, e.detail.cost);
    });

    sceneEl.addEventListener("changeLocation", e => {
      console.log("Changing location to", e.detail.node, e.detail.cost);
      this.location = e.detail.node;
      this.fuel -= e.detail.cost;
      setBar(fuelGuage, this.fuel);
      if (this.fuel <= 0) {
        console.log("GAME OVER");
        // TODO: Game over logic
      }
    });

    sceneEl.addEventListener("worldReady", e => {
      this.location = e.detail.nodes[0];
    });
  },

  tick: function(time, timeDelta) {
  }
});