AFRAME.registerComponent("map", {
  init: function () {
    console.log("map init");

    const el = this.el;
    const sceneEl = el.sceneEl;

    const shipEl = sceneEl.querySelector("#ship");
    let ship;
    shipEl.addEventListener("loaded", e => ship = shipEl.components.ship);

    sceneEl.addEventListener("worldReady", e => {
      const world = e.detail;
      console.log(world);

      for (let node of world.nodes) {
        const nodeEl = document.createElement("a-circle");
        nodeEl.setAttribute("color", node.color);
        nodeEl.setAttribute("geometry", {radius: node.size});
        nodeEl.setAttribute("position", {x: node.x, y: node.y, z: 0.002});
        nodeEl.className = "clickable";
        nodeEl.addEventListener("click", e => {
          if (ship.location != node) {
            nodeEl.emit("changeTarget", node);
          }
        });
        el.appendChild(nodeEl);
      }

      for (let link of world.links) {
        const start = world.nodes.find(n=>n.name==link[0]);
        const end = world.nodes.find(n=>n.name==link[1]);
        console.log(start, end);

        const linkEl = document.createElement("a-entity");
        const aj = end.x - start.x;
        const op = end.y - start.y;
        linkEl.setAttribute("geometry", {
          primitive: "plane",
          width: 0.01,
          height: Math.sqrt(aj*aj + op*op)
        });
        linkEl.object3D.position.set(start.x + aj/2, start.y + op/2, 0.001);
        linkEl.object3D.rotation.z = Math.atan2(op, aj) - Math.PI / 2;
        linkEl.setAttribute("material", {color: "#fff"});
        el.appendChild(linkEl);
      }
    });
  }
});