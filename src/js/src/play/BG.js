function BG(options) {
  var opts = extend({
    w: 2500,
    h: 800
  }, options || {});
  CachedContainer.call(this, opts);

  this.addChild(new DisplayRect({
    x: 0, y: 0, w: 10, h: 10
  }));

  this.upperGround = new DisplayRect({
    x: 0,
    y: 400,
    w: 1000,
    h: 400,
    color: '#651a1a'
  });
  this.addChild(this.upperGround);

  this.lowerGround = new DisplayRect({
    x: 1000,
    y: 600,
    w: 1500,
    h: 200,
    color: '#651a1a'
  });
  this.addChild(this.lowerGround);

  this.cliffRocks = [];

  var i,
    numRocks = 5,
    radius = Math.ceil((this.lowerGround.y - this.upperGround.y) / numRocks / 2);
  for (i = this.upperGround.y + radius; i <= this.lowerGround.y - radius; i += radius * 2) {
    this.cliffRocks.push(new DisplayCirc({
      x: 1000,
      y: i,
      radius: radius,
      color: 'gray'
    }));
  }

  for (i = this.lowerGround.x + radius; i <= this.lowerGround.x + 200 - radius; i += radius * 2) {
    this.cliffRocks.push(new DisplayCirc({
      x: i,
      y: this.lowerGround.y,
      radius: radius,
      color: 'gray'
    }));
  }

  this.cliffRocks = this.cliffRocks.concat([
    new DisplayCirc({
      x: 1033,
      y: 461,
      radius: 50,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1040,
      y: 518,
      radius: 40,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1150,
      y: 573,
      radius: 45,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1101,
      y: 565,
      radius: 50,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1036,
      y: 575,
      radius: 50,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1045,
      y: 528,
      radius: 65,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 990,
      y: 441,
      radius: 15,
      color: 'gray'
    })
  ]);

  // this.cliffRocks.push(new DisplayCirc({
  //   x: 540,
  //   y: y,
  //   radius: radius,
  //   color: 'gray'
  // }));

  this.cliffRocks.forEach(this.addChild.bind(this));
}

BG.prototype = extendPrototype(CachedContainer.prototype, {});
