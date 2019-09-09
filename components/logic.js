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
    
    this.world.nodes.push({name: "startStar", x: 0, y: 0, size: 0.1, color: "yellow"});
    this.world.nodes.push({name: "startStar-nav", x: 0.2, y: 0.1, size: 0.02, color: "grey"});
    this.world.nodes.push({name: "star2", x: -0.5, y: -0.2, size: 0.04, color: "orange"});
    this.world.nodes.push({name: "star2-nav", x: -0.55, y: -0.1, size: 0.02, color: "grey"});

    this.world.links.push({nodes: ["startStar", "startStar-nav"], cost: 0.1});
    this.world.links.push({nodes: ["startStar", "star2"], cost: 0.5});
    this.world.links.push({nodes: ["star2", "star2-nav"], cost: 0.2});

    // May have to put this stuff in a timeout if component load order becomes
    // an issue...
    this.el.emit("worldReady", this.world);
    this.el.emit("changeLocation", {node: this.world.nodes[0], cost: 0});
  }
});