
function PlayScene() {
  Scene.apply(this, arguments);

  // rolling "line" and settings
  this.roll = {
    center: {
      x: SETTINGS.width / 2,
      y: SETTINGS.height / 2
    },
    magnitude: 100,
    damping: Math.pow(0.5, 1/60) // damp by this amount so it reaches this fraction by 1 second
  };

  console.log(this.roll.damping);

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
    this.bg = new DisplayRect({
      w: SETTINGS.width,
      h: SETTINGS.height,
      color: 'white'
    });
    this.addChild(this.bg);
  
    this.turtle = new Turtle({
      x: this.roll.center.x,
      y: this.roll.center.y,
      angle: 0,
      shell: {
        radius: 2 * this.roll.magnitude / Math.PI // to get the right circumference that will cover the roll magnitude
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
    this.setState(PlayScene.states.waiting);
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
    this.rollBackAccel = this.rollPos / this.roll.magnitude * -400;

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

  },
  cycleEnd: function (dts) {}
});
