function GuiKey(options) {
  DisplayItem.apply(this, arguments);
  var opts = extend({
    w: 20,
    h: 20,
    d: 10,
    text: 'A',
    font: null,
    pressDuration: 1,
    color: 'white'
  }, options || {});

  this.w = opts.w;
  this.h = opts.h;
  this.d = opts.d;
  this.text = opts.text;
  this.font = opts.font;
  this.color = opts.color;
  this.pressDuration = opts.pressDuration;

  this.pressDepth = 0;

  this.anim = null;
}

GuiKey.setDepth = function (adjusted, ratio, timeRatio, obj) {
  obj.pressDepth = adjusted;
};

GuiKey.prototype = extendPrototype(DisplayItem.prototype, {
  startAnim: function (delay) {
    this.stopAnim();

    var builder = AnimBuilder.start(this);
    if (delay) {
      builder = builder.then({ duration: delay });
    }
    this.anim = builder.then({
      from: 0,
      to: this.d,
      duration: this.pressDuration / 2,
      onStep: GuiKey.setDepth,
      timeFunction: Anim.easingFunctions.easeInQuint
    }).then({
      from: this.d,
      to: 0,
      duration: this.pressDuration / 2,
      onStep: GuiKey.setDepth,
      timeFunction: Anim.easingFunctions.easeInQuint,
      onEnd: this.startAnim.bind(this)
    }).build();

    Main.globalAnimManager.add(this.anim);
  },
  stopAnim: function () {
    if (this.anim) {
      this.anim.cancel();
      this.anim = null;
    }
  },
  render: function (context) {
    // key
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.strokeRect(0, this.pressDepth, this.w, this.h);
    context.strokeRect(0, this.h + this.pressDepth, this.w, this.d - this.pressDepth);

    // text
    context.fillStyle = this.color;
    if (this.font) {
      context.font = this.font;
    }
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(this.text, this.w / 2, this.h / 2 + this.pressDepth);
  }
});
