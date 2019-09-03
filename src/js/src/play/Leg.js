
function Leg(options) {
  DisplayItem.apply(this, arguments);

  var opts = extend({
    w: 10,
    h: 10,
    color: 'green'
  }, options || {});

  this.w = opts.w;
  this.h = opts.h;
  this.color = opts.color;

  this.baseExt = 5;
  this.shiftState = Turtle.shiftStates.idle;
  this.angleSpeed = Math.PI / 2;
  this.maxAngle = Math.PI / 16;
}

Leg.prototype = extendPrototype(DisplayItem.prototype, {
  setShiftState: function (shiftState) {
    this.shiftState = shiftState;
  },
  step: function (dts) {
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
    context.fillRect(-this.w / 2, -this.baseExt, this.w, this.h + this.baseExt);
  }
});
