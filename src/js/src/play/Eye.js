function Eye(options) {
  DisplayItem.apply(this, arguments);

  var opts = extend({

  }, options || {});

  this.radius = 10;
  this.pupil = {
    x: 3,
    y: 0,
    radius: 7,
    color: 'black'
  };

  this.normalTimeLeft = 0;
  this.blinkTimeLeft = 0;
  this.state = Eye.states.normal;
}

Eye.states = {
  normal: 0,
  blink: 1,
  happy: 2,
  struggle: 3,
  uwu: 4
};

Eye.prototype = extendPrototype(DisplayItem.prototype, {
  step: function (dts) {
    switch (this.state) {
      case Eye.states.normal:
        this.normalTimeLeft -= dts;
        if (this.normalTimeLeft <= 0) {
          this.normalTimeLeft = Random.rangeTriangle(0.5, 7);
          this.state = Eye.states.blink;
        }
        break;
      case Eye.states.blink:
        this.blinkTimeLeft -= dts;
        if (this.blinkTimeLeft <= 0) {
          this.blinkTimeLeft = Random.range(0.1, 0.3);
          this.state = Eye.states.normal;
        }
        break;
    }
  },
  render: function (context) {
    switch (this.state) {
      case Eye.states.normal:
        // eye white
        context.fillStyle = 'white';
        context.beginPath();
        context.moveTo(this.radius, 0);
        context.arc(0, 0, this.radius, 0, JMath.PI2);
        context.closePath();
        context.fill();

        // pupil
        context.fillStyle = this.pupil.color;
        context.beginPath();
        context.moveTo(this.pupil.x + this.pupil.radius, this.pupil.y);
        context.arc(this.pupil.x, this.pupil.y, this.pupil.radius, 0, JMath.PI2);
        context.closePath();
        context.fill();

        break;
      case Eye.states.blink:
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(-this.radius, 0);
        context.lineTo(this.radius, 0);
        context.stroke();
        context.closePath();
        break;
      case Eye.states.happy:
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(-this.radius, 0);
        context.arc(0, 0, this.radius, Math.PI, JMath.PI2);
        context.stroke();
        context.closePath();
        break;
      case Eye.states.struggle:
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.lineJoin = 'round';
        context.beginPath();
        context.moveTo(-this.radius + 3, -3);
        context.lineTo(this.radius - 3, 0);
        context.lineTo(-this.radius + 3, 3);
        context.stroke();
        context.closePath();
        break;
      case Eye.states.uwu:
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(this.radius, 0);
        context.arc(0, 0, this.radius, 0, Math.PI);
        context.stroke();
        context.closePath();
        break;
    }
  }
});
