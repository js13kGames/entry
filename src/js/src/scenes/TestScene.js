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

  this.groupText = new DisplayText({
    text: 'group anim',
    x: SETTINGS.width / 2,
    y: SETTINGS.height / 2
  });
  this.addChild(this.groupText);

  this.seqText = new DisplayText({
    text: 'seq anim',
    x: SETTINGS.width / 2,
    y: SETTINGS.height / 2
  });
  this.addChild(this.seqText);

  this.groupAnimOpts = {
    object: this.groupText,
    anims: [
      {
        onStep: function (adjusted, ratio, timeRatio, obj) {
          obj.x = adjusted;
        },
        from: SETTINGS.width / 2,
        to: SETTINGS.width / 2 + 200,
        duration: 1,
        timeFunction: Anim.easingFunctions.easeInOutCubic
      },
      {
        onStep: function (adjusted, ratio, timeRatio, obj) {
          obj.angle = adjusted;
        },
        from: 0,
        to: Math.PI * 2,
        duration: 1,
        timeFunction: Anim.easingFunctions.easeInOutCubic
      }
    ],
    onEnd: this.addGroupAnim.bind(this)
  };

  this.seqAnimOpts = {
    object: this.seqText,
    anims: [
      {
        onStep: function (adjusted, ratio, timeRatio, obj) {
          obj.x = adjusted;
        },
        from: SETTINGS.width / 2,
        to: SETTINGS.width / 2 + 200,
        duration: 1,
        timeFunction: Anim.easingFunctions.easeInOutCubic
      },
      {
        onStep: function (adjusted, ratio, timeRatio, obj) {
          obj.angle = adjusted;
        },
        from: 0,
        to: Math.PI * 2,
        duration: 1,
        timeFunction: Anim.easingFunctions.easeInOutCubic
      }
    ],
    onEnd: this.addSeqAnim.bind(this)
  };

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
  create: function () {
    this.addGroupAnim();
    this.addSeqAnim();
  },
  destroy: function () {
    this.keys.forEach(function (key) {
      key.destroy();
    });
  },
  addGroupAnim: function () {
    this.main.animManager.add(new AnimGroup({
      object: this.groupAnimOpts.object,
      anims: this.groupAnimOpts.anims.map(function (anim) {
        return new Anim(anim);
      }),
      onEnd: this.groupAnimOpts.onEnd
    }));
  },
  addSeqAnim: function () {
    this.main.animManager.add(new AnimSeq({
      object: this.seqAnimOpts.object,
      anims: this.seqAnimOpts.anims.map(function (anim) {
        return new Anim(anim);
      }),
      onEnd: this.seqAnimOpts.onEnd
    }));
  }
});
