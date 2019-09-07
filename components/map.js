AFRAME.registerComponent("map", {
  init: function () {
    const el = this.el;
    const sceneEl = el.sceneEl;

    // Only run once the scene has initialised
    sceneEl.addEventListener("loaded", function() {
      const logic = sceneEl.components.logic;
      const world = logic.world;
      console.log(world);

      for (let node of world.nodes) {
        const nodeEl = document.createElement("a-circle");
        nodeEl.setAttribute("color", node.color);
        nodeEl.setAttribute("geometry", {radius: node.size});
        nodeEl.setAttribute("position", {x: node.x, y: node.y, z: 0.002});
        el.appendChild(nodeEl);
      }

      for (let link of world.links) {
        const start = world.nodes.find(e=>e.name==link[0]);
        const end = world.nodes.find(e=>e.name==link[1]);

        const linkEl = document.createElement("a-entity");
        linkEl.setAttribute("line", {
          start: {x: start.x, y: start.y, z: start.z},
          end: {x: end.x, y: end.y, z: end.z},
          color: "#fff"
        });
        el.appendChild(linkEl);
      }
    });
  }
});