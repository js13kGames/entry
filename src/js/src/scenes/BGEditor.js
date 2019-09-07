/*
Not included in prod/dist
*/

function BGEditor() {
  Scene.apply(this, arguments);
  var sky = new DisplayRect({
    w: SETTINGS.width,
    h: SETTINGS.height,
    color: '#333333'
  });
  this.addChild(sky);

  this.scrollLayer = new DisplayContainer();
  this.addChild(this.scrollLayer);

  this.bg = new BG();
  this.scrollLayer.addChild(this.bg);

  var reticle = new DisplayCirc({
    x: SETTINGS.width / 2,
    y: SETTINGS.height / 2,
    radius: 2,
    color: 'black'
  });
  this.addChild(reticle);

  var speed = 100;
  var vel = { x: 0, y: 0 };
  this.keys = [];
  var rocks = [];
  var currentRock = null;

  var updateCurrentRock = function () {
    if (!currentRock) return;

    currentRock.x = Math.floor(-this.scrollLayer.x + reticle.x);
    currentRock.y = Math.floor(-this.scrollLayer.y + reticle.y);
  }.bind(this);

  var commitCurrentRock = function () {
    if (!currentRock) return;

    rocks.push({
      x: currentRock.x,
      y: currentRock.y,
      radius: currentRock.radius,
      color: currentRock.color
    });
    currentRock = null;
  };

  var initCurrentRock = function () {
    if (currentRock) return;

    currentRock = new DisplayCirc({
      radius: 10,
      color: 'gray'
    });
    this.scrollLayer.addChild(currentRock);
    updateCurrentRock();
  }.bind(this);

  this.aKey = KB(KB.keys.a, function () {
    vel.x += -speed;
  }, function () {
    vel.x -= -speed;
  });
  this.keys.push(this.aKey);
  this.sKey = KB(KB.keys.s, function () {
    vel.y += speed;
  }, function () {
    vel.y -= speed;
  });
  this.keys.push(this.sKey);
  this.dKey = KB(KB.keys.d, function () {
    vel.x += speed;
  }, function () {
    vel.x -= speed;
  });
  this.keys.push(this.dKey);
  this.wKey = KB(KB.keys.w, function () {
    vel.y += -speed;
  }, function () {
    vel.y -= -speed;
  });
  this.keys.push(this.wKey);

  this.qKey = KB(81, function () {
    initCurrentRock();
    currentRock.radius -= 5;
    if (currentRock.radius < 5) {
      currentRock.radius = 5;
    }
  });
  this.keys.push(this.qKey);

  this.eKey = KB(69, function () {
    initCurrentRock();
    currentRock.radius += 5;
  });
  this.keys.push(this.eKey);

  this.rKey = KB(82, function () {
    var output = rocks.map(function (rock) {
      var json = JSON.stringify(rock, null, 2);
      json = json.replace(/"([a-zA-Z0-9]+)":/g, '$1:');
      json = json.replace(/"/g, "'");
      return 'new DisplayCirc(' + json + ')';
    }).join(",\n");
    console.log(output);
  });
  this.keys.push(this.rKey);

  this.cKey = KB(67, function () {
    commitCurrentRock();
  });
  this.keys.push(this.cKey);
  
  this.addSteppable(function (dts) {
    this.scrollLayer.x -= vel.x * dts;
    this.scrollLayer.y -= vel.y * dts;
    updateCurrentRock();
  }.bind(this));
}
BGEditor.prototype = extendPrototype(Scene.prototype, {
  destroy: function () {
    this.keys.forEach(function (key) {
      key.destroy();
    });
  }
});
