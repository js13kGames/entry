
// newBaddie()
// creates a new baddie during level setup.
// arguments: - x,y: coordinates at start
//            - range: distance to left and right motion boundaries
//            - kit: update and display functions

function newBaddie(x,y,range,kit){
  baddies.push( new movingObject(x, y, kit.w,kit.h,kit.d,kit.u, baddies.length) );
  let index = baddies.length-1;
  let b = baddies[index];
  b.leftBoundX = b.x - range;
  b.rightBoundX = b.x + range;
  b.stunTimer;
  b.stunned = false;
}
