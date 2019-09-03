function Shell(options) {
  DisplayItem.apply(this, arguments);

  var opts = extend({
    radius: 100,
    color: 'brown'
  }, options || {});

  this.radius = opts.radius;
  this.color = opts.color;
}

Shell.prototype = extendPrototype(DisplayItem.prototype, {
  render: function (context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(0, 0);
    context.arc(0, 0, this.radius, Math.PI, Math.PI * 2);
    context.lineTo(0, 0);
    context.fill();
  }
});
