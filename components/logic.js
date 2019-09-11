AFRAME.registerComponent("logic", {
  init: function () {
    console.log("logic init");

    const el = this.el;
    const $ = x => el.querySelector(x);

    // This listener allows for vibration on all touches
    el.addEventListener("touchstart", e => {
      navigator.vibrate(10);
    });

    /*
      Clipping plane
    */
    el.renderer.localClippingEnabled = true;

    var clipPlanes = [
      new THREE.Plane(new THREE.Vector3(0, 0, 1), 0.74),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.74),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.74),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.77)
    ];

    // var helpers = new THREE.Group();
    // helpers.add(new THREE.PlaneHelper(clipPlanes[0], 2, 0xff0000));
    // helpers.add(new THREE.PlaneHelper(clipPlanes[1], 2, 0x00ff00));
    // helpers.add(new THREE.PlaneHelper(clipPlanes[2], 2, 0x0000ff));
    // helpers.add(new THREE.PlaneHelper(clipPlanes[3], 2, 0xffff00));
    // el.object3D.add(helpers);

    /*
      World generation
    */
    let world = {
      nodes: [],
      links: []
    };

    const findNode = name => world.nodes.find(n => n.name === name);
    const findLink = (a, b) => world.links.find(l => l.nodes.includes(a.name) && l.nodes.includes(b.name));
    const filterLinks = a => world.links.filter(l => l.nodes.includes(a));
    
    world.nodes.push({name: "startStar", x: 0, y: 0, size: 0.1, color: "yellow", scanned: true, fuel: true});
    world.nodes.push({name: "nav-startStar", x: 0.3, y: 0.1, size: 0.02, color: "grey", scanned: true, fuel: false});
    world.nodes.push({name: "star2", x: -0.5, y: -0.2, size: 0.04, color: "orange", scanned: false, fuel: false});
    world.nodes.push({name: "nav-star2", x: -0.55, y: -0.1, size: 0.02, color: "grey", scanned: false, fuel: false});
    world.nodes.push({name: "star3", x: -0.3, y: 0.2, size: 0.05, color: "yellow", scanned: false, fuel: false});
    world.nodes.push({name: "nav-star3", x: -0.25, y: 0.1, size: 0.02, color: "grey", scanned: false, fuel: false});

    world.links.push({nodes: ["startStar", "nav-startStar"], cost: 0.1});
    world.links.push({nodes: ["startStar", "star2"], cost: 0.5});
    world.links.push({nodes: ["star2", "nav-star2"], cost: 0.2});
    world.links.push({nodes: ["star2", "star3"], cost: 0.2});
    world.links.push({nodes: ["star3", "nav-star3"], cost: 0.2});


    /*
      Ship
    */
    const ship = {
      location: world.nodes[0],
      target: null,
      fuel: 0.8,
      scoopDeployed: false
    }

    function changeTarget(node, cost) {
      ship.target = node;
      drawTarget();
      checkLaunchReady();
      drawGuage(jumpCostGuage, cost);
    }

    function changeLocation(node, cost) {
      ship.location = node;
      changeTarget(null, 0);
      ship.fuel -= cost;
      mapOffset = {x: -node.x, y: -node.y};
      drawMap();
      drawLocation();
      drawTarget();
      drawGuage(fuelGuage, ship.fuel);
      
      if (ship.fuel <= 0) {
        // TODO: implement game over logic
        console.log("GAME OVER");
      }
    }

    function toggleScoop() {
      ship.scoopDeployed = !ship.scoopDeployed;
      fuelGuage.setAttribute("color", ship.scoopDeployed ? (ship.location.fuel ? "yellow" : "red") : "green");
      checkLaunchReady();
    }

    function launch() {
      if (ship.target) {
        const jumpCost = findLink(ship.target, ship.location).cost;
        changeLocation(ship.target, jumpCost);
        checkLaunchReady();
      }
    }

    function scan() {
      const name = ship.location.name;

      // If we are at the nav-beacon, scan nearby stars
      // Else scan for the nav-beacon of this star
      if (name.startsWith("nav")) {
        const starName = name.split("nav-")[1];
                      
        const links = filterLinks(starName);
        for (let link of links) {
          for (let node of link.nodes) {
            world.nodes[world.nodes.indexOf(findNode(node))].scanned = true;
          }
        }
      } else {
        const navName = `nav-${name}`;
        if (findNode(navName)) {
          world.nodes[world.nodes.indexOf(findNode(navName))].scanned = true;
        }
      }
      drawMap();
    }

    // On the object so it can be accessed from the tick function
    this.updateFuel = change => {
      if (ship.scoopDeployed && ship.location.fuel) {
        ship.fuel = Math.min(ship.fuel + change, 1);
        drawGuage(fuelGuage, ship.fuel);
      }
    }


    /*
      Launch button
    */
    const launchButton = $("#launchButton");
    launchButton.addEventListener("click", e => launch());

    function checkLaunchReady() {
      if (ship.target && !ship.scoopDeployed) {
        launchButton.removeState("pressed");
      } else {
        launchButton.addState("pressed");
      }
    }


    /*
      Fuel-scoop button
    */
    const scoopButton = $("#scoopButton");
    scoopButton.addEventListener("click", e => toggleScoop());


    /*
      Scan button
    */
    const scanButton = $("#scanButton");
    scanButton.addEventListener("click", e => scan());


    /*
      Fuel guages
    */
    const fuelGuage = $("#fuelGuage");
    const jumpCostGuage = $("#jumpCostGuage");

    function drawGuage(guageEl, percent) {
      guageEl.setAttribute("height", 0.5 * percent);
      guageEl.object3D.position.y = 0.25 * (percent - 1);
      guageEl.object3D.visible = percent > 0;
    }


    /*
      Map
    */
    const mapObjects = $("#mapObjects");
    const locationEl = $("#location");
    const targetEl = $("#target");
    let mapOffset = {x: 0, y: 0};

    function drawMap() {
      mapObjects.innerHTML = "";

      for (let node of world.nodes) {
        if (node.scanned) {
          const nodeEl = document.createElement("a-circle");
          nodeEl.setAttribute("color", node.color);
          nodeEl.setAttribute("geometry", {radius: node.size});
          nodeEl.setAttribute("position", {x: node.x + mapOffset.x, y: node.y + mapOffset.y, z: 0.002});
          nodeEl.className = "clickable";
          nodeEl.addEventListener("click", e => {
            const jumpLink = world.links.find(l => l.nodes.includes(node.name) && l.nodes.includes(ship.location.name));
            if (ship.location != node && jumpLink) {
              changeTarget(node, jumpLink.cost);
            }
          });
          nodeEl.addEventListener("loaded", e => {
            nodeEl.object3DMap.mesh.material.clippingPlanes = clipPlanes;
            nodeEl.object3DMap.mesh.material.clipIntersection = false;
          });
          mapObjects.appendChild(nodeEl);
        }
      }

      for (let link of world.links) {
        const start = findNode(link.nodes[0]);
        const end = findNode(link.nodes[1]);

        if (start.scanned && end.scanned) {
          const linkEl = document.createElement("a-entity");
          const aj = end.x - start.x;
          const op = end.y - start.y;
          linkEl.setAttribute("geometry", {
            primitive: "plane",
            width: 0.01,
            height: Math.sqrt(aj * aj + op * op)
          });
          linkEl.object3D.position.set(start.x + aj/2 + mapOffset.x, start.y + op/2 + mapOffset.y, 0.001);
          linkEl.object3D.rotation.z = Math.atan2(op, aj) - Math.PI / 2;
          linkEl.setAttribute("material", { color: "#fff" });
          linkEl.addEventListener("loaded", e => {
            linkEl.object3DMap.mesh.material.clippingPlanes = clipPlanes;
            linkEl.object3DMap.mesh.material.clipIntersection = false;
          });
          mapObjects.appendChild(linkEl);
        }
      }
    }

    function drawLocation() {
      const n = ship.location;
      if (n) {
        locationEl.object3D.position.set(n.x, n.y, .003);
        locationEl.object3D.visible = true;

        const off = Math.max(n.size + 0.01, 0.03);
        const a = off - 0.01;

        locationEl.children[0].object3D.position.set(a + mapOffset.x, off + mapOffset.y, 0);
        locationEl.children[1].object3D.position.set(off + mapOffset.x, a + mapOffset.y, 0);

        locationEl.children[2].object3D.position.set(a + mapOffset.x, -off + mapOffset.y, 0);
        locationEl.children[3].object3D.position.set(off + mapOffset.x, -a + mapOffset.y, 0);

        locationEl.children[4].object3D.position.set(-a + mapOffset.x, -off + mapOffset.y, 0);
        locationEl.children[5].object3D.position.set(-off + mapOffset.x, -a + mapOffset.y, 0);

        locationEl.children[6].object3D.position.set(-a + mapOffset.x, off + mapOffset.y, 0);
        locationEl.children[7].object3D.position.set(-off + mapOffset.x, a + mapOffset.y, 0);
      } else {
        locationEl.object3D.visible = false;
      }
    }

    function drawTarget() {
      const n = ship.target;
      if (n) {
        targetEl.object3D.position.set(n.x, n.y, .003);
        targetEl.object3D.visible = true;

        const off = Math.max(n.size + 0.02, 0.03);
        targetEl.children[0].object3D.position.set(0 + mapOffset.x, off + mapOffset.y, 0);
        targetEl.children[1].object3D.position.set(off + mapOffset.x, 0 + mapOffset.y, 0);
        targetEl.children[2].object3D.position.set(0 + mapOffset.x, -off + mapOffset.y, 0);
        targetEl.children[3].object3D.position.set(-off + mapOffset.x, 0 + mapOffset.y, 0);
      } else {
        targetEl.object3D.visible = false;
      }
    }

    drawMap();
    drawLocation();
    drawTarget();
    drawGuage(fuelGuage, ship.fuel);
    drawGuage(jumpCostGuage, 0);
  }, 

  tick: function(time, timeDelta) {
    this.updateFuel(0.05 * timeDelta / 1000);
  }
});