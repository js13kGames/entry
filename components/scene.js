AFRAME.registerComponent("scene", {
  init: function () {
    // This listener allows for vibration on all touches
    this.el.addEventListener("touchstart", e => {
      navigator.vibrate(10);
    });
  }
});