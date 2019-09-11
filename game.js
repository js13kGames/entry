// TODO: Levels
// TODO: Posters
// TODO: Level buttons
// TODO: universal buttons: https://github.com/MicrosoftDocs/webvr/blob/master/webvr-docs/input.md
const GameContainer = (function GameContainer() {
  const sceneEl = document.querySelector("a-scene");
  const world = document.getElementById("world").object3D;
  const blueGun = document.getElementById("blue-gun");
  const test = document.querySelector("a-cylinder");
  const gunEls = [].slice.apply(document.querySelectorAll("[data-gun]"));

  const sound = new ProceduralSample();

  function emit(name) {
    var parameters = Array.from(arguments).slice(1); // capture additional arguments
    if (parameters.length === 0) {
      sceneEl.dispatchEvent(new Event(name));
    } else {
      var event = document.createEvent("CustomEvent");
      // CustomEvent: name, canBubble, cancelable, detail
      event.initCustomEvent(name, true, true, parameters);
      sceneEl.dispatchEvent(event);
    }
  }

  // Listen shortcut to put everyone on the same element
  function listen(name, func) {
    sceneEl.addEventListener(
      name,
      function listenPass(e) {
        func.apply(null, e.detail);
      },
      false
    );
  }

  function unlisten(name, func) {
    sceneEl.removeEventListener(name, func);
  }

  function setText(textObj) {
    for (let id in textObj) {
      document.getElementById(id).setAttribute("value", textObj[id]);
    }
  }

  function loadLevel() {
  }

  const LEVELS = [];
  function setLevels(levels) {
    LEVELS.splice(0, LEVELS.length); // gut
    LEVELS.push(...levels); // set
    emit("levels-set");
  }

  const logEl = document.getElementById("log");
  function log(msg) {
    logEl.setAttribute("value", msg);
  }

  function closest(target, els) {
    try {
      const targetPos = target.object3D.getWorldPosition();
      function dist(el) {
        if (el.dataset.held === "true") {
          log("held " + el.id)
          return Infinity;
        }
        return el.object3D.getWorldPosition().distanceTo(targetPos);
      }
      let closest = els[0];
      let closestDist = dist(els[0]);
      for (let i = 1; i < els.length; i++) {
        const d = dist(els[i]);
        if (d < closestDist) {
          closest = els[i];
          closestDist = d;
        }
      }
      if (closestDist > 1) {
        return null;
      }
      return closest;
    } catch (e) {
      log(e);
    }
  }

  function setupTutorial(hand) {
    // Add shoot backside
    const shootBack = hand.querySelector(".tutorial-shoot").cloneNode();
    shootBack.setAttribute("rotation", "0 90 -40");
    hand.appendChild(shootBack);
    // Elements
    let grabEl = hand.querySelector(".tutorial-grab");
    let dropEl = hand.querySelector(".tutorial-drop");
    let shootEls = hand.querySelectorAll(".tutorial-shoot");
    let shot = false;
    // Events
    function grabDropCycle() {
      try {
        shootEls.forEach(el => el.setAttribute("opacity", inHand[hand.id] ? .5 : 1));
        if (grabEl) {
          hand.removeChild(grabEl);
          grabEl = false;
          dropEl.setAttribute("opacity", 1);
        } else if (dropEl) {
          hand.removeChild(dropEl);
          dropEl = null;
          if (shot) {
            hand.removeEventListener(this, grabDropCycle);
          }
        } else if (shot) {
          hand.removeEventListener(this, grabDropCycle);
        }
      } catch(e) {
        log(e);
      }
    }
    function shootCycle() {
      if (inHand[hand.id]) {
        shootEls.forEach(el => hand.removeChild(el));
        hand.removeEventListener("triggerdown", shootCycle);
        shot = true;
      }
    }
    hand.addEventListener("abuttondown", grabDropCycle.bind("abuttondown"), { passive: true });
    hand.addEventListener("xbuttondown", grabDropCycle.bind("xbuttondown"), { passive: true });
    hand.addEventListener("triggerdown", shootCycle, { passive: true });
  }

  let inHand = { "right-hand": null, "left-hand": null };
  function setupHand(hand) {
    setupTutorial(hand);
    function pickup(hand) {
      try {
        const newFriend = closest(hand, gunEls);
        if (newFriend === null) {
          return;
        }
        newFriend.object3D.matrix.copy(new THREE.Matrix4());
        newFriend.object3D.matrix.decompose(
          newFriend.object3D.position,
          newFriend.object3D.quaternion,
          newFriend.object3D.scale
        );
        hand.object3D.add( newFriend.object3D );
        newFriend.dataset.held = true;
        inHand[hand.id] = newFriend;
        hand.setAttribute("line", "opacity:1;color:" + newFriend.dataset.gun);
      } catch (e) {
        log(e);
      }
    }
    function drop(hand) {
      try {
        const carryEL = inHand[hand.id];
        const carryObj = carryEL.object3D;
        carryObj.matrix.premultiply( hand.object3D.matrixWorld );
        carryObj.matrix.premultiply( world.matrixWorld );
        carryObj.matrix.decompose(
          carryObj.position,
          carryObj.quaternion,
          carryObj.scale
        );
        world.add( carryObj );
        inHand[hand.id] = null;
        carryEL.dataset.held = false;
        hand.setAttribute("line", "opacity:0;color:purple");
      } catch (e) {
        log(e);
      }
    }
    function handleButton(hand) {
      if (inHand[hand.id]) {
        drop(hand);
      } else {
        pickup(hand);
      }
    }
    function handleTrigger(hand) {
      if (inHand[hand.id]) {
        sound.shoot();
      }
    }

    // TODO: select startstart, selectend
    // Oculus controls
    hand.addEventListener("abuttondown", _ => handleButton(hand), { passive: true });
    hand.addEventListener("xbuttondown", _ => handleButton(hand), { passive: true });
    hand.addEventListener("triggerdown", _ => handleTrigger(hand), { passive: true });
  }

  function colorMatch(gun, target) {
    if (gun === target) {
      return true;
    }
    switch(target) {
      case "orange":
        return gun === "red" || gun === "yellow";
      case "green":
        return gun === "blue" || gun === "yellow";
      case "purple":
        return gun === "red" || gun === "blue";
    }
    return false;
  }

  function bindTarget(target) {
    // Trigger press
    // - Spin buttons
    if (target.classList.contains("spin-control")) {
      target.addEventListener("mousedown", () => {
        maskT = target.dataset.rotation/360 * 2 * Math.PI
        setTimeout(_ => {
          world.rotation.y = target.dataset.rotation/360 * 2 * Math.PI;
        }, 500);
      }, { passive: true });
    // Targets
    } else if (typeof target.dataset.type !== "undefined") {
      target.addEventListener("mousedown", event => {
        const shotBy = inHand[event.detail.cursorEl.id];
        if (
          typeof shotBy.dataset.gun === "undefined" ||
          !colorMatch(shotBy.dataset.gun, target.dataset.type)
        ) {
          return;
        }
        target.parentNode.removeChild(target);
      }, { passive: true });
    }

    target.addEventListener("raycaster-intersected", () => {
      // target.setAttribute("color", "orange")
    }, { passive: true });
  }

  const rangeEl = document.getElementById("range");
  function makeTarget(op) {
    const el = document.createElement("a-cylinder");
    el.className = "target";
    el.setAttribute("color", op.color || op.type || "white");
    el.setAttribute("scale", ".25 .05 .25");
    if (op.type) {
      el.dataset.type = op.type;
    }
    if (typeof op.position === "undefined") {
      // Random position
      const z = Math.random() * 4 + 1;
      const x = Math.random() * 6 - 3;
      el.setAttribute("position", x + " 2 " + z);
    } else {
      el.setAttribute("position", op.position);
    }
    el.setAttribute("rotation", "90 0 0");
    bindTarget(el);
    rangeEl.appendChild(el);
    return el;
  }

  let lastFrame = 0;
  let lastTarget = 0;
  let targets = [makeTarget({type: "red"})];
  const start = Date.now();

  let maskA = 0;
  let maskT = 0;
  const maskEl = document.getElementById("mask");
  document.addEventListener("keyup", _ => maskT = maskT > 0 ? 0 : Math.PI, false);

  function loop() {
    requestAnimationFrame(loop);
    const now = Date.now() - start;
    const delta = (now - lastFrame) / 1000;
    // log(delta + " (" + Math.floor(1/delta) + "fps)");

    const interval = 200;
    if (now - lastTarget > interval) {
      targets.push(makeTarget({type: "red"}));
      lastTarget += interval;
    }

    if (maskA > maskT) {
      console.log(maskA, maskT);
      maskA -= Math.min(delta * Math.PI, maskA - maskT);
    }
    if (maskA < maskT) {
      console.log(maskA, maskT);
      maskA += Math.min(delta * Math.PI, maskT - maskA);
    }
    maskEl.object3D.position.y = Math.abs(Math.cos(maskA)) *  .5;
    maskEl.object3D.position.z = Math.abs(Math.sin(maskA)) * -.5 + .2;
    maskEl.object3D.rotation.x = Math.abs(Math.cos(maskA)) * Math.PI / 2;
    /*
    for (let target of targets) {
      target.object3D.position.x += .5 * delta;
    }*/

    lastFrame = now;
  }

  // Setup
  listen("levels-set", function setup() {
    setText(LEVELS[0].text);
    document.querySelectorAll("[oculus-touch-controls]").forEach(setupHand);
    document.querySelectorAll(".target").forEach(bindTarget);
    requestAnimationFrame(loop);
  });

  return { setLevels, setText }
})();

// expand THREE.js Sphere to support collision tests vs Box3
// we are creating a vector outside the method scope to
// avoid spawning a new instance of Vector3 on every check

THREE.Sphere.__closest = new THREE.Vector3();
THREE.Sphere.prototype.intersectsBox = function(box) {
  // get box closest point to sphere center by clamping
  THREE.Sphere.__closest.set(this.center.x, this.center.y, this.center.z);
  THREE.Sphere.__closest.clamp(box.min, box.max);

  var distance = this.center.distanceToSquared(THREE.Sphere.__closest);
  return distance < this.radius * this.radius;
};

/*
  function getArrow(el) {
    return el.object3D.up.clone().applyEuler(el.object3D.rotation);
  }
  */
