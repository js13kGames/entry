AFRAME.registerComponent("button", {
  schema: {
    resetTime: { type: "number", default: null },
    pressed: { type: "boolean" }
  },

  init: function() {
    const el = this.el;

    console.log("button init");
    el.addEventListener("click", e => {
      // console.log("Click");
      el.addState("pressed");
    });

    el.addEventListener("stateadded", e => {
      // console.log(`State added '${e.detail}'`);
      if (e.detail == "pressed") {
        el.classList.remove("clickable");
        el.emit("in");
        if (this.data.resetTime >= 0) {
          setTimeout(() => el.removeState("pressed"), this.data.resetTime);
        }
      }
    });

    el.addEventListener("stateremoved", e => {
      // console.log(`State removed '${e.detail}'`);
      if (e.detail == "pressed") {
        el.classList.add("clickable");
        el.emit("out");
      }
    });
  },

  update: function() {
    const el = this.el;

    console.log("button update");
    setTimeout(() => {
      if (this.data.pressed) {
        el.addState("pressed");
      } else {
        el.removeState("pressed");
      }
    }, 0);
  }
});
