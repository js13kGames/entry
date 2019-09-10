
function PlayScene() {
  Scene.apply(this, arguments);

  var rollMagnitude = 100;

  // to get the right arc length that will cover the roll length (2 * magnitude)
  this.shellRadius = 2 *rollMagnitude / Math.PI; 

  // rolling "line" and settings
  this.roll = {
    center: {
      x: 1750,
      y: 600 - this.shellRadius + 5
    },
    magnitude: rollMagnitude,
    damping: Math.pow(0.5, 1/60), // damp by this amount so it reaches this fraction by 1 second
    backMaxAccel: 400
  };

  // outro settings
  this.outroSettings = {
    left: {
      pivot: {
        x: this.roll.center.x - this.roll.magnitude,
        y: this.roll.center.y + this.shellRadius
      },
      pos: {
        min: -this.roll.magnitude,
        max: -this.roll.magnitude - this.shellRadius * JMath.PId2
      },
      angle: {
        min: JMath.PId2,
        max: 0
      },
      accel: -400,
      restitution: 0.5,
      corner: 1
    },
    right: {
      pivot: {
        x: this.roll.center.x + this.roll.magnitude,
        y: this.roll.center.y + this.shellRadius
      },
      pos: {
        min: this.roll.magnitude,
        max: this.roll.magnitude + this.shellRadius * JMath.PId2
      },
      angle: {
        min: 3 * Math.PI / 2,
        max: JMath.PI2
      },
      accel: 400,
      restitution: 0.5,
      corner: -1
    }
  };

  // rolling vars
  this.rollPos = 0;
  this.rollVel = 0;
  this.rollAccel = 0;
  this.dampingEnabled = true;

  // simulate rolling back due to gravity
  this.rollBackAccel = 0;

  // player's rolling force
  this.turtleAccel = 0;
  this.turtleAccelMagnitude = 20;

  // stopwatch
  this.playSeconds = 0;

  // tutorial keys
  this.tutorialKeys = [
    { left: 'A', right: 'D' },
    { left: 'Q', right: 'D' },
    { left: '←', right: '→' }
  ];
  this.tutorialKeyIndex = 0;
  this.tutorialKeyTimeLeft = 1;

  this.cameraPos = {
    x: 0,
    y: 0
  };

  this.outro = null;

  this.endHappyDelay = 0.5;

  this.currentCycle = null;
  this.state = null;
  this.stateMap = {};
  this.stateMap[PlayScene.states.idle] = this.cycleIdle.bind(this);
  this.stateMap[PlayScene.states.intro] = this.cycleIntro.bind(this);
  this.stateMap[PlayScene.states.waiting] = this.cycleWaiting.bind(this);
  this.stateMap[PlayScene.states.playing] = this.cyclePlaying.bind(this);
  this.stateMap[PlayScene.states.outro] = this.cycleOutro.bind(this);
  this.stateMap[PlayScene.states.end] = this.cycleEnd.bind(this);
}

PlayScene.states = {
  idle: 0,
  intro: 1,
  waiting: 2,
  playing: 3,
  outro: 4,
  end: 5
};

