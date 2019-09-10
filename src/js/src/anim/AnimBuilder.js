var AnimBuilder = (function () {
  function Builder(settings) {
    this.settings = extend({
      object: null,
      anims: [],
      groupAnims: []
    }, settings || {});
  }
  Builder.prototype = {
    _cloneSettings: function () {
      return {
        object: this.settings.object,
        anims: this.settings.anims.slice(),
        groupAnims: this.settings.groupAnims.slice()
      };
    },
    _commit: function () {
      var s = this.settings;
      if (s.groupAnims.length === 1) {
        s.anims.push(s.groupAnims[0]);
        s.groupAnims = [];
      } else if (s.groupAnims.length > 0) {
        s.anims.push({
          object: s.object,
          anims: s.groupAnims
        });
        s.groupAnims = [];
      }
    },
    then: function (settings) {
      this._commit();

      var s = this._cloneSettings();

      // add next anim
      s.groupAnims.push(settings);

      return new Builder(s);
    },
    and: function (settings) {
      var s = this._cloneSettings();

      s.groupAnims.push(settings);

      return new Builder(s);
    },
    build: function () {
      this._commit();

      if (this.settings.anims.length === 1) {
        var anim = this.settings.anims[0];
        if (anim.anims) {
          return new AnimGroup({
            object: this.settings.object,
            anims: anim.anims.map(function (a) {
              return new Anim(a);
            })
          });
        }
        return new Anim(anim);
      } else if (this.settings.anims.length > 0) {
        var anims = this.settings.anims.map(function (anim) {
          if (anim.anims) {
            return new AnimGroup({
              object: this.settings.object,
              anims: anim.anims.map(function (a) {
                return new Anim(a);
              })
            });
          } else {
            return new Anim(anim);
          }
        }.bind(this));
        return new AnimSeq({
          object: this.settings.object,
          anims: anims
        });
      }
      return null;
    }
  };

  return {
    start: function (obj) {
      return new Builder({
        object: obj
      });
    }
  };
}());
