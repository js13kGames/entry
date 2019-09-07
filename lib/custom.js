// Copy needed functions from plugins.js and paste them below
function internal_move(sprite) {
  sprite.x += sprite.vx | 0;
  sprite.y += sprite.vy | 0;
}
window.GA.custom = function(ga) {
  ga.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  ga.randomPick = function(list) {
    return list[ga.randomInt(0, list.length - 1)];
  };

  ga.move = function(sprites) {
    if (sprites instanceof Array === false) {
      internal_move(sprites)
    } else {
      for (var i = 0; i < sprites.length; i++) {
        internal_move(sprites[i])
      }
    }
  };

  ga.fourKeyController = function(s, speed, up, right, down, left) {
    //Create a `direction` property on the sprite
    s.direction = "";

    //Create some keyboard objects
    let leftArrow = ga.keyboard(left);
    let upArrow = ga.keyboard(up);
    let rightArrow = ga.keyboard(right);
    let downArrow = ga.keyboard(down);

    //Assign key `press` and release methods
    leftArrow.press = function() {
      s.vx = -speed;
      s.vy = 0;
      s.direction = "left";
    };
    leftArrow.release = function() {
      if (!rightArrow.isDown && s.vy === 0) {
        s.vx = 0;
      }
    };
    upArrow.press = function() {
      s.vy = -speed;
      s.vx = 0;
      s.direction = "up";
    };
    upArrow.release = function() {
      if (!downArrow.isDown && s.vx === 0) {
        s.vy = 0;
      }
    };
    rightArrow.press = function() {
      s.vx = speed;
      s.vy = 0;
      s.direction = "right";
    };
    rightArrow.release = function() {
      if (!leftArrow.isDown && s.vy === 0) {
        s.vx = 0;
      }
    };
    downArrow.press = function() {
      s.vy = speed;
      s.vx = 0;
      s.direction = "down";
    };
    downArrow.release = function() {
      if (!upArrow.isDown && s.vx === 0) {
        s.vy = 0;
      }
    };
  };

  ga.contain = function(s, bounds, bounce, extra){
    var x = bounds.x,
        y = bounds.y,
        width = bounds.width,
        height = bounds.height;

    //Set `bounce` to `false` by default
    bounce = bounce || false;

    //The `collision` object is used to store which
    //side of the containing rectangle the sprite hits
    var collision;

    //Left
    if (s.x < x) {

      //Bounce the sprite if `bounce` is true
      if (bounce) s.vx *= -1;

      //If the sprite has `mass`, let the mass
      //affect the sprite's velocity
      if(s.mass) s.vx /= s.mass;
      s.x = x;
      collision = "left";
    }

    //Top
    if (s.y < y) {
      if (bounce) s.vy *= -1;
      if(s.mass) s.vy /= s.mass;
      s.y = y;
      collision = "top";
    }

    //Right
    if (s.x + s.width > width) {
      if (bounce) s.vx *= -1;
      if(s.mass) s.vx /= s.mass;
      s.x = width - s.width;
      collision = "right";
    }

    //Bottom
    if (s.y + s.height > height) {
      if (bounce) s.vy *= -1;
      if(s.mass) s.vy /= s.mass;
      s.y = height - s.height;
      collision = "bottom";
    }

    //The `extra` function runs if there was a collision
    //and `extra` has been defined
    if (collision && extra) extra(collision);

    //Return the `collision` object
    return collision;
  };

  ga.hit = function(a, b, react, bounce, global, extra) {
    var collision;

    //Set the defaults
    react = react || false;
    bounce = bounce || false;
    global = global || false;

    //Check to make sure one of the arguments isn't an array
    if (b instanceof Array || a instanceof Array) {

      //If it is, check for a collision between a sprite and an array
      spriteVsArray();
    } else {

      //If one of the arguments isn't an array, find out what type of
      //collision check to run
      collision = findCollisionType(a, b);
      if (collision && extra) extra(collision);
    }

    //Return the result of the collision.
    //It will be `undefined` if there's no collision and `true` if
    //there is a collision. `rectangleCollision` sets `collsision` to
    //"top", "bottom", "left" or "right" depeneding on which side the
    //collision is occuring on
    return collision;

    function findCollisionType(a, b) {

      //Are `a` and `b` both sprites?
      //(We have to check again if this function was called from
      //`spriteVsArray`)
      var aIsASprite = a.parent !== undefined,
          bIsASprite = b.parent !== undefined;

      if (aIsASprite && bIsASprite) {

        //Yes, but what kind of sprites?
        if(a.diameter && b.diameter) {

          //They're circles
          return circleVsCircle(a, b);
        }
        else if (a.diameter && !b.diameter) {

          //The first one is a circle and the second is a rectangle
          return circleVsRectangle(a, b);
        }
        else {

          //They're rectangles
          return rectangleVsRectangle(a, b);
        }
      }

      //They're not both sprites, so what are they?
      //Is `a` not a sprite and does it have x and y properties?
      else if (bIsASprite && !(a.x === undefined) && !(a.y === undefined)) {

        //Yes, so this is a point vs. sprite collision test
        return ga.hitTestPoint(a, b);
      }
      else {
        //The user is trying to test some incompatible objects
        throw new Error("I'm sorry, " + a + " and " + b + " cannot be use together in a collision test.");
      }
    }

    function spriteVsArray() {

      //If `a` happens to be the array, flip it around so that it becomes `b`
      if (a instanceof Array) {
        var temp = a;
        b = a;
        a = temp;
      }

      //Loop through the array in reverse
      for (var i = b.length - 1; i >= 0; i--) {
        var sprite = b[i];
        collision = findCollisionType(a, sprite);
        if (collision && extra) extra(collision, sprite);
      }
    }

    function circleVsCircle(a, b) {

      //If the circles shouldn't react to the collision,
      //just test to see if they're touching
      if(!react) {
        return ga.hitTestCircle(a, b, global);
      }

      //Yes, the circles should react to the collision
      else {

        //Are they both moving?
        if (a.vx + a.vy !== 0 && b.vx + b.vy !== 0) {

          //Yes, they are both moving
          //(moving circle collisions always bounce apart so there's
          //no need for the third, `bounce`, argument)
          return ga.movingCircleCollision(a, b, global);
        }
        else {

          //No, they're not both moving
          return ga.circleCollision(a, b, bounce, global);
        }
      }
    }

    function rectangleVsRectangle(a, b) {

      //If the rectangles shouldn't react to the collision, just
      //test to see if they're touching
      if(!react) {
        return ga.hitTestRectangle(a, b, global);
      }
      //Yes
      else {

        //Should they bounce apart?
        //Yes
        if(bounce) {
          return ga.rectangleCollision(a, b, true, global);
        }
        //No
        else {
          return ga.rectangleCollision(a, b, false, global);
        }
      }
    }

    function circleVsRectangle(a, b) {

      //If the rectangles shouldn't react to the collision, just
      //test to see if they're touching
      if(!react) {
        return ga.hitTestCircleRectangle(a, b, global);
      }
      else {
        return ga.circleRectangleCollision(a, b, bounce, global);
      }
    }
  };

  ga.rotateAroundSprite = function(rotatingSprite, centerSprite, distance, angle) {
    rotatingSprite.x
      = centerSprite.centerX - rotatingSprite.parent.x
      + (distance * Math.cos(angle))
      - rotatingSprite.halfWidth;

    rotatingSprite.y
      = centerSprite.centerY - rotatingSprite.parent.y//centerSprite.y
      + (distance *  Math.sin(angle));
      // - rotatingSprite.halfWidth;
  };

  ga.rotateAroundPoint = function(pointX, pointY, distanceX, distanceY, angle) {
    var point = {};
    point.x = pointX + Math.cos(angle) * distanceX;
    point.y = pointY + Math.sin(angle) * distanceY;
    return point;
  };

  ga.followConstant = function(follower, leader, speed) {

    //Figure out the distance between the sprites
    var vx = leader.centerX - follower.centerX,
        vy = leader.centerY - follower.centerY,
        distance = Math.sqrt(vx * vx + vy * vy);

    //Move the follower if it's more than 1 move
    //away from the leader
    if (distance >= speed) {
      follower.x += (vx / distance) * speed;
      follower.y += (vy / distance) * speed;
    }
  };

  ga.hitTestRectangle = function(r1, r2, global) {
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

    //A variable to determine whether there's a collision
    hit = false;

    //Calculate the distance vector
    if (global) {
      vx = (r1.gx + r1.halfWidth) - (r2.gx + r2.halfWidth);
      vy = (r1.gy + r1.halfHeight) - (r2.gy + r2.halfHeight);
    } else {
      vx = r1.centerX - r2.centerX;
      vy = r1.centerY - r2.centerY;
    }

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

      //A collision might be occuring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {

        //There's definitely a collision happening
        hit = true;
      } else {

        //There's no collision on the y axis
        hit = false;
      }
    } else {

      //There's no collision on the x axis
      hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
  };

  ga.rectangleCollision = function(r1, r2, bounce, global) {
    var collision, combinedHalfWidths, combinedHalfHeights,
        overlapX, overlapY, vx, vy;

    //Set `bounce` to a default value of `true`
    if(bounce === undefined) bounce = false;

    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

    //Calculate the distance vector
    if(global) {
      vx = (r1.gx + r1.halfWidth) - (r2.gx + r2.halfWidth);
      vy = (r1.gy + r1.halfHeight) - (r2.gy + r2.halfHeight);
    } else {
      vx = r1.centerX - r2.centerX;
      vy = r1.centerY - r2.centerY;
    }

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check whether vx is less than the combined half widths
    if (Math.abs(vx) < combinedHalfWidths) {

      //A collision might be occurring!
      //Check whether vy is less than the combined half heights
      if (Math.abs(vy) < combinedHalfHeights) {

        //A collision has occurred! This is good!
        //Find out the size of the overlap on both the X and Y axes
        overlapX = combinedHalfWidths - Math.abs(vx);
        overlapY = combinedHalfHeights - Math.abs(vy);

        //The collision has occurred on the axis with the
        //*smallest* amount of overlap. Let's figure out which
        //axis that is

        if (overlapX >= overlapY) {

          //The collision is happening on the X axis
          //But on which side? vy can tell us
          if (vy > 0) {
            collision = "top";

            //Move the rectangle out of the collision
            r1.y = r1.y + overlapY;
          } else {
            collision = "bottom";

            //Move the rectangle out of the collision
            r1.y = r1.y - overlapY;
          }
          //Bounce
          if (bounce) {
            r1.vy *= -1;

            /*Alternative
            //Find the bounce surface's vx and vy properties
            var s = {};
            s.vx = r2.x - r2.x + r2.width;
            s.vy = 0;

            //Bounce r1 off the surface
            //bounceOffSurface(r1, s);
            */
          }
        } else {

          //The collision is happening on the Y axis
          //But on which side? vx can tell us
          if (vx > 0) {
            collision = "left";

            //Move the rectangle out of the collision
            r1.x = r1.x + overlapX;
          } else {
            collision = "right";

            //Move the rectangle out of the collision
            r1.x = r1.x - overlapX;
          }

          //Bounce
          if (bounce) {
            r1.vx *= -1;

            /*Alternative
            //Find the bounce surface's vx and vy properties
            var s = {};
            s.vx = 0;
            s.vy = r2.y - r2.y + r2.height;

            //Bounce r1 off the surface
            bounceOffSurface(r1, s);
            */
          }
        }
      } else {

        //No collision
      }
    } else {

      //No collision
    }

    //Return the collision string. it will be either "top", "right",
    //"bottom", or "left" depening on which side of r1 is touching r2.
    return collision;
  }
  
  ga.wait = function(duration, callBack) {
    return setTimeout(callBack, duration);
  };
};
