AFRAME.registerComponent("go-button", {
  init: function() {
    console.log("go-button init");

    const shipEl = this.el.sceneEl.querySelector("#ship");
    let ship;
    shipEl.addEventListener("loaded", e => ship = shipEl.components.ship);

    // Enable the button when we select a target
    this.el.sceneEl.addEventListener("changeTarget", e => {
      if (e.detail != null) {
        this.el.removeState("pressed");
      }
    });

    // Change location when the button is pressed
    this.el.addEventListener("click", e => {
      if (ship.target) {
        this.el.sceneEl.emit("changeLocation", ship.target);
        this.el.sceneEl.emit("changeTarget", null);
        this.el.addState("pressed");
      }
    });
  }
});