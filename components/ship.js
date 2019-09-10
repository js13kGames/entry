function setBar(barEl, percent) {
  barEl.setAttribute("height", Math.max(0.5 * percent, .0001));
  barEl.object3D.position.y = 0.25 * (percent - 1);
}
    
AFRAME.registerComponent('ship', {
  schema: {},

  init: function () {
    console.log("ship init");

    const el = this.el;
    const sceneEl = el.sceneEl;
    const fuelGuage = el.querySelector("#fuelGuage");
    const jumpGuage = el.querySelector("#jumpGuage");

    let world;

    this.target = null;
    this.location = null;
    this.fuel = 0.8;
    this.scoopDeployed = false;

    setBar(fuelGuage, this.fuel);
    setBar(jumpGuage, 0);

    sceneEl.addEventListener("changeTarget", e => {
      console.log("Changing target to", e.detail.node, e.detail.cost);
      this.target = e.detail.node;
      setBar(jumpGuage, e.detail.cost);
    });

    sceneEl.addEventListener("changeLocation", e => {
      console.log("Changing location to", e.detail.node, e.detail.cost);
      this.location = e.detail.node;
      this.fuel -= e.detail.cost;
      setBar(fuelGuage, this.fuel);
      if (this.fuel <= 0) {
        console.log("GAME OVER");
        // TODO: Game over logic
      }
    });

    sceneEl.addEventListener("updateWorld", e => {
      world = e.detail;
      this.location = world.nodes[0];
    });

    sceneEl.addEventListener("toggleScoop", e => {
      console.log("Scoop");
      this.scoopDeployed = !this.scoopDeployed;
      fuelGuage.setAttribute("color", this.scoopDeployed ? "yellow" : "green");
    });

    sceneEl.addEventListener("scan", e => {
      console.log("trying to scan");
      const name = this.location.name;
      if (name.startsWith("nav")) {
        const starName = name.split("nav-")[1];
        const links = world.links.filter(l => l.nodes.includes(starName));
        for (let link of links) {
          for (let node of link.nodes) {
            world.nodes[world.nodes.indexOf(findByName(world.nodes, node))].scanned = true;
          }
        }
      }
      console.log(world);
      sceneEl.emit("updateWorld", world);
    });
  },

  tick: function(time, timeDelta) {
    if (this.scoopDeployed) {
      this.fuel = Math.min(this.fuel + 0.05 * timeDelta / 1000, 1);
      setBar(fuelGuage, this.fuel);
    }
  }
});