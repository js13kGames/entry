AFRAME.registerSystem('game', {
  init: function() {
    this.titleEl = this.el.querySelector('#title');
    this.outlawEls = this.el.querySelectorAll('.outlaw');

    this.startGame = AFRAME.utils.bind(this.startGame, this);
    this.el.querySelector('#start').addEventListener('mouseenter', this.startGame);
  },
  startGame: function(evt) {
    console.log('startGame');
    this.titleEl.setAttribute('visible', false);
    this.outlawEls.forEach(function(outlawEl) {
      outlawEl.setAttribute('visible', true);
    })
  }
});
