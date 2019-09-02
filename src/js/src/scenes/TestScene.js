function TestScene() {
  Scene.apply(this, arguments);
  var bg = new DisplayRect({
    w: SETTINGS.width,
    h: SETTINGS.height,
    color: '#333333'
  });
  this.addChild(bg);
  var speed = 100;
  var vel = { x: 0, y: 0 };
  var rect = this.rect = new DisplayRect({
    w: 10,
    h: 10,
    color: 'blue'
  });
  this.addChild(this.rect);
  this.keys = [];
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
  
  this.addSteppable(function (dts) {
    rect.x += vel.x * dts;
    rect.y += vel.y * dts;
  });
}
TestScene.prototype = extendPrototype(Scene.prototype, {
  destroy: function () {
    this.keys.forEach(function (key) {
      key.destroy();
    });
  }
});
