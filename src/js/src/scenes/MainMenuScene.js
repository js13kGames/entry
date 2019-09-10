function MainMenuScene() {
  Scene.apply(this, arguments);

  this.rollMagnitude = 100;
  this.rocks = [];
  this.clouds = [];
  this.rockSpeed = 100; // px/s
  this.cloudSpeed = 50; // px/s
  this.rockMin = 5;
  this.rockMax = 20;
  this.cloudMin = 10;
  this.cloudMax = 20;
  this.cloudScaleX = 2;
  this.cloudScaleY = 1;
  this.cloudMinY = 50;
  this.cloudMaxY = 150;
  this.numRocks = 20;
  this.numClouds = 4;

  this.keys = [];
  this.titleAnim = null;

  this.groundLine = SETTINGS.height / 2 + 20;
  this.rockMinY = this.groundLine + 10;

  this.stateMap = {};
  this.stateMap[MainMenuScene.states.idle] = this.cycleIdle.bind(this);
  this.stateMap[MainMenuScene.states.transitionIn] = this.cycleTransitionIn.bind(this);
  this.stateMap[MainMenuScene.states.intro] = this.cycleIntro.bind(this);
  this.stateMap[MainMenuScene.states.running] = this.cycleRunning.bind(this);
  this.stateMap[MainMenuScene.states.transitionOut] = this.cycleTransitionOut.bind(this);
  this.currentCycle = null;
}

MainMenuScene.states = {
  idle: 0,
  transitionIn: 1,
  intro: 2,
  running: 3,
  transitionOut: 4
};

MainMenuScene.setAlpha = function (adjusted, ratio, timeRatio, obj) {
  obj.alpha = adjusted;
};

MainMenuScene.setY = function (adjusted, ratio, timeRatio, obj) {
  obj.y = adjusted;
};

MainMenuScene.setAngle = function (adjusted, ratio, timeRatio, obj) {
  obj.angle = adjusted;
};

