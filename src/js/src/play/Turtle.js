function Turtle(options) {
  DisplayContainer.apply(this, arguments);

  var opts = extend({
    shell: null
  }, options || {});

  this.addChild(new Shell(opts.shell));
}

Turtle.prototype = extendPrototype(DisplayContainer.prototype, {

});
