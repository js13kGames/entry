function AnimSeq(settings) {
  var s = extend({
    object: null,
    anims: []
  }, settings || {});
  Anim.call(this, s);

  var duration = 0;
  this.settings.anims.forEach(function (anim) {
    duration += anim.settings.duration;
    if (!anim.settings.object) {
      anim.settings.object = s.object;
    }
  });
  this.settings.duration = duration;

  this.index = 0;
  this.userOnEnd = this.settings.onEnd;
  this.settings.onEnd = this.onEnd.bind(this);
}

AnimSeq.prototype = extendPrototype(Anim.prototype, {
  start: function (startTime) {
    var curDuration = 0;
    this.settings.anims.forEach(function (anim) {
      anim.start(startTime + curDuration);
      curDuration += anim.settings.duration;
    });
    Anim.prototype.start.call(this, startTime);
  },
  step: function (time) {
    var anim;
    while (this.index < this.settings.anims.length && time >= this.settings.anims[this.index].endTime) {
      anim = this.settings.anims[this.index];
      anim.step(anim.endTime);
      if (anim.settings.onEnd) {
        anim.settings.onEnd();
      }
      this.index += 1;
    }
    if (this.index >= this.settings.anims.length) return;

    anim = this.settings.anims[this.index];
    if (time < anim.endTime) {
      anim.step(time);
    } else if (time >= anim.endTime) {
      anim.step(anim.endTime);
      if (anim.settings.onEnd) {
        anim.settings.onEnd();
      }
      this.index += 1;
    }
  },
  onEnd: function () {
    var i, anim;
    for (i = this.index; i < this.settings.anims.length; i += 1) {
      anim = this.settings.anims[i];
      anim.step(anim.endTime);
      if (anim.settings.onEnd) {
        anim.settings.onEnd();
      }
    }
    this.index = this.settings.anims.length;
    if (this.userOnEnd) {
      this.userOnEnd();
    }
  }
});
