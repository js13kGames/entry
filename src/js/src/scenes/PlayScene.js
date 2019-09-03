
function PlayScene() {
  Scene.apply(this, arguments);

  this.roll = {
    center: {
      x: SETTINGS.width / 2,
      y: SETTINGS.height / 2
    },
    magnitude: 100,
    damping: Math.pow(0.5, 1/60) // damp by this amount so it reaches this fraction by 1 second
  };

  console.log(this.roll.damping);

  this.rollPos = 0;
  this.rollVel = 0;
  this.rollAccel = 0;
  this.dampingEnabled = true;

  this.rollBackAccel = 0;

  this.turtleAccel = 0;
  this.turtleAccelMagnitude = 20;

  this.playSeconds = 0;

  this.currentCycle = null;
  this.state = null;
  this.stateMap = {};
  this.stateMap[PlayScene.states.idle] = this.cycleIdle.bind(this);
  this.stateMap[PlayScene.states.intro] = this.cycleIntro.bind(this);
  this.stateMap[PlayScene.states.playing] = this.cyclePlaying.bind(this);
  this.stateMap[PlayScene.states.outro] = this.cycleOutro.bind(this);
  this.stateMap[PlayScene.states.end] = this.cycleEnd.bind(this);
}

PlayScene.states = {
  idle: 0,
  intro: 1,
  playing: 2,
  outro: 3,
  end: 4
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
      angle: Math.PI,
      shell: {
        radius: 2 * this.roll.magnitude / Math.PI // to get the right circumference that will cover the roll magnitude
      }
    });
    this.addChild(this.turtle);
  
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
    this.setState(PlayScene.states.playing);
  },
  destroy: function () {
    this.keys.forEach(function (key) {
      key.destroy();
    });
  },
  setState: function (state) {
    this.state = state;
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
  leftPressed: function () {
    this.turtleAccel += -this.turtleAccelMagnitude;
    this.maybeEnableDamping();
  },
  leftReleased: function () {
    this.turtleAccel -= -this.turtleAccelMagnitude;
    this.maybeEnableDamping();
  },
  rightPressed: function () {
    this.turtleAccel += this.turtleAccelMagnitude;
    this.maybeEnableDamping();
  },
  rightReleased: function () {
    this.turtleAccel -= this.turtleAccelMagnitude;
    this.maybeEnableDamping();
  },
  cycle: function (dts) {
    this.currentCycle(dts);
  },
  cycleIdle: function (dts) {},
  cycleIntro: function (dts) {},
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

    this.playSeconds += dts;

    if (Math.abs(this.rollPos) > this.roll.magnitude) {
      this.setState(PlayScene.states.outro);
      console.log(this.playSeconds);
    }
  },
  cycleOutro: function (dts) {

  },
  cycleEnd: function (dts) {}
});
