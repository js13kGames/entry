/**
 * Basically the Kontra sprite implementation, with some bits removed.
 * TODO: More details. And how to use differently from the original.
 * https://github.com/straker/kontra/blob/master/src/sprite.js
 */

import { getContext, Vector } from 'kontra';


/**
 * A versatile way to update and draw your game objects. It can handle simple rectangles, images, and sprite sheet animations. It can be used for your main player object as well as tiny particles in a particle engine.
 * @class Sprite
 *
 * @param {Object} properties - Properties of the sprite.
 * @param {Number} properties.x - X coordinate of the position vector.
 * @param {Number} properties.y - Y coordinate of the position vector.
 * @param {Number} [properties.dx] - X coordinate of the velocity vector.
 * @param {Number} [properties.dy] - Y coordinate of the velocity vector.
 * @param {Number} [properties.ddx] - X coordinate of the acceleration vector.
 * @param {Number} [properties.ddy] - Y coordinate of the acceleration vector.
 *
 * @param {String} [properties.color] - Fill color for the sprite if no image or animation is provided.
 * @param {Number} [properties.width] - Width of the sprite.
 * @param {Number} [properties.height] - Height of the sprite.
 *
 * @param {Number} [properties.ttl=Infinity] - How many frames the sprite should be alive. Used by kontra.Pool.
 * @param {Number} [properties.rotation=0] - Sprites rotation around the origin in radians.
 * @param {Number} [properties.anchor={x:0,y:0}] - The x and y origin of the sprite. {x:0, y:0} is the top left corner of the sprite, {x:1, y:1} is the bottom right corner.
 *
 * @param {Canvas​Rendering​Context2D} [properties.ctx] - The ctx the sprite should draw to. Defaults to [core.getContext()](api/core#getContext).
 *
 * @param {Image|HTMLCanvasElement} [properties.image] - Use an image to draw the sprite.
 * @param {Object} [properties.animations] - An object of [Animations](api/animation) from a kontra.Spritesheet to animate the sprite.
 *
 * @param {Function} [properties.update] - Function called every frame to update the sprite.
 * @param {Function} [properties.render] - Function called every frame to render the sprite.
 * @param {*} [properties.*] - Any additional properties you need added to the sprite. For example, if you pass `Sprite({type: 'player'})` then the sprite will also have a property of the same name and value. You can pass as many additional properties as you want.
 */
class Sprite {
  /**
   * @docs docs/api_docs/sprite.js
   */

  constructor(properties) {
    this.init(properties);
  }

  /**
   * Use this function to reinitialize a sprite. It takes the same properties object as the constructor. Useful it you want to repurpose a sprite.
   * @memberof Sprite
   * @function init
   *
   * @param {Object} properties - Properties of the sprite.
   */
  init(properties = {}) {
    let { x, y, dx, dy, ddx, ddy } = properties;

    /**
     * The sprites position vector. The sprites position is its position in the world, as opposed to the position in the [viewport](api/sprite#viewX). Typically the position in the world and the viewport are the same value. If the sprite has been [added to a tileEngine](/api/tileEngine#addObject), the position vector represents where in the tile world the sprite is while the viewport represents where to draw the sprite in relation to the top-left corner of the canvas.
     * @memberof Sprite
     * @property {kontra.Vector} position
     */
    this.position = Vector(x, y);

    /**
     * The sprites velocity vector.
     * @memberof Sprite
     * @property {kontra.Vector} velocity
     */
    this.velocity = Vector(dx, dy);

    /**
     * The sprites acceleration vector.
     * @memberof Sprite
     * @property {kontra.Vector} acceleration
     */
    this.acceleration = Vector(ddx, ddy);

    // defaults

    /**
     * The rotation of the sprite around the origin in radians.
     * @memberof Sprite
     * @property {Number} rotation
     */
    this.rotation = 0;

    /**
     * How may frames the sprite should be alive. Primarily used by kontra.Pool to know when to recycle an object.
     * @memberof Sprite
     * @property {Number} ttl
     */
    this.ttl = Infinity;

    /**
     * The x and y origin of the sprite. {x:0, y:0} is the top left corner of the sprite, {x:1, y:1} is the bottom right corner.
     * @memberof Sprite
     * @property {Object} anchor
     *
     * @example
     * // exclude-code:start
     * let { Sprite } = kontra;
     * // exclude-code:end
     * // exclude-script:start
     * import { Sprite } from 'kontra';
     * // exclude-script:end
     *
     * let sprite = Sprite({
     *   x: 150,
     *   y: 100,
     *   color: 'red',
     *   width: 50,
     *   height: 50,
     *   // exclude-code:start
     *   ctx: ctx,
     *   // exclude-code:end
     *   render: function() {
     *     this.draw();
     *
     *     // draw origin
     *     this.ctx.fillStyle = 'yellow';
     *     this.ctx.beginPath();
     *     this.ctx.arc(this.x, this.y, 3, 0, 2*Math.PI);
     *     this.ctx.fill();
     *   }
     * });
     * sprite.render();
     *
     * sprite.anchor = {x: 0.5, y: 0.5};
     * sprite.x = 300;
     * sprite.render();
     *
     * sprite.anchor = {x: 1, y: 1};
     * sprite.x = 450;
     * sprite.render();
     */

    /**
     * The ctx the sprite will draw to.
     * @memberof Sprite
     * @property {Canvas​Rendering​Context2D} ctx
     */
    this.ctx = getContext();

    this.color = properties.color || '#fff';

     /**
     * The image the sprite will use when drawn if passed as an argument.
     * @memberof Sprite
     * @property {Image|HTMLCanvasElement} image
     */

    // add all properties to the sprite, overriding any defaults
    for (let prop in properties) {
      this[prop] = properties[prop];
    }
  }

