
function PlayScene() {
  Scene.apply(this, arguments);

  // rolling "line" and settings
  this.roll = {
    center: {
      x: SETTINGS.width / 2,
      y: SETTINGS.height / 2
    },
    magnitude: 100,
    damping: Math.pow(0.5, 1/60), // damp by this amount so it reaches this fraction by 1 second
    backMaxAccel: 400
  };

  this.shellRadius = 2 * this.roll.magnitude / Math.PI; // to get the right arc length that will cover the roll length (2 * magnitude)

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
    this.sky = new DisplayRect({
      w: SETTINGS.width,
      h: SETTINGS.height,
      color: 'white'
    });
    this.addChild(this.sky);

    this.bg = new BG({
      scaleX: 0.25,
      scaleY: 0.25
    });
    this.addChild(this.bg);
  
    this.turtle = new Turtle({
      x: this.roll.center.x,
      y: this.roll.center.y,
      angle: 0,
      shell: {
        radius: this.shellRadius
      },
      head: {
        x: 78,
        y: -25
      },
      leftLeg: {
        x: -40,
        w: 20,
        h: 10
      },
      rightLeg: {
        x: 40,
        w: 20,
        h: 10
      },
      rollMagnitude: this.roll.magnitude
    });
    this.addChild(this.turtle);

    this.timeText = new DisplayText({
      x: SETTINGS.width / 2,
      y: 100,
      text: '0.000s',
      textAlign: 'center'
    });
    this.addChild(this.timeText);
  
    this.keys = [];
    this.keys.push(KB(
      [KB.keys.a, KB.keys.left],
      this.leftPressed.bind(this),
      this.leftReleased.bind(this)
    ));
    this.keys.push(KB(
      [KB.keys.d, KB.keys.right],
      this.rightPressed.bind(this),
      this.rightReleased.bind(this)
    ));
  
    this.addSteppable(this.cycle.bind(this));
    this.addSteppable(this.turtle.step.bind(this.turtle));

    this.setState(PlayScene.states.idle);
  },
  destroy: function () {
    this.keys.forEach(function (key) {
      key.destroy();
    });
  },
  setState: function (state) {
    this.state = state;
    switch (state) {
      case PlayScene.states.waiting:
        this.turtle.angle = Math.PI;
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
        break;
      case PlayScene.states.end:
        this.turtle.animateShow();
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
  cycle: function (dts) {
    this.currentCycle(dts);
  },
  cycleIdle: function (dts) {},
  cycleIntro: function (dts) {},
  cycleWaiting: function (dts) {

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
      }
    }
  }
});
