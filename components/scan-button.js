AFRAME.registerComponent("scan-button", {
  init: function() {
    console.log("scan-button init");

    this.el.addEventListener("click", e => this.el.sceneEl.emit("scan"));
  }
});