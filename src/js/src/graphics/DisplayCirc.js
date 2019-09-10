function DisplayCirc(options) {
  DisplayItem.apply(this, arguments);
  var opts = extend({
    offsetX: 0,
    offsetY: 0,
    radius: 10,
    startAngle: 0,
    endAngle: Math.PI * 2,
    color: 'black',
    ccw: false
  }, options || {});

  this.offsetX = opts.offsetX;
  this.offsetY = opts.offsetY;
  this.radius = opts.radius;
  this.startAngle = opts.startAngle;
  this.endAngle = opts.endAngle;
  this.color = opts.color;
  this.ccw = opts.ccw;
}

DisplayCirc.prototype = extendPrototype(DisplayItem.prototype, {
  render: function (context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.offsetX, this.offsetY, this.radius, this.startAngle, this.endAngle, this.ccw);
    context.closePath();
    context.fill();
  }
});
