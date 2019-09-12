AFRAME.registerComponent("logic", {
  init: function() {
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
      Start menu
    */
    const mask = $("#mask");
    const game = $("#game");
    const startMenu = $("#startMenu");
    const playButton = $("#playButton");
    const cursor = $("#cursor");

    function resetGame() {
      createWorld();

      ship.location = world.nodes[0];
      ship.target = null;
      ship.fuel = 1;
      ship.scoopDeployed = false;

      mapOffset = { x: 0, y: 0 };

      drawMap();
      drawLocation();
      drawTarget();
      drawGuage(fuelGuage, ship.fuel);
      drawGuage(jumpCostGuage, 0);
    }

    // Comment out to skip start menu
    game.setAttribute("visible", false);
    startMenu.setAttribute("visible", true);
    cursor.setAttribute("raycaster", {objects: "#startMenu .clickable"});

    playButton.addEventListener("click", e => {
      mask.emit("fadeOut");
      cursor.setAttribute("raycaster", {objects: "#game .clickable"});
      setTimeout(() => {
        resetGame();
        startMenu.setAttribute("visible", false);
        game.setAttribute("visible", true);
        mask.emit("fadeIn");
      }, 2000);
    });

    /*
      Game Over Menu
    */
    const gameOverMenu = $("#gameOverMenu");
    const retryButton = $("#retryButton");

    function gameOver() {
      mask.emit("fadeOut");
      cursor.setAttribute("raycaster", {objects: "#gameOverMenu .clickable"});
      setTimeout(() => {
        resetGame();
        game.setAttribute("visible", false);
        gameOverMenu.setAttribute("visible", true);
        mask.emit("fadeIn");
      }, 1500);
    }

    retryButton.addEventListener("click", e => {
      mask.emit("fadeOut");
      cursor.setAttribute("raycaster", {objects: "#game .clickable"});
      setTimeout(() => {
        gameOverMenu.setAttribute("visible", false);
        game.setAttribute("visible", true);
        mask.emit("fadeIn");
      }, 2000);
    });

    /*
      Win Menu
    */
    const winMenu = $("#winMenu");
    const playAgainButton = $("#playAgainButton");

    function win() {
      mask.emit("fadeOut");
      cursor.setAttribute("raycaster", {objects: "#winMenu .clickable"});
      setTimeout(() => {
        resetGame();
        game.setAttribute("visible", false);
        winMenu.setAttribute("visible", true);
        mask.emit("fadeIn");
      }, 1500);
    }

    playAgainButton.addEventListener("click", e => {
      mask.emit("fadeOut");
      cursor.setAttribute("raycaster", {objects: "#game .clickable"});
      setTimeout(() => {
        winMenu.setAttribute("visible", false);
        game.setAttribute("visible", true);
        mask.emit("fadeIn");
      }, 2000);
    });

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
    
    const newN = (name, x, y, size, color, fuel, reveals) => world.nodes.push({
      name: name, x: x, y: y, size: size, color: color, scanned: false, fuel: fuel, reveals: reveals});
    const newL = (nodes, cost) => world.links.push({nodes: nodes, cost: cost});

    function createWorld() {
      world.nodes = [];
      world.links = [];

      newN("start", 0, 0, 8, "yellow", true, []);
      world.nodes[0].scanned = true;
      newN("nav-start", 2, 2, 4, "grey", false, [2, 3, 4, 5]);
      world.nodes[1].scanned = true;
      newN("2", 3, -1, 4, "orange", false, []);
      newN("3", 2, -3, 5, "yellow", true, []);
      newN("4", 2.5, -6, 7, "yellow", true, []);
      newN("nav-4", 3, -8, 4, "grey", false, [6, 7, 8, 21, 22, 23, 24, 25]);
      newN("6", 0, -6.5, 3, "orange", false, []);
      newN("7", 0, -10, 6, "yellow", true, []);
      newN("nav-7", 1.5, -12, 4, "grey", false, [9, 10, 11, 12, 13]);
      newN("9", -1.5, -14, 4, "orange", false, []);
      newN("10", -5, -14, 8, "yellow", true, []);
      newN("11", -3, -17, 6, "yellow", true, []);
      newN("nav-11", -1, -19, 4, "grey", false, [14, 15]);
      newN("13", 1, -16, 4, "orange", false, []);
      newN("14", 6, -15, 9, "yellow", true, []);
      newN("nav-14", 8, -14, 4, "grey", false, [16, 17, 18, 27, 28]);
      newN("16", 10, -15.5, 3.5, "orange", false, []);
      newN("17", 9, -18, 7, "yellow", true, []);
      newN("nav-17", 11, -17.5, 4, "grey", false, [19, 20]);
      newN("19", 13, -19, 4, "orange", false, []);
      newN("finish", 16, -15, 3, "lightblue", false, []);
      newN("21", 6.5, -3, 3, "orange", false, []);
      newN("22", 7, -6, 5, "yellow", true, []);
      newN("23", 9, -4.5, 4, "orange", false, []);
      newN("24", 6, -9, 3.5, "orange", false, []);
      newN("nav-24", 6, -10.5, 4, "grey", false, [7, 8, 26, 27, 28]);
      newN("26", 10, -8, 7, "yellow", true, []);
      newN("27", 8, -12, 5, "orange", false, []);
      newN("nav-27", 9.5, -11.5, 4, "grey", false, [14, 15, 29, 30, 31]);
      newN("29", 11, -12, 9, "yellow", true, []);
      newN("30", 14, -10, 4, "orange", 2, []);
      newN("nav-30", 14, -8, 4, "grey", false, [32, 20]);
      newN("32", 17, -11, 7, "yellow", true, []);
  
      newL(["start", "nav-start"], 0.1);
      newL(["start", "2"], 0.4);
      newL(["2", "3"], 0.3);
      newL(["3", "4"], 0.4);
      newL(["4", "nav-4"], 0.2);
      newL(["4", "6"], 0.3);
      newL(["6", "7"], 0.4);
      newL(["7", "nav-7"], 0.15);
      newL(["7", "9"], 0.5);
      newL(["9", "10"], 0.2);
      newL(["9", "11"], 0.4);
      newL(["11", "13"], 0.3);
      newL(["9", "13"], 0.3);
      newL(["11", "nav-11"], 0.2);
      newL(["13", "14"], 0.5);
      newL(["14", "nav-14"], 0.05);
      newL(["14", "16"], 0.3);
      newL(["16", "17"], 0.3);
      newL(["17", "nav-17"], 0.1);
      newL(["17", "19"], 0.4);
      newL(["19", "finish"], 0.4);
      newL(["4", "22"], 0.4);
      newL(["22", "21"], 0.3);
      newL(["21", "23"], 0.3);
      newL(["22", "23"], 0.3);
      newL(["22", "24"], 0.35);
      newL(["24", "nav-24"], 0.1);
      newL(["24", "7"], 0.7);
      newL(["24", "26"], 0.5);
      newL(["24", "27"], 0.4);
      newL(["26", "27"], 0.5);
      newL(["27", "nav-27"], 0.1);
      newL(["27", "14"], 0.4);
      newL(["27", "29"], 0.3);
      newL(["29", "30"], 0.3);
      newL(["29", "16"], 0.5);
      newL(["30", "nav-30"], 0.1);
      newL(["30", "32"], 0.4);
      newL(["32", "finish"], 0.6);
    }

    // world.nodes.push({name: "startStar", x: 0, y: 0, size: 10, color: "yellow", scanned: true, fuel: true});
    // world.nodes.push({name: "nav-startStar", x: 3, y: 1, size: 4, color: "grey", scanned: true, fuel: false, reveals: [2, 3, 4, 5]});
    // world.nodes.push({name: "star2", x: -5, y: -2, size: 4, color: "orange", scanned: false, fuel: false});
    // world.nodes.push({name: "nav-star2", x: -5.5, y: -1, size: 4, color: "grey", scanned: false, fuel: false});
    // world.nodes.push({name: "star3", x: -3, y: 2, size: 5, color: "yellow", scanned: false, fuel: false});
    // world.nodes.push({name: "nav-star3", x: -2.5, y: 1, size: 4, color: "grey", scanned: false, fuel: false});
    

    // world.links.push({nodes: ["startStar", "nav-startStar"], cost: 0.1});
    // world.links.push({nodes: ["startStar", "star2"], cost: 0.5});
    // world.links.push({nodes: ["star2", "nav-star2"], cost: 0.2});
    // world.links.push({nodes: ["star2", "star3"], cost: 0.2});
    // world.links.push({nodes: ["star3", "nav-star3"], cost: 0.2});

    /*
      Ship
    */
    const ship = {
      location: world.nodes[0],
      target: null,
      fuel: 1,
      scoopDeployed: false
    };

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
      mapOffset = { x: -node.x / 10, y: -node.y / 10 };
      drawMap();
      drawLocation();
      drawTarget();
      drawGuage(fuelGuage, ship.fuel);
      
      if (ship.fuel <= 0) {
        gameOver();
      }

      if (ship.location.name === "finish") {
        win();
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
      const reveals = findNode(name).reveals;

      if (reveals) {
        for (let i of reveals) {
          world.nodes[i].scanned = true;
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
    };

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
    let mapOffset = { x: 0, y: 0 };

    function drawMap() {
      mapObjects.innerHTML = "";

      for (let node of world.nodes) {
        if (node.scanned) {
          let nodeEl;
          const s = node.size / 100;
          if (node.name.startsWith("nav-")) {
            nodeEl = document.createElement("a-triangle");
            nodeEl.setAttribute("scale", {x: s * 1.5, y: s * 1.5, z: 1});
          } else {
            nodeEl = document.createElement("a-circle");
            nodeEl.setAttribute("geometry", {radius: s});
          }
          nodeEl.setAttribute("color", node.color);
          nodeEl.setAttribute("position", {x: node.x / 10 + mapOffset.x, y: node.y / 10 + mapOffset.y, z: 0.002});
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
            nodeEl.object3DMap.mesh.material.clipShadows = true;
          });
          mapObjects.appendChild(nodeEl);
        }
      }

      for (let link of world.links) {
        const start = findNode(link.nodes[0]);
        const end = findNode(link.nodes[1]);

        if (start.scanned && end.scanned) {
          const linkEl = document.createElement("a-entity");
          const aj = (end.x - start.x) / 10;
          const op = (end.y - start.y) / 10;
          linkEl.setAttribute("geometry", {
            primitive: "plane",
            width: 0.01,
            height: Math.sqrt(aj * aj + op * op)
          });
          linkEl.object3D.position.set(start.x / 10 + aj/2 + mapOffset.x, start.y / 10 + op/2 + mapOffset.y, 0.001);
          linkEl.object3D.rotation.z = Math.atan2(op, aj) - Math.PI / 2;
          linkEl.setAttribute("material", { color: "#fff" });
          linkEl.addEventListener("loaded", e => {
            linkEl.object3DMap.mesh.material.clippingPlanes = clipPlanes;
            linkEl.object3DMap.mesh.material.clipIntersection = false;
            linkEl.object3DMap.mesh.material.clipShadows = true;
          });
          mapObjects.appendChild(linkEl);
        }
      }
    }

    function drawLocation() {
      const n = ship.location;
      if (n) {
        locationEl.object3D.position.set(n.x / 10, n.y / 10, 0.003);
        locationEl.object3D.visible = true;

        const off = Math.max(n.size / 100 + 0.01, 0.03);
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
        targetEl.object3D.position.set(n.x / 10, n.y / 10, 0.003);
        targetEl.object3D.visible = true;

        const off = Math.max(n.size / 100 + 0.02, 0.03);
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
    this.updateFuel((0.1 * timeDelta) / 1000);
  }
});