  // define getter and setter shortcut functions to make it easier to work with the
  // position, velocity, and acceleration vectors.

  /**
   * X coordinate of the position vector.
   * @memberof Sprite
   * @property {Number} x
   */
  get x() {
    return this.position.x;
  }

  /**
   * Y coordinate of the position vector.
   * @memberof Sprite
   * @property {Number} y
   */
  get y() {
    return this.position.y;
  }

  /**
   * X coordinate of the velocity vector.
   * @memberof Sprite
   * @property {Number} dx
   */
  get dx() {
    return this.velocity.x;
  }

  /**
   * Y coordinate of the velocity vector.
   * @memberof Sprite
   * @property {Number} dy
   */
  get dy() {
    return this.velocity.y;
  }

  /**
   * X coordinate of the acceleration vector.
   * @memberof Sprite
   * @property {Number} ddx
   */
  get ddx() {
    return this.acceleration.x;
  }

  /**
   * Y coordinate of the acceleration vector.
   * @memberof Sprite
   * @property {Number} ddy
   */
  get ddy() {
    return this.acceleration.y;
  }

  set x(value) {
    this.position.x = value;
  }
  set y(value) {
    this.position.y = value;
  }
  set dx(value) {
    this.velocity.x = value;
  }
  set dy(value) {
    this.velocity.y = value;
  }
  set ddx(value) {
    this.acceleration.x = value;
  }
  set ddy(value) {
    this.acceleration.y = value;
  }

  /**
   * Check if the sprite is alive. Primarily used by kontra.Pool to know when to recycle an object.
   * @memberof Sprite
   * @function isAlive
   *
   * @returns {Boolean} `true` if the sprites [ttl](api/sprite/#ttl) property is above `0`, `false` otherwise.
   */
  isAlive() {
    return this.ttl > 0;
  }

  /**
   * burntcustard's Sprite's don't have update() or advance() methods!
   * Sprites have to do the velocity, position, etc. in their own update()s
   * @memberof Sprite
   * @function update
   *
   * @param {Number} [dt] - Time since last update.
   */
  // update(dt) {
  //   this.advance(dt);
  // }
  //
  // advance(dt) {
  //   this.velocity = this.velocity.add(this.acceleration, dt);
  //   this.position = this.position.add(this.velocity, dt);
  //
  //   this.ttl--;
  // }
};

function spriteFactory(properties) {
  return new Sprite(properties);
}
spriteFactory.prototype = Sprite.prototype;
spriteFactory.class = Sprite;

export { spriteFactory as Sprite }
