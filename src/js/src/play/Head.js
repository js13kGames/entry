function Head(options) {
  DisplayContainer.apply(this, arguments);
  var opts = extend({
    color: 'green'
  }, options || {});

  this.radius = 20;
  this.color = opts.color;
  this.shiftState = Turtle.shiftStates.idle;
  this.origX = this.x;
  this.origY = this.y;
  this.offsetX = 0;
  this.offsetY = 0;

  this.shiftSpeed = 20;
  this.shiftMax = 5;
  this.hideRatio = 0;

  this.eye = new Eye({
    x: 7,
    y: -2
  });
  this.addChild(this.eye);
}

Head.prototype = extendPrototype(DisplayContainer.prototype, {
  setHideRatio: function (ratio) {
    this.hideRatio = ratio;
  },
  animateHide: function () {
    Main.globalAnimManager.add(new Anim({
      object: this,
      property: 'hideRatio',
      from: this.hideRatio,
      to: 1,
      duration: 0.25,
      timeFunction: Anim.easingFunctions.easeInOutCubic
    }));
  },
  animateShow: function () {
    Main.globalAnimManager.add(new Anim({
      object: this,
      property: 'hideRatio',
      from: this.hideRatio,
      to: 0,
      duration: 0.25,
      timeFunction: Anim.easingFunctions.easeInOutCubic
    }));
  },
  setShiftState: function (shiftState) {
    this.shiftState = shiftState;
    switch (shiftState) {
      case Turtle.shiftStates.idle:
        this.eye.state = Eye.states.normal;
        break;
      case Turtle.shiftStates.forward:
      case Turtle.shiftStates.backward:
        this.eye.state = Eye.states.struggle;
        break;
    }
  },
  step: function (dts) {
    this.eye.step(dts);

    this.offsetX = this.hideRatio * -this.radius * 2.2;

    switch (this.shiftState) {
      case Turtle.shiftStates.idle:
        if (this.offsetY > 0) {
          this.offsetY -= this.shiftSpeed * dts;
          if (this.offsetY < 0) {
            this.offsetY = 0;
          }
        } else if (this.offsetY < 0) {
          this.offsetY += this.shiftSpeed * dts;
          if (this.offsetY > 0) {
            this.offsetY = 0;
          }
        }
        break;
      case Turtle.shiftStates.forward:
        if (this.offsetY > -this.shiftMax) {
          this.offsetY -= this.shiftSpeed * dts;
          if (this.offsetY < -this.shiftMax) {
            this.offsetY = -this.shiftMax;
          }
        }
        break;
      case Turtle.shiftStates.backward:
        if (this.offsetY < this.shiftMax) {
          this.offsetY += this.shiftSpeed * dts;
          if (this.offsetY > this.shiftMax) {
            this.offsetY = this.shiftMax;
          }
        }
        break;
    }
    this.x = this.origX + this.offsetX;
    this.y = this.origY + this.offsetY;
  },
  render: function (context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(this.radius, 0);
    context.arc(0, 0, this.radius, 0, JMath.PI2);
    context.closePath();
    context.fill();
    DisplayContainer.prototype.render.apply(this, arguments);
  }
});
