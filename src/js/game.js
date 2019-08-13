import { init, Sprite, GameLoop } from 'kontra';

let { canvas } = init();

canvas.style = 'width: 100%; background: #000';
canvas.height = 450;
canvas.width = 800;

const PI2 = Math.PI * 2;

let asteroid = Sprite({
    x: 100,
    y: 100,
    dx: Math.random() * 4 - 2,
    dy: Math.random() * 4 - 2,
    radius: 30,

    render() {
        this.context.strokeStyle = 'white';
        this.context.beginPath();  // start drawing a shape
        this.context.arc(this.x, this.y, this.radius, 0, PI2);
        this.context.stroke();     // outline the circle
    }
});

asteroid.render();

let loop = GameLoop({  // create the main game loop
    update: function() { // update the game state
        asteroid.update();

        // wrap the asteroids position when it reaches
        // the edge of the screen
        if (asteroid.x > canvas.width) {
            asteroid.x = 0;
        } else if (asteroid.x < 0) {
            asteroid.x = canvas.width;
        }
        if (asteroid.y > canvas.height) {
            asteroid.y = 0;
        } else if (asteroid.y < 0) {
            asteroid.y = canvas.height;
        }
    },
    render: function() { // render the game state
        asteroid.render();
    }
});

loop.start();    // start the game
