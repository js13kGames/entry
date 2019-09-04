AFRAME.registerComponent('clicker', {
  schema: {},

  init: function () {
    this.el.addEventListener("click", e => {
      // console.log(e);
      this.el.setAttribute("color", "orange");

      const maskEl = this.el.sceneEl.querySelector('#mask');
      maskEl.emit('fadeDark');
      setTimeout(function () {
        maskEl.emit('fadeLight');
      }, 1500);
    });
    this.el.addEventListener("mouseenter", e => {
      this.el.setAttribute("color", "green")
    });
    this.el.addEventListener("mouseleave", e => {
      this.el.setAttribute("color", "red")
    });
  }
});