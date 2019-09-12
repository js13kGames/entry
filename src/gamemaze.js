////

  (function() {
    kontra.init("game-canvas-11");
    var canvas = document.querySelector("#game-canvas-11");
    canvas.width = 600;
    canvas.height = 600;
    var context = canvas.getContext("2d");
    // exclude-code:start
  let { init, Sprite, GameLoop } = kontra;
  // exclude-code:end

  let sprites = [];

  function createAsteroid(x,y,radius) {
    let asteroid = kontra.Sprite({
      type:'asteroid',
      x: x,
      y: y,
      dx: Math.random() * 4 - 2,
      dy: Math.random() * 4 - 2,
      radius: radius,

      render() {
        this.context.strokeStyle = 'green';
        this.context.beginPath();  // start drawing a shape
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.context.stroke();     // outline the circle
      }
    });
    sprites.push(asteroid);
  }

  for (var i = 0; i < 4; i++) {
    createAsteroid(Math.random()*canvas.width,Math.random()*canvas.height,30);
  }

  let spriteX = Sprite({
    x: 100,        // starting x,y position of the sprite
    y: 80,
    color: 'red',  // fill color of the sprite rectangle
    width: 20,     // width and height of the sprite rectangle
    height: 40,
    dx: 2,          // move the sprite 2px to the right every frame
    dy: 2
  });

  sprites.push(spriteX);

  kontra.initKeys();
  // helper function to convert degrees to radians
  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  let ship = kontra.Sprite({
    type:'ship',
    x: 300,
    y: 300,
    width: 6,  // we'll use this later for collision detection
    rotation: 0,  // 0 degrees is to the right
    dt: 0,
    render() {
      this.context.save();

      // transform the origin and rotate around it
      // using the ships rotation
      this.context.translate(this.x, this.y);
      this.context.rotate(degreesToRadians(this.rotation));

      // draw a right facing triangle
      this.context.beginPath();
      this.context.moveTo(-3, -5);
      this.context.lineTo(12, 0);
      this.context.lineTo(-3, 5);
      this.context.closePath();
      this.context.stroke();
      this.context.restore();
    },
    update() {
      // rotate the ship left or right
      if (kontra.keyPressed('left')) {
        this.rotation += -4
      }
      else if (kontra.keyPressed('right')) {
        this.rotation += 4
      }

      // move the ship forward in the direction it's facing
      const cos = Math.cos(degreesToRadians(this.rotation));
      const sin = Math.sin(degreesToRadians(this.rotation));

      if (kontra.keyPressed('up')) {
        this.ddx = cos * 0.05;
        this.ddy = sin * 0.05;
      }
      else {
        this.ddx = this.ddy = 0;
      }

      this.advance();
      // set a max speed
      const magnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      if (magnitude > 5) {
        this.dx *= 0.95;
        this.dy *= 0.95;
      }


      // allow the player to fire no more than 1 bullet every 1/4 second
      this.dt += 1/60;
      if (kontra.keyPressed('space') && this.dt > 0.25) {
        this.dt = 0;
        let bullet = kontra.Sprite({
          type: 'bullet',
          // start the bullet on the ship at the end of the triangle
          x: this.x + cos * 12,
          y: this.y + sin * 12,
          // move the bullet slightly faster than the ship
          dx: this.dx + cos * 5,
          dy: this.dy + sin * 5,
          // live only 50 frames
          ttl: 50,
          // bullets are small
          width: 2,
          height: 2,
          color: 'red'
        });
        sprites.push(bullet);
      }


    }
  });

  sprites.push(ship);

  let loop = GameLoop({  // create the main game loop
    update: function() { // update the game state

      sprites.map(sprite => {
        sprite.update();

        if (sprite.x > canvas.width) {
          sprite.x = 0;
        }

        if (sprite.y > canvas.height) {
          sprite.y = 0;
        }

        if (sprite.x < 0) {
          sprite.x = canvas.width;
        }

        if (sprite.y < 0) {
          sprite.y = canvas.height;
        }
      });

      // collision detection
      for (let i = 0; i < sprites.length; i++) {
        // only check for collision against asteroids
        if (sprites[i].type === 'asteroid') {
          for (let j = 0; j < sprites.length; j++) {
            // don't check asteroid vs. asteroid collisions
            if (i!=j && sprites[j].type !== 'asteroid') {
              let asteroid = sprites[i];
              let sprite = sprites[j];
              // circle vs. circle collision detection
              let dx = asteroid.x - sprite.x;
              let dy = asteroid.y - sprite.y;
              if (Math.sqrt(dx * dx + dy * dy) < asteroid.radius + sprite.width) {
                asteroid.ttl = 0;
                if (asteroid.radius > sprite.width)
                  sprite.ttl = 0;

                // split the asteroid only if it's large enough
                if (asteroid.radius > 1) {
                  for (var x = 0; x < 3; x++) {
                    createAsteroid(asteroid.x, asteroid.y, asteroid.radius / 2.5);
                  }
                }


                break;
              }
            }
          }
        }
      }

      sprites = sprites.filter(sprite => sprite.isAlive());
    },
    render: function() { // render the game state
        sprites.map(sprite => sprite.render());
    }


  });

  loop.start();    // start the game
  })();