PlayScene.prototype = extendPrototype(Scene.prototype, {
  create: function () {
    var skyGradient = this.main.context.createLinearGradient(0, 0, 0, SETTINGS.height);
    skyGradient.addColorStop(0, 'lightskyblue');
    skyGradient.addColorStop(1, 'white');
    this.sky = new DisplayRect({
      w: SETTINGS.width,
      h: SETTINGS.height,
      color: skyGradient
    });
    this.addChild(this.sky);

    this.cloudLayer = new CloudLayer({
      minBound: {
        x: 0,
        y: 50
      },
      maxBound: {
        x: 1500,
        y: 150
      }
    });
    this.addChild(this.cloudLayer);

    this.scrollLayer = new DisplayContainer();
    this.addChild(this.scrollLayer);

    this.bg = new BG();
    this.scrollLayer.addChild(this.bg);
  
    this.turtle = new Turtle({
      x: 500,
      y: 395,
      angle: 0,
      shell: {
        radius: this.shellRadius
      },
      rollMagnitude: this.roll.magnitude
    });
    this.scrollLayer.addChild(this.turtle);

    this.timeText = new DisplayText({
      x: SETTINGS.width / 2,
      y: 100,
      text: '0.000s',
      textAlign: 'center',
      visible: false
    });
    this.addChild(this.timeText);

    this.tutorialLayer = new DisplayContainer({
      x: SETTINGS.width / 2,
      y: SETTINGS.height / 2 + 100,
      alpha: 0
    });
    this.addChild(this.tutorialLayer);

    this.leftGuiKey = new GuiKey({
      x: -40,
      y: 0,
      w: 30,
      h: 30,
      d: 10,
      text: 'A'
    });
    this.tutorialLayer.addChild(this.leftGuiKey);

    this.rightGuiKey = new GuiKey({
      x: 10,
      y: 0,
      w: 30,
      h: 30,
      d: 10,
      text: 'D'
    });
    this.tutorialLayer.addChild(this.rightGuiKey);

    this.scoreboard = new Scoreboard({
      x: SETTINGS.width / 2 - 100,
      y: SETTINGS.height / 2 + 70,
      alpha: 0
    });
    this.addChild(this.scoreboard);

    this.endTutorial = new DisplayContainer({
      x: SETTINGS.width / 2,
      y: this.timeText.y + 20,
      alpha: 0
    });
    this.addChild(this.endTutorial);

    this.retryGuiKey = new GuiKey({
      x: -30,
      y: 5,
      w: 15,
      h: 15,
      d: 5,
      text: 'R',
      color: 'black',
      font: '12px Arial'
    });
    this.endTutorial.addChild(this.retryGuiKey);

    this.retryText = new DisplayText({
      x: -10,
      y: 10,
      color: 'black',
      font: '14px Arial',
      text: 'to retry'
    });
    this.endTutorial.addChild(this.retryText);

    var setX = function (adjusted, ratio, timeRatio, obj) {
      obj.x = Math.floor(adjusted);
    };
    var setY = function (adjusted, ratio, timeRatio, obj) {
      obj.y = Math.floor(adjusted);
    };
    var setAngle = function (adjusted, ratio, timeRatio, obj) {
      obj.angle = adjusted;
    };

    this.introAnim = AnimBuilder.start(this.turtle).then({ // walking
      from: 500,
      to: 1000,
      duration: 5,
      onStep: setX,
      onEnd: function () {
        this.turtle.animateHide();
        this.turtle.head.eye.state = Eye.states.struggle;
      }.bind(this)
    }).then({ // tripping
      from: 1000, // x
      to: 1100,
      duration: 0.5,
      onStep: setX
    }).and({
      from: 395, // y
      to: 450,
      duration: 0.5,
      onStep: setY,
      timeFunction: Anim.easingFunctions.easeInCubic
    }).and({
      from: 0, // angle
      to: Math.PI,
      duration: 0.5,
      onStep: setAngle
    }).then({ // bounce
      from: 1100, // x
      to: 1250,
      duration: 0.5,
      onStep: setX
    }).and({
      from: 450, // y
      to: 350,
      duration: 0.5,
      onStep: setY,
      timeFunction: Anim.easingFunctions.easeOutCubic
    }).and({
      from: Math.PI, // angle
      to: Math.PI * 4,
      duration: 0.5,
      onStep: setAngle
    }).then({ // falling
      from: 1250, // x
      to: 1400,
      duration: 0.5,
      onStep: setX
    }).and({
      from: 350, // y
      to: 600 - this.shellRadius + 5,
      duration: 0.5,
      onStep: setY,
      timeFunction: Anim.easingFunctions.easeInCubic
    }).and({
      from: 0, // angle
      to: Math.PI * 3,
      duration: 0.5,
      onStep: setAngle
    }).then({ // bounce 2
      from: 1400, // x
      to: 1490,
      duration: 0.3,
      onStep: setX
    }).and({
      from: 550, // y
      to: 450,
      duration: 0.3,
      onStep: setY,
      timeFunction: Anim.easingFunctions.easeOutCubic
    }).and({
      from: Math.PI, // angle
      to: Math.PI * 2,
      duration: 0.3,
      onStep: setAngle
    }).then({ // falling 2
      from: 1490, // x
      to: 1580,
      duration: 0.3,
      onStep: setX
    }).and({
      from: 450, // y
      to: 600 - this.shellRadius + 5,
      duration: 0.3,
      onStep: setY,
      timeFunction: Anim.easingFunctions.easeInCubic
    }).and({
      from: 0, // angle
      to: Math.PI,
      duration: 0.3,
      onStep: setAngle
    }).then({ // bounce 3
      from: 1580, // x
      to: 1640,
      duration: 0.2,
      onStep: setX
    }).and({
      from: 600 - this.shellRadius + 5, // y
      to: 500,
      duration: 0.2,
      onStep: setY,
      timeFunction: Anim.easingFunctions.easeOutCubic
    }).and({
      from: Math.PI, // angle
      to: 7 * Math.PI / 6,
      duration: 0.2,
      onStep: setAngle
    }).then({ // falling 3
      from: 1640, // x
      to: 1700,
      duration: 0.2,
      onStep: setX
    }).and({
      from: 500, // y
      to: 600 - this.shellRadius + 5,
      duration: 0.2,
      onStep: setY,
      timeFunction: Anim.easingFunctions.easeInCubic
    }).and({
      from: 7 * Math.PI / 6, // angle
      to: 8 * Math.PI / 6,
      duration: 0.2,
      onStep: setAngle
    }).then({ // settling
      from: 1700, // x,
      to: 1755,
      duration: 0.5,
      onStep: setX
    }).and({
      from: 8 * Math.PI / 6, // angle
      to: 9 * Math.PI / 6,
      duration: 0.5,
      onStep: setAngle,
      timeFunction: Anim.easingFunctions.easeOutQuad
    }).then({
      from: 1755, // x
      to: 1745,
      duration: 0.5,
      onStep: setX,
      timeFunction: Anim.easingFunctions.easeInOutQuad
    }).and({
      from: 9 * Math.PI / 6, // angle
      to: 5 * Math.PI / 6,
      duration: 0.5,
      onStep: setAngle,
      timeFunction: Anim.easingFunctions.easeInOutQuad
    }).then({
      from: 1745, // x
      to: 1752,
      duration: 0.5,
      onStep: setX,
      timeFunction: Anim.easingFunctions.easeInOutQuad
    }).and({
      from: 5 * Math.PI / 6,
      to: 13 * Math.PI / 12,
      duration: 0.5,
      onStep: setAngle,
      timeFunction: Anim.easingFunctions.easeInOutQuad
    }).then({ // settling
      from: 1752, // x
      to: 1750,
      duration: 0.5,
      onStep: setX,
      timeFunction: Anim.easingFunctions.easeInOutQuad,
      onEnd: function () {
        this.setState(PlayScene.states.waiting);
      }.bind(this)
    }).and({
      from: 13 * Math.PI / 12,
      to: Math.PI,
      duration: 0.5,
      onStep: setAngle,
      timeFunction: Anim.easingFunctions.easeInOutQuad
    }).build();
  
    this.keys = [];
    this.keys.push(KB(
      [KB.keys.a, KB.keys.left, 81], // q, for azerty
      this.leftPressed.bind(this),
      this.leftReleased.bind(this)
    ));
    this.keys.push(KB(
      [KB.keys.d, KB.keys.right],
      this.rightPressed.bind(this),
      this.rightReleased.bind(this)
    ));
    this.keys.push(KB(
      82, // r for retry
      this.retryPressed.bind(this),
      this.retryReleased.bind(this)
    ));
  
    this.addSteppable(this.cycle.bind(this));
    this.addSteppable(this.turtle.step.bind(this.turtle));

    if (this.settings.skipIntro) {
      this.setState(PlayScene.states.waiting);
    } else {
      this.setState(PlayScene.states.intro);
    }
    this.setCamera(this.turtle.x, this.turtle.y);
  },
  destroy: function () {
    this.keys.forEach(function (key) {
      key.destroy();
    });
    this.retryGuiKey.stopAnim();
  },
  setState: function (state) {
    this.state = state;
    switch (state) {
      case PlayScene.states.intro:
        this.main.animManager.add(this.introAnim);
        this.turtle.leftLeg.setState(Leg.states.walking);
        this.turtle.rightLeg.setState(Leg.states.walking);
        break;
      case PlayScene.states.waiting:
        this.turtle.x = this.roll.center.x;
        this.turtle.y = this.roll.center.y;
        this.setCamera(this.turtle.x, this.turtle.y);
        this.turtle.angle = Math.PI;
        this.turtle.animateShow();
        this.turtle.head.eye.state = Eye.states.normal;
        this.timeText.visible = true;
        this.main.animManager.add(new Anim({
          object: this.tutorialLayer,
          from: 0,
          to: 1,
          duration: 0.25,
          onStep: function (adjusted, ratio, timeRatio, obj) {
            obj.alpha = adjusted;
          }
        }));
        this.leftGuiKey.startAnim();
        this.rightGuiKey.startAnim(0.5);
        break;
      case PlayScene.states.playing:
        this.main.animManager.add(new Anim({
          object: this.tutorialLayer,
          from: this.tutorialLayer.alpha,
          to: 0,
          duration: 0.25,
          onStep: function (adjusted, ratio, timeRatio, obj) {
            obj.alpha = adjusted;
          }
        }));
        this.leftGuiKey.stopAnim();
        this.rightGuiKey.stopAnim();
        break;
      case PlayScene.states.outro:
        if (this.turtle.x < this.roll.center.x) {
          this.outro = this.outroSettings.left;
          // ensure rollVel isn't too slow
          if (this.rollVel > -1) {
            this.rollVel = -1;
          }
        } else {
          this.outro = this.outroSettings.right;
          // ensure rollVel isn't too slow
          if (this.rollVel < 1) {
            this.rollVel = 1;
          }
        }
        this.turtle.animateHide();
        this.turtle.setShiftState(Turtle.shiftStates.idle);
        this.scoreboard.addScore(this.playSeconds, new Date());
        break;
      case PlayScene.states.end:
        this.turtle.animateShow();
        this.main.animManager.add(
          new Anim({
            object: this.turtle,
            from: this.turtle.y,
            to: this.turtle.y - 10,
            duration: 0.25,
            onStep: function (adjusted, ratio, timeRatio, obj) {
              obj.y = adjusted;
            },
            timeFunction: Anim.easingFunctions.easeOutCubic
          })
        );
        this.main.animManager.add(
          new Anim({
            object: this.scoreboard,
            from: 0,
            to: 1,
            duration: 0.25,
            onStep: function (adjusted, ratio, timeRatio, obj) {
              obj.alpha = adjusted;
            }
          })
        );
        this.main.animManager.add(
          new Anim({
            object: this.endTutorial,
            from: 0,
            to: 1,
            duration: 0.25,
            onStep: function (adjusted, ratio, timeRatio, obj) {
              obj.alpha = adjusted;
            }
          })
        );
        this.retryGuiKey.startAnim();
        break;
    }
    this.currentCycle = this.stateMap[state];
  },
  maybeEnableDamping: function () {
    if (Math.abs(this.turtleAccel) < JMath.EPSILON) {
      this.turtleAccel = 0; // zero out accel
      this.dampingEnabled = true;
    } else {
      this.dampingEnabled = false;
    }
  },
  updateShiftState: function () {
    if (this.turtleAccel === 0) {
      this.turtle.setShiftState(Turtle.shiftStates.idle);
    } else if (this.turtleAccel > 0) {
      this.turtle.setShiftState(Turtle.shiftStates.backward);
    } else {
      this.turtle.setShiftState(Turtle.shiftStates.forward);
    }
  },
  leftPressed: function () {
    if (this.state === PlayScene.states.waiting) {
      this.setState(PlayScene.states.playing);
    } else if (this.state !== PlayScene.states.playing) {
      return;
    }
    this.turtleAccel += -this.turtleAccelMagnitude;
    this.maybeEnableDamping();
    this.updateShiftState();
  },
  leftReleased: function () {
    if (this.state !== PlayScene.states.playing) {
      return;
    }
    this.turtleAccel -= -this.turtleAccelMagnitude;
    this.maybeEnableDamping();
    this.updateShiftState();
  },
  rightPressed: function () {
    if (this.state === PlayScene.states.waiting) {
      this.setState(PlayScene.states.playing);
    } else if (this.state !== PlayScene.states.playing) {
      return;
    }
    this.turtleAccel += this.turtleAccelMagnitude;
    this.maybeEnableDamping();
    this.updateShiftState();
  },
  rightReleased: function () {
    if (this.state !== PlayScene.states.playing) {
      return;
    }
    this.turtleAccel -= this.turtleAccelMagnitude;
    this.maybeEnableDamping();
    this.updateShiftState();
  },
  retryPressed: function () {
    if (this.state !== PlayScene.states.end) {
      return;
    }
  },
  retryReleased: function () {
    if (this.state !== PlayScene.states.end) {
      return;
    }

    this.main.setScene(new PlayScene(this.main, {
      skipIntro: true
    }));
  },
  setCamera: function (x, y) {
    this.cameraPos.x = x;
    this.cameraPos.y = y;
    this.scrollLayer.x = Math.floor(-x + SETTINGS.width / 2);
    this.scrollLayer.y = Math.floor(-y + SETTINGS.height / 2);
    this.cloudLayer.setCamera(x, y);
  },
  cycle: function (dts) {
    this.currentCycle(dts);
  },
  cycleIdle: function (dts) {},
  cycleIntro: function (dts) {
    this.setCamera(this.turtle.x, this.turtle.y);
  },
  cycleWaiting: function (dts) {
    this.tutorialKeyTimeLeft -= dts;
    if (this.tutorialKeyTimeLeft <= 0) {
      this.tutorialKeyTimeLeft += 1;
      this.tutorialKeyIndex += 1;
      var tutorialKey = this.tutorialKeys[this.tutorialKeyIndex % this.tutorialKeys.length];
      this.leftGuiKey.text = tutorialKey.left;
      this.rightGuiKey.text = tutorialKey.right;
    }
  },
  cyclePlaying: function (dts) {
    this.rollBackAccel = this.rollPos / this.roll.magnitude * -this.roll.backMaxAccel;

    this.rollAccel = this.rollBackAccel + this.turtleAccel;

    this.rollVel += this.rollAccel * dts;
    if (this.dampingEnabled) {
      this.rollVel *= this.roll.damping;
    }
    this.rollPos += this.rollVel * dts;

    this.turtle.x = this.roll.center.x + this.rollPos;
    this.turtle.angle = this.rollPos / this.roll.magnitude * JMath.PId2 + Math.PI;
    this.turtle.setRollPos(this.rollPos);

    this.playSeconds += dts;
    this.timeText.text = this.playSeconds.toFixed(3) + 's';

    if (Math.abs(this.rollPos) > this.roll.magnitude) {
      this.setState(PlayScene.states.outro);
    }
  },
  cycleOutro: function (dts) {
    // rollPos will always be more than the roll.magnitude in outro
    this.rollAccel = this.outro.accel * ((Math.abs(this.rollPos) / this.roll.magnitude) - 1);
    //this.rollAccel = this.outro.accel;
    this.rollVel += this.rollAccel * dts;
    this.rollPos += this.rollVel * dts;

    var ratio = (this.rollPos - this.outro.pos.min) / (this.outro.pos.max - this.outro.pos.min);
    if (ratio >= 1) {
      // reflect
      ratio -= ratio - 1;
      this.rollPos = JMath.lerp(this.outro.pos.min, this.outro.pos.max, ratio);
      this.rollVel *= -this.outro.restitution;
    }
    var angle = JMath.lerp(this.outro.angle.min, this.outro.angle.max, ratio);
    var inverseAngle = angle - Math.PI;
    this.turtle.angle = angle;
    this.turtle.x = this.outro.pivot.x + Math.cos(inverseAngle) * this.shellRadius * this.outro.corner;
    this.turtle.y = this.outro.pivot.y + Math.sin(inverseAngle) * this.shellRadius * this.outro.corner;

    if (Math.abs(1 - ratio) < JMath.EPSILON && Math.abs(this.rollVel) - Math.abs(this.rollAccel * dts) < JMath.EPSILON) {
      this.setState(PlayScene.states.end);
    }
  },
  cycleEnd: function (dts) {
    if (this.endHappyDelay > 0) {
      this.endHappyDelay -= dts;
      if (this.endHappyDelay <= 0) {
        this.turtle.head.eye.state = Eye.states.happy;
        this.main.animManager.add(
          new Anim({
            object: this,
            from: this.cameraPos.x,
            to: this.turtle.x,
            duration: 0.5,
            onStep: function (adjusted) {
              this.setCamera(adjusted, this.cameraPos.y);
            }.bind(this),
            timeFunction: Anim.easingFunctions.easeOutCubic
          })
        );
      }
    }
  }
});
