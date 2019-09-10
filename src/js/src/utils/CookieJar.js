var CookieJar = (function () {
  function CJ() {
    this.cookieMap = this.parseCookies();
  }

  CJ.DEFAULT_EXPIRE_SECONDS = 60 * 60 * 24 * 365 * 5;

  CJ.prototype = {
    setItem: function (name, value) {
      this.setCookie(name, value, CJ.DEFAULT_EXPIRE_SECONDS);
    },
    getItem: function (name) {
      return this.getCookie(name);
    },
    removeItem: function (name) {
      this.removeCookie(name);
    },
    clear: function () {
      Object.keys(this.cookieMap).forEach(function (key) {
        this.removeCookie(key);
      }.bind(this));
    },
    getCookie: function (name, defaultValue, expireSeconds) {
      if (this.cookieMap[name]) {
        return this.cookieMap[name];
      }
      if (expireSeconds) {
        this.setCookie(name, defaultValue, expireSeconds);
      }
      return defaultValue;
    },
    setCookie: function (name, value, expireSeconds) {
      var exDate = new Date();
      exDate.setSeconds(exDate.getSeconds() + expireSeconds);
      document.cookie = name + '=' + value + '; expires=' + exDate.toUTCString();
      this.cookieMap[name] = value;
    },
    removeCookie: function (name) {
      var exDate = new Date(1);
      document.cookie = name + '=; expires=' + exDate.toUTCString();
      if (this.cookieMap.hasOwnProperty(name)) {
        delete this.cookieMap.name;
      }
    },
    parseCookies: function () {
      return document.cookie.split(';').map(function (x) { return x.trim().split('='); }).reduce(function (a, b) { a[b[0]] = b[1]; return a; }, {});
    }
  };

  return new CJ();
}());
