function DisplayText(options) {
  DisplayItem.apply(this, arguments);

  var opts = extend({
    text: '',
    font: null,
    textAlign: 'left',
    textBaseline: 'top',
    color: 'black'
  }, options || {});

  this.text = opts.text;
  this.font = opts.font;
  this.textAlign = opts.textAlign;
  this.textBaseline = opts.textBaseline;
  this.color = opts.color;
}

DisplayText.prototype = extendPrototype(DisplayItem.prototype, {
  render: function (context) {
    if (this.font) {
      context.font = this.font;
    }
    context.textAlign = this.textAlign;
    context.textBaseline = this.textBaseline;
    context.fillStyle = this.color;
    context.fillText(this.text, 0, 0);
  }
});
