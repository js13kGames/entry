AFRAME.registerComponent("go-button", {
  init: function() {
    console.log("go-button init");

    const shipEl = this.el.sceneEl.querySelector("#ship");
    let ship;
    shipEl.addEventListener("loaded", e => ship = shipEl.components.ship);

    let world;
    this.el.sceneEl.addEventListener("worldReady", e => world = e.detail);

    // Enable the button when we select a target
    this.el.sceneEl.addEventListener("changeTarget", e => {
      if (e.detail != null) {
        this.el.removeState("pressed");
      }
    });

    // Change location when the button is pressed
    this.el.addEventListener("click", e => {
      const t = ship.target;
      if (t) {
        const c = world.links.find(l => l.nodes.includes(t.name) && l.nodes.includes(ship.location.name)).cost;
        this.el.sceneEl.emit("changeLocation", {node: t, cost: c});
        this.el.sceneEl.emit("changeTarget", {});
        this.el.addState("pressed");
      }
    });
  }
});