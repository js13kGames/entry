AFRAME.registerComponent("scoop-button", {
  init: function() {
    console.log("scoop-button init");

    this.el.addEventListener("click", e => this.el.sceneEl.emit("toggleScoop"));
  }
});