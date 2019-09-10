AFRAME.registerComponent("go-button", {
  init: function() {
    console.log("go-button init");

    const el = this.el;
    const sceneEl = el.sceneEl;

    const shipEl = sceneEl.querySelector("#ship");
    let ship;
    shipEl.addEventListener("loaded", e => ship = shipEl.components.ship);

    let world;
    sceneEl.addEventListener("updateWorld", e => world = e.detail);

    function checkPress() {
      console.log(ship.target, ship.scoopDeployed);
      setTimeout(() => {
        if (ship.target && !ship.scoopDeployed) {
          el.removeState("pressed");
        } else {
          el.addState("pressed");
        }
      }, 0);
    }

    // Check whether to enable the button when setting target, and togglign scoop
    sceneEl.addEventListener("changeTarget", e => checkPress());
    sceneEl.addEventListener("toggleScoop", e => checkPress());

    // Change location when the button is pressed
    el.addEventListener("click", e => {
      const t = ship.target;
      if (t) {
        const c = world.links.find(l => l.nodes.includes(t.name) && l.nodes.includes(ship.location.name)).cost;
        sceneEl.emit("changeLocation", {node: t, cost: c});
        sceneEl.emit("changeTarget", {});
        el.addState("pressed");
      }
    });
  }
});