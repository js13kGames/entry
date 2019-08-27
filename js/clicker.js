AFRAME.registerComponent('clicker', {
  schema: {},

  init: function () {
    this.el.addEventListener("click", e => {
      console.log(e);
      this.el.setAttribute("color", "orange");
    });
    this.el.addEventListener("mouseenter", e => {
      this.el.setAttribute("color", "green")
    });
    this.el.addEventListener("mouseleave", e => {
      this.el.setAttribute("color", "red")
    });
  }
});