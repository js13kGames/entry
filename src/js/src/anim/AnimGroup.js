function AnimGroup(settings) {
  var s = extend({
    object: null,
    anims: []
  }, settings || {});
  Anim.call(this, s);

  var duration = 0;
  this.settings.anims.forEach(function (anim) {
    if (anim.settings.duration > duration) {
      duration = anim.settings.duration;
    }
    if (!anim.settings.object) {
      anim.settings.object = s.object;
    }
  });
  this.settings.duration = duration;

  this.userOnEnd = this.settings.onEnd;
  this.settings.onEnd = this.onEnd.bind(this);
}

AnimGroup.prototype = extendPrototype(Anim.prototype, {
  start: function (startTime) {
    this.settings.anims.forEach(function (anim) {
      anim.start(startTime);
    });
    Anim.prototype.start.call(this, startTime);
  },
  step: function (time) {
    var i, anim;
    for (i = 0; i < this.settings.anims.length; i += 1) {
      anim = this.settings.anims[i];
      if (time < anim.endTime) {
        anim.step(time);
      } else if (!anim.finished) {
        anim.step(anim.endTime);
        if (anim.settings.onEnd) {
          anim.settings.onEnd();
        }
        anim.finished = true;
      }
    }
  },
  onEnd: function () {
    this.settings.anims.forEach(function (anim) {
      if (!anim.finished && anim.settings.onEnd) {
        anim.step(anim.endTime);
        anim.settings.onEnd();
      }
      anim.finished = true;
    });
    if (this.userOnEnd) {
      this.userOnEnd();
    }
  }
});
