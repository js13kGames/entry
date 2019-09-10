var PersistStorage = (function () {
  function PS() {
    this.storage = null;
    // test if localStorage is available
    var localStorageAvail = false;
    if (window.localStorage) {
      // exception thrown in private browsing in mobile safari
      try {
        window.localStorage.getItem('test');
        localStorageAvail = true;
      } catch (e) {
        localStorageAvail = false;
      }
    } else {
      localStorageAvail = false;
    }

    if (localStorageAvail) {
      this.storage = window.localStorage;
    } else {
      this.storage = CookieJar;
    }
  }

  PS.prototype = {
    get: function (name, defaultValue) {
      var value = this.storage.getItem(name);
      if (!value) value = defaultValue;
      return value;
    },
    set: function (name, value) {
      this.storage.setItem(name, value);
    },
    remove: function (name) {
      this.storage.removeItem(name);
    }
  };

  return new PS();
}());