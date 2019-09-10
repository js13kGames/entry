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
    
    this.world.nodes.push({name: "startStar", x: 0, y: 0, size: 0.1, color: "yellow", scanned: true});
    this.world.nodes.push({name: "nav-startStar", x: 0.3, y: 0.1, size: 0.02, color: "grey", scanned: true});
    this.world.nodes.push({name: "star2", x: -0.5, y: -0.2, size: 0.04, color: "orange", scanned: false});
    this.world.nodes.push({name: "nav-star2", x: -0.55, y: -0.1, size: 0.02, color: "grey", scanned: false});
    this.world.nodes.push({name: "star3", x: -0.3, y: 0.2, size: 0.05, color: "yellow", scanned: false});
    this.world.nodes.push({name: "nav-star3", x: -0.25, y: 0.1, size: 0.02, color: "grey", scanned: false});

    this.world.links.push({nodes: ["startStar", "nav-startStar"], cost: 0.1});
    this.world.links.push({nodes: ["startStar", "star2"], cost: 0.5});
    this.world.links.push({nodes: ["star2", "nav-star2"], cost: 0.2});
    this.world.links.push({nodes: ["star2", "star3"], cost: 0.2});
    this.world.links.push({nodes: ["star3", "nav-star3"], cost: 0.2});

    // May have to put this stuff in a timeout if component load order becomes
    // an issue...
    this.el.emit("updateWorld", this.world);
    this.el.emit("changeLocation", {node: this.world.nodes[0], cost: 0});
  }
});