MainMenuScene.prototype = extendPrototype(Scene.prototype, {
  create: function () {
    this.bg = new CachedContainer({
      w: SETTINGS.width,
      h: SETTINGS.height
    });
    this.addChild(this.bg);

    var skyGradient = this.main.context.createLinearGradient(0, 0, 0, SETTINGS.height);
    skyGradient.addColorStop(0, 'lightskyblue');
    skyGradient.addColorStop(1, 'white');
    this.sky = new DisplayRect({
      w: SETTINGS.width,
      h: SETTINGS.height,
      color: skyGradient
    });
    this.bg.addChild(this.sky);

    this.ground = new DisplayRect({
      x: 0,
      y: this.groundLine,
      w: SETTINGS.width,
      h: SETTINGS.height - this.groundLine,
      color: '#651a1a'
    });
    this.bg.addChild(this.ground);
    
    this.cloudLayer = new DisplayContainer();
    this.addChild(this.cloudLayer);

    var i, cloud, rock, radius, sectionSize = SETTINGS.width / this.numClouds;
    for (i = 0; i < this.numClouds; i += 1) {
      radius = Random.range(this.cloudMin, this.cloudMax);
      cloud = new DisplayCirc({
        x: Random.range(i * sectionSize, i * sectionSize + sectionSize),
        y: Random.range(this.cloudMinY + radius * this.cloudScaleY, this.cloudMaxY - radius * this.cloudScaleY),
        radius: radius,
        color: 'white',
        scaleX: this.cloudScaleX,
        scaleY: this.cloudScaleY
      });
      this.cloudLayer.addChild(cloud);
      this.clouds.push(cloud);
    }

    this.rockLayer = new DisplayContainer();
    this.addChild(this.rockLayer);

    sectionSize = SETTINGS.width / this.numRocks;
    for (i = 0; i < this.numRocks; i += 1) {
      radius = Random.range(this.rockMin, this.rockMax)
      rock = new DisplayCirc({
        x: Random.range(i * sectionSize, i * sectionSize + sectionSize),
        y: Random.range(this.rockMinY + radius, SETTINGS.height),
        radius: radius,
        color: 'gray'
      });
      this.rockLayer.addChild(rock);
      this.rocks.push(rock);
    }

    this.turtle = new Turtle({
      x: SETTINGS.width / 2,
      y: this.groundLine + 5,
      shell: {
        radius: 2 * this.rollMagnitude / Math.PI
      }
    });
    this.turtle.head.eye.state = Eye.states.struggle;
    this.turtle.animateHide();
    this.addChild(this.turtle);

    this.menuLayer = new DisplayContainer({
      alpha: 0
    });
    this.addChild(this.menuLayer);

    this.title = new DisplayText({
      x: SETTINGS.width / 2,
      y: 130,
      font: '30px Arial Black',
      text: 'Turtleback',
      textAlign: 'center',
      textBaseline: 'bottom',
      color: 'black'
    });
    this.menuLayer.addChild(this.title);

    this.startGuiKey = new GuiKey({
      x: SETTINGS.width / 2 - 45,
      y: this.groundLine + 10,
      w: 30,
      h: 30,
      d: 10,
      text: 'R',
      color: 'white'
    });
    this.menuLayer.addChild(this.startGuiKey);

    this.startText = new DisplayText({
      x: this.startGuiKey.x + this.startGuiKey.w + 10,
      y: this.startGuiKey.y + this.startGuiKey.h / 2,
      text: 'to Start',
      color:' white'
    });
    this.menuLayer.addChild(this.startText);

    this.js13kText = new DisplayText({
      x: SETTINGS.width / 2,
      y: SETTINGS.height - 5,
      text: 'A game by jayther for the js13k 2019 competition.',
      color: '#dddddd',
      textAlign: 'center',
      textBaseline: 'bottom',
      font: '12px Arial'
    });
    this.menuLayer.addChild(this.js13kText);

    this.transitionLayer = new DisplayRect({
      w: SETTINGS.width,
      h: SETTINGS.height,
      color: 'black',
      alpha: 1
    });
    this.addChild(this.transitionLayer);

    this.introAnim = AnimBuilder.start(this.turtle).then({
      duration: 0.5,
      onEnd: function () {
        this.object.animateShow();
      }
    }).then({
      from: this.groundLine + 5,
      to: this.groundLine - 10,
      duration: 0.20,
      timeFunction: Anim.easingFunctions.easeOutCubic,
      onStep: MainMenuScene.setY
    }).then({
      from: this.groundLine - 10,
      to: this.groundLine - 5,
      duration: 0.10,
      onStep: MainMenuScene.setY,
      timeFunction: Anim.easingFunctions.easeInCubic,
      onEnd: function () {
        this.object.head.eye.state = Eye.states.normal;
      }
    }).then({
      duration: 0.5,
      onEnd: function () {
        this.setState(MainMenuScene.states.running);
      }.bind(this)
    }).build();

    this.keys.push(KB(
      82,
      this.startPressed.bind(this),
      this.startReleased.bind(this)
    ));

    this.addSteppable(this.cycle.bind(this));
    this.addSteppable(this.turtle.step.bind(this.turtle));

    this.setState(MainMenuScene.states.transitionIn);
  },
  destroy: function () {
    this.keys.forEach(function (key) {
      key.destroy();
    });
    this.startGuiKey.stopAnim();
    this.stopTitleAnim();
    this.turtle.leftLeg.setState(Leg.states.idle);
    this.turtle.rightLeg.setState(Leg.states.idle);
  },
  setState: function (state) {
    this.state = state;
    this.currentCycle = this.stateMap[state];
    switch (state) {
      case MainMenuScene.states.transitionIn:
        this.main.animManager.add(new Anim({
          object: this.transitionLayer,
          from: 1,
          to: 0,
          duration: 0.5,
          onStep: MainMenuScene.setAlpha,
          onEnd: function () {
            this.setState(MainMenuScene.states.intro);
          }.bind(this)
        }));
        break;
      case MainMenuScene.states.intro:
        this.main.animManager.add(this.introAnim);
        break;
      case MainMenuScene.states.running:
        this.turtle.leftLeg.setState(Leg.states.walking);
        this.turtle.rightLeg.setState(Leg.states.walking);
        this.main.animManager.add(new Anim({
          object: this.menuLayer,
          from: 0,
          to: 1,
          duration: 0.5,
          onStep: MainMenuScene.setAlpha
        }));
        this.startGuiKey.startAnim();
        this.startTitleAnim();
        break;
      case MainMenuScene.states.transitionOut:
        this.turtle.head.eye.state = Eye.states.uwu;
        this.main.animManager.add(new Anim({
          object: this.transitionLayer,
          from: 0,
          to: 1,
          duration: 0.5,
          onStep: MainMenuScene.setAlpha,
          onEnd: function () {
            this.setState(MainMenuScene.states.idle);
            this.main.setScene(new PlayScene(this.main));
          }.bind(this)
        }));
        break;
    }
  },
  startTitleAnim: function () {
    this.stopTitleAnim();

    this.titleAnim = AnimBuilder.start(this.title).then({
      from: this.title.angle,
      to: Math.PI / 24,
      duration: 2,
      timeFunction: Anim.easingFunctions.easeInOutQuad,
      onStep: MainMenuScene.setAngle
    }).then({
      from: Math.PI / 24,
      to: -Math.PI / 24,
      duration: 2,
      timeFunction: Anim.easingFunctions.easeInOutQuad,
      onStep: MainMenuScene.setAngle,
      onEnd: this.startTitleAnim.bind(this)
    }).build();

    this.main.animManager.add(this.titleAnim);
  },
  stopTitleAnim: function () {
    if (this.titleAnim) {
      this.titleAnim.cancel();
      this.titleAnim = null;
    }
  },
  startPressed: function () {
    if (this.state !== MainMenuScene.states.running) {
      return;
    }
  },
  startReleased: function () {
    if (this.state !== MainMenuScene.states.running) {
      return;
    }

    this.setState(MainMenuScene.states.transitionOut);
  },
  reposRock: function (rock) {
    var radius = Random.range(this.rockMin, this.rockMax);
    rock.x = SETTINGS.width + radius;
    rock.y = Random.range(this.rockMinY + radius, SETTINGS.height);
    rock.radius = radius;
  },
  reposCloud: function (cloud) {
    var radius = Random.range(this.cloudMin, this.cloudMax);
    cloud.x = SETTINGS.width + radius * cloud.scaleX;
    cloud.y = Random.range(this.cloudMinY + radius * cloud.scaleY, this.cloudMaxY - radius * cloud.scaleY);
    cloud.radius = radius;
  },
  updateClouds: function (dts) {
    var i, cloud;
    for (i = 0; i < this.clouds.length; i += 1) {
      cloud = this.clouds[i];
      cloud.x -= this.cloudSpeed * dts;
      if (cloud.x + cloud.radius * cloud.scaleX < 0) {
        this.reposCloud(cloud);
      }
    }
  },
  updateRocks: function (dts) {
    var i, rock;
    for (i = 0; i < this.rocks.length; i += 1) {
      rock = this.rocks[i];
      rock.x -= this.rockSpeed * dts;
      if (rock.x + rock.radius < 0) {
        this.reposRock(rock);
      }
    }
  },
  cycle: function (dts) {
    this.currentCycle(dts);
  },
  cycleIdle: function (dts) {},
  cycleTransitionIn: function (dts) {

  },
  cycleIntro: function (dts) {

  },
  cycleRunning: function (dts) {
    this.updateClouds(dts);
    this.updateRocks(dts);
  },
  cycleTransitionOut: function (dts) {
    this.updateClouds(dts);
    this.updateRocks(dts);
  }
});
