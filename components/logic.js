AFRAME.registerComponent("logic", {
  init: function () {
    console.log("logic init");

    // This listener allows for vibration on all touches
    this.el.addEventListener("touchstart", e => {
      navigator.vibrate(10);
    });

    this.world = {
      nodes: [],
      links: []
    };
    
    this.world.nodes.push({name: "startStar", x: 0, y: 0, size: 0.05, color: "yellow"});
    this.world.nodes.push({name: "startStar-nav", x: 0.2, y: 0.1, size: 0.02, color: "green"});

    this.world.links.push(["startStar", "startStar-nav"]);

    // May have to put this stuff in a timeout if component load order becomes
    // an issue...
    this.el.emit("worldReady", this.world);
    this.el.querySelector("#ship").components.ship.location = this.world.nodes[0];
  }
});