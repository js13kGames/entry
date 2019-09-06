AFRAME.registerComponent('screen-manager', {
  schema: {},
  init: function() {
    this.el.addState('title-screen');

    this.startButtonEl = this.el.querySelector('#start-button');
    this.chickenEls = Array.from(this.el.querySelectorAll('.chicken'));
    this.outlawEls = Array.from(this.el.querySelectorAll('.outlaw'));

    this.onGameStart = AFRAME.utils.bind(this.onGameStart, this);
    this.onStateRemoved = AFRAME.utils.bind(this.onStateRemoved, this);

    this.startButtonEl.addEventListener('mouseenter', this.onGameStart);
  },
  onGameStart: function() {
    this.startButtonEl.removeEventListener('mouseenter', this.onGameStart);

    this.el.addState('game-screen');
    this.el.removeState('title-screen');
  
    this.el.querySelector('#title').setAttribute('visible', false);
    this.chickenEls.forEach(function(chickenEl) {
      chickenEl.setAttribute('visible', false);
    });
    this.outlawEls.forEach(function(outlawEl) {
      outlawEl.setAttribute('visible', true);
      // hack: to prevent outlaws from being shot (though hidden) while practicing on the chicken
      // they are placed below the ground plane
      outlawEl.object3D.position.y += 100.6;
    });
  },
  tick: function() {
    if (this.el.is('game-screen') && !this.outlawEls.find(function(outlawEl) { return outlawEl.is('up') })) {
      this.el.removeState('game-screen');
      this.el.addState('end-screen');
      this.el.querySelector('#end').setAttribute('visible', true);
    }
  }
});


AFRAME.registerComponent('target', {
  schema: {
    revive: {
      // hack: a selector that has very little chance to match anything, so selectorAll returns an empty array
      default: '#null.null',
      type: 'selectorAll',
    },
  },
  init: function() {
    // state variables
    this.el.addState('up');

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
    if (this.el.is('up')) {
      this.el.removeState('up');

      const animationConfig = {
        from: 0,
        dur: 800,
      }
      // check if current animation
      if (this.el.components.animation) {
        const currentAnimation = this.el.components.animation.animation;
        animationConfig.dur -= currentAnimation.currentTime;
        animationConfig.from = currentAnimation.animations[0].currentValue;
      }

      this.el.setAttribute('animation', {
        ...animationConfig,
        property: 'object3D.rotation.x',
        to: -90,
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
    this.el.removeAttribute('animation');
    this.el.removeEventListener('animationcomplete', this.onDeadOrAlive);
  },
  onRevive: function() {
    if (!this.el.is('up')) {
      this.el.addState('up');

      const animationConfig = {
        from: -90,
        dur: 800,
      }
      // check if current animation
      if (this.el.components.animation) {
        const currentAnimation = this.el.components.animation.animation;
        animationConfig.dur -= currentAnimation.currentTime;
        animationConfig.from = currentAnimation.animations[0].currentValue;
      }

      this.el.setAttribute('animation', {
        ...animationConfig,
        property: 'object3D.rotation.x',
        to: 0,
        easing: 'easeOutElastic',
        elasticity: 800,
      });

      this.el.addEventListener('animationcomplete', this.onDeadOrAlive);
    }
  },
});
