function Turtle(options) {
  DisplayContainer.apply(this, arguments);

  var opts = extend({
    leftLeg: null,
    rightLeg: null,
    head: null,
    shell: null,
    rollMagnitude: 100
  }, options || {});

  this.rollPos = 0;
  this.rollMagnitude = opts.rollMagnitude;
  this.hideRatioRange = {
    min: -0.1,
    max: -0.2
  };

  this.head = new Head(opts.head);
  this.addChild(this.head);

  this.leftLeg = new Leg(opts.leftLeg);
  this.addChild(this.leftLeg);

  this.rightLeg = new Leg(opts.rightLeg);
  this.addChild(this.rightLeg);

  this.shell = new Shell(opts.shell);
  this.addChild(this.shell);

  this.shiftState = Turtle.shiftStates.idle;
}

Turtle.shiftStates = {
  idle: 0,
  forward: 1,
  backward: 2
};

Turtle.prototype = extendPrototype(DisplayContainer.prototype, {
  setRollPos: function (pos) {
    this.rollPos = pos;
    var ratio = this.rollPos / this.rollMagnitude;

    if (ratio < this.hideRatioRange.min) {
      var hideRatio = Math.abs(ratio - this.hideRatioRange.min) / (this.hideRatioRange.min - this.hideRatioRange.max);
      if (hideRatio > 1) {
        hideRatio = 1;
      }
      this.head.setHideRatio(hideRatio);
    }
  },
  setShiftState: function (shiftState) {
    this.shiftState = shiftState;
    this.leftLeg.setShiftState(shiftState);
    this.rightLeg.setShiftState(shiftState);
    this.head.setShiftState(shiftState);
  },
  step: function (dts) {
    this.leftLeg.step(dts);
    this.rightLeg.step(dts);
    this.head.step(dts);
  }
});
