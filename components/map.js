AFRAME.registerComponent("map", {
  init: function () {
    console.log("map init");

    const el = this.el;
    const sceneEl = el.sceneEl;
    const mapObjects = this.el.querySelector("#mo");

    const shipEl = sceneEl.querySelector("#ship");
    let ship;
    shipEl.addEventListener("loaded", e => ship = shipEl.components.ship);

    let offset = {x: 0, y: 0};
    let world;

    function draw() {
      console.log("drawing map");
      mapObjects.innerHTML = "";

      for (let node of world.nodes) {
        if (node.scanned) {
          const nodeEl = document.createElement("a-circle");
          nodeEl.setAttribute("color", node.color);
          nodeEl.setAttribute("geometry", {radius: node.size});
          nodeEl.setAttribute("position", {x: node.x + offset.x, y: node.y + offset.y, z: 0.002});
          nodeEl.className = "clickable";
          nodeEl.addEventListener("click", e => {
            const jumpLink = world.links.find(l => l.nodes.includes(node.name) && l.nodes.includes(ship.location.name));
            if (ship.location != node && jumpLink) {
              nodeEl.emit("changeTarget", {node: node, cost: jumpLink.cost});
            }
          });
          mapObjects.appendChild(nodeEl);
        }
      }

      for (let link of world.links) {
        const start = findByName(world.nodes, link.nodes[0]);
        const end = findByName(world.nodes, link.nodes[1]);

        if (start.scanned && end.scanned) {
          const linkEl = document.createElement("a-entity");
          const aj = end.x - start.x;
          const op = end.y - start.y;
          linkEl.setAttribute("geometry", {
            primitive: "plane",
            width: 0.01,
            height: Math.sqrt(aj*aj + op*op)
          });
          linkEl.object3D.position.set(start.x + aj/2 + offset.x, start.y + op/2 + offset.y, 0.001);
          linkEl.object3D.rotation.z = Math.atan2(op, aj) - Math.PI / 2;
          linkEl.setAttribute("material", {color: "#fff"});
          mapObjects.appendChild(linkEl);
        }
      }
    }

    sceneEl.addEventListener("updateWorld", e => {
      world = e.detail;
      draw();
    });

    const locationEl = this.el.querySelector("#location");
    this.el.sceneEl.addEventListener("changeLocation", e => {
      const n = e.detail.node;

      if (n) {
        offset = {x: -n.x, y: -n.y};
        draw();

        locationEl.object3D.position.set(n.x, n.y, .003);
        locationEl.object3D.visible = true;

        const off = Math.max(n.size + 0.01, 0.03);
        const a = off - 0.01;

        locationEl.children[0].object3D.position.set(a + offset.x, off + offset.y, 0);
        locationEl.children[1].object3D.position.set(off + offset.x, a + offset.y, 0);

        locationEl.children[2].object3D.position.set(a + offset.x, -off + offset.y, 0);
        locationEl.children[3].object3D.position.set(off + offset.x, -a + offset.y, 0);

        locationEl.children[4].object3D.position.set(-a + offset.x, -off + offset.y, 0);
        locationEl.children[5].object3D.position.set(-off + offset.x, -a + offset.y, 0);

        locationEl.children[6].object3D.position.set(-a + offset.x, off + offset.y, 0);
        locationEl.children[7].object3D.position.set(-off + offset.x, a + offset.y, 0);
      } else {
        locationEl.object3D.visible = false;
      }
    });

    const targetEl = this.el.querySelector("#target");
    this.el.sceneEl.addEventListener("changeTarget", e => {
      const n = e.detail.node;

      if (n) {
        targetEl.object3D.position.set(n.x, n.y, .003);
        targetEl.object3D.visible = true;

        const off = Math.max(n.size + 0.02, 0.03);
        targetEl.children[0].object3D.position.set(0 + offset.x, off + offset.y, 0);
        targetEl.children[1].object3D.position.set(off + offset.x, 0 + offset.y, 0);
        targetEl.children[2].object3D.position.set(0 + offset.x, -off + offset.y, 0);
        targetEl.children[3].object3D.position.set(-off + offset.x, 0 + offset.y, 0);
      } else {
        targetEl.object3D.visible = false;
      }
    });
  }
});