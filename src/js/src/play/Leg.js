
function Leg(options) {
  DisplayItem.apply(this, arguments);

  var opts = extend({
    w: 10,
    h: 10,
    color: 'green',
    direction: 1
  }, options || {});

  this.w = opts.w;
  this.h = opts.h;
  this.color = opts.color;
  this.direction = opts.direction;
  this.walkAnim = null;

  this.offsetY = 0;
  this.baseExt = 5;
  this.shiftState = Turtle.shiftStates.idle;
  this.angleSpeed = Math.PI / 2;
  this.maxAngle = Math.PI / 16;
  this.state = Leg.states.idle;
}

Leg.states = {
  idle: 0,
  walking: 1,
  hiding: 2
};

Leg.setAngle = function (adjusted, ratio, timeRatio, obj) {
  obj.angle = adjusted;
};

Leg.setOffsetY = function (adjusted, ratio, timeRatio, obj) {
  obj.offsetY = adjusted;
};

Leg.prototype = extendPrototype(DisplayItem.prototype, {
  setShiftState: function (shiftState) {
    this.shiftState = shiftState;
  },
  startWalkAnim: function () {
    this.walkAnim = AnimBuilder.start(this).then({
      from: this.angle,
      to: this.maxAngle * this.direction,
      duration: 0.25,
      onStep: Leg.setAngle,
      timeFunction: Anim.easingFunctions.easeInOutCubic
    }).then({
      from: this.maxAngle * this.direction,
      to: this.maxAngle * -this.direction,
      duration: 0.25,
      onStep: Leg.setAngle,
      timeFunction: Anim.easingFunctions.easeInOutCubic,
      onEnd: this.startWalkAnim.bind(this)
    }).build();
    Main.globalAnimManager.add(this.walkAnim);
  },
  setState: function (state) {
    this.state = state;
    switch (state) {
      case Leg.states.idle:
        if (this.walkAnim) {
          this.walkAnim.cancel();
          this.walkAnim = null;
        }
        Main.globalAnimManager.add(
          AnimBuilder.start(this).then({
            from: this.angle,
            to: 0,
            duration: 0.25,
            onStep: Leg.setAngle,
            timeFunction: Anim.easingFunctions.easeOutCubic
          }).and({
            from: this.offsetY,
            to: 0,
            duration: 0.25,
            onStep: Leg.setOffsetY,
            timeFunction: Anim.easingFunctions.easeOutCubic
          }).build()
        );
        break;
      case Leg.states.walking:
        if (this.walkAnim) {
          this.walkAnim.cancel();
          this.walkAnim = null;
        }
        Main.globalAnimManager.add(
          AnimBuilder.start(this).then({
            from: this.offsetY,
            to: 0,
            duration: 0.25,
            onStep: Leg.offsetY,
            timeFunction: Anim.easingFunctions.easeOutCubic
          }).build()
        );
        this.startWalkAnim();
        break;
      case Leg.states.hiding:
        if (this.walkAnim) {
          this.walkAnim.cancel();
          this.walkAnim = null;
        }
        Main.globalAnimManager.add(
          AnimBuilder.start(this).then({
            from: this.angle,
            to: 0,
            duration: 0.25,
            onStep: Leg.setAngle,
            timeFunction: Anim.easingFunctions.easeOutCubic
          }).and({
            from: this.offsetY,
            to: -this.h,
            duration: 0.25,
            onStep: Leg.setOffsetY,
            timeFunction: Anim.easingFunctions.easeOutCubic
          }).build()
        );
        break;
    }
  },
  step: function (dts) {
    if (this.state === Leg.states.idle) {
      this.stepIdle(dts);
    }
  },
  stepIdle: function (dts) {
    switch (this.shiftState) {
      case Turtle.shiftStates.idle:
        if (this.angle > 0) {
          this.angle -= this.angleSpeed * dts;
          if (this.angle < 0) {
            this.angle = 0;
          }
        } else if (this.angle < 0) {
          this.angle += this.angleSpeed * dts;
          if (this.angle > 0) {
            this.angle = 0;
          }
        }
        break;
      case Turtle.shiftStates.forward:
        if (this.angle > -this.maxAngle) {
          this.angle -= this.angleSpeed * dts;
          if (this.angle < -this.maxAngle) {
            this.angle = -this.maxAngle;
          }
        }
        break;
      case Turtle.shiftStates.backward:
        if (this.angle < this.maxAngle) {
          this.angle += this.angleSpeed * dts;
          if (this.angle > this.maxAngle) {
            this.angle = this.maxAngle;
          }
        }
        break;
    }
  },
  render: function(context) {
    context.fillStyle = this.color;
    context.fillRect(-this.w / 2, -this.baseExt + this.offsetY, this.w, this.h + this.baseExt);
  }
});
