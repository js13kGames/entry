
AFRAME.registerComponent('target', {
  schema: {
    revive: { type: 'selectorAll' },
  },
  init: function() {
    // state variables
    this.isUp = true;
    this.isAnimating = false;

    // add target entity within
    this.targetEl = document.createElement('a-ring');
    this.targetEl.setAttribute('color', 'red');
    this.targetEl.setAttribute('radius-inner', 0.1);
    this.targetEl.setAttribute('radius-outer', 0.6);
    this.targetEl.object3D.position.set(0, 0.6, 0);
    this.el.appendChild(this.targetEl);

    this.onShot = AFRAME.utils.bind(this.onShot, this);
    this.onDeadOrAlive = AFRAME.utils.bind(this.onDeadOrAlive, this);
    this.onRevive = AFRAME.utils.bind(this.onRevive, this);

    this.el.addEventListener('mouseenter', this.onShot);
  },
  onShot: function() {
    if (this.isUp && !this.isAnimating) {
      this.isAnimating = true;

      this.el.setAttribute('animation', {
        property: 'object3D.rotation.x',
        from: 0,
        to: -90,
        dur: 1000,
        easing: 'easeOutElastic',
        elasticity: 800,
      });
      this.el.addEventListener('animationcomplete', this.onDeadOrAlive);

      this.data.revive.forEach(function(targetEl) {
        targetEl.components.target.onRevive();
      });
    }
  },
  onDeadOrAlive: function() {
    this.isAnimating = false;
    this.isUp = !this.isUp;
    this.el.removeAttribute('animation');
    this.el.removeEventListener('animationcomplete', this.onDeadOrAlive);
  },
  onRevive: function() {
    if (!this.isUp && !this.isAnimating) {
      this.isAnimating = true;

      this.el.setAttribute('animation', {
        property: 'object3D.rotation.x',
        from: -90,
        to: 0,
        dur: 1000,
        easing: 'easeOutElastic',
        elasticity: 800,
      });

      this.el.addEventListener('animationcomplete', this.onDeadOrAlive);
    }
  },
});
