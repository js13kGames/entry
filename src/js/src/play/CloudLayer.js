function CloudLayer(settings) {
  CachedContainer.apply(this, arguments);

  this.settings = extend({
    parallaxScale: 0.5,
    minBound: { x: 0, y: 0 },
    maxBound: { x: 400, y: 100 },
    cloudMinRadius: 10,
    cloudMaxRadius: 20,
    numClouds: 10,
    cloudScaleX: 2,
    cloudScaleY: 1
  }, settings || {});

  this.setDimensions(this.settings.maxBound.x, this.settings.maxBound.y);

  var i, bounds, cloud, radius;
  var miniBoundsSize = (this.settings.maxBound.x - this.settings.minBound.x) / this.settings.numClouds;

  for (i = 0; i < this.settings.numClouds; i += 1) {
    x = this.settings.minBound.x + i * miniBoundsSize;
    radius = Random.range(this.settings.cloudMinRadius, this.settings.cloudMaxRadius);
    bounds = {
      min: {
        x: x + radius * this.settings.cloudScaleX,
        y: this.settings.minBound.y + radius * this.settings.cloudScaleY
      },
      max: {
        x: x + miniBoundsSize - radius * this.settings.cloudScaleX,
        y: this.settings.maxBound.y - radius * this.settings.cloudScaleY
      }
    };

    cloud = new DisplayCirc({
      x: Random.range(bounds.min.x, bounds.max.x),
      y: Random.range(bounds.min.y, bounds.max.y),
      radius: radius,
      color: 'white',
      scaleX: this.settings.cloudScaleX,
      scaleY: this.settings.cloudScaleY
    });

    this.addChild(cloud);
  }
}

CloudLayer.prototype = extendPrototype(CachedContainer.prototype, {
  setCamera: function (x, y) {
    this.x = Math.floor(-x + SETTINGS.width / 2) * this.settings.parallaxScale;
    // we don't move y
  }
});
