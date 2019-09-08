AFRAME.registerComponent("button", {
  schema: {
    resetTime: {type: "number", default: null},
    pressed: {type: "boolean"}
  },
  
  init: function() {
    console.log("button init");
    this.el.addEventListener("click", e => {
      // console.log("Click");
      this.el.addState("pressed");
    });
      
    this.el.addEventListener("stateadded", e => {
      // console.log(`State added '${e.detail}'`);
      if (e.detail == "pressed") {
        this.el.emit("in");
        if (this.data.resetTime >= 0) {
          setTimeout(() => this.el.removeState("pressed"), this.data.resetTime);  
        }
      }
    });
    
    this.el.addEventListener("stateremoved", e => {
      // console.log(`State removed '${e.detail}'`);
      if (e.detail == "pressed") {
        this.el.emit("out");
      }
    });
  },
  
  update: function() {
    console.log("button update");
    setTimeout(() => {
      if (this.data.pressed) {
        this.el.addState("pressed");
      } else {
        this.el.removeState("pressed");
      }
    }, 0);
  }
});