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
    }),
    new DisplayCirc({
      x: 178,
      y: 520,
      radius: 30,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 406,
      y: 475,
      radius: 15,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 560,
      y: 630,
      radius: 20,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 671,
      y: 511,
      radius: 35,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 915,
      y: 550,
      radius: 25,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 781,
      y: 596,
      radius: 15,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 440,
      y: 560,
      radius: 30,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 268,
      y: 663,
      radius: 60,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 750,
      y: 687,
      radius: 25,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1327,
      y: 670,
      radius: 30,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1502,
      y: 672,
      radius: 20,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1714,
      y: 650,
      radius: 15,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1856,
      y: 712,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 2112,
      y: 650,
      radius: 10,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 2244,
      y: 708,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 2396,
      y: 663,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 2298,
      y: 693,
      radius: 20,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 2057,
      y: 715,
      radius: 30,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1797,
      y: 673,
      radius: 30,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1629,
      y: 723,
      radius: 15,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1454,
      y: 727,
      radius: 25,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1133,
      y: 715,
      radius: 25,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 970,
      y: 680,
      radius: 20,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 902,
      y: 680,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1038,
      y: 677,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 828,
      y: 481,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 590,
      y: 521,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 448,
      y: 703,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 281,
      y: 496,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 64,
      y: 455,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1600,
      y: 628,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1430,
      y: 667,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1522,
      y: 742,
      radius: 5,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 1964,
      y: 675,
      radius: 15,
      color: 'gray'
    }),
    new DisplayCirc({
      x: 2214,
      y: 655,
      radius: 30,
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
