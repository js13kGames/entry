export function collision(wall, hero) {
  return (wall.x < hero.x + hero.width &&
          wall.x + wall.width > hero.x &&
          wall.y < hero.y + hero.height
          && wall.y + wall.height > hero.y);
}

export const Collision = {
  Top: 'top',
  Left: 'left',
  Right: 'right',
  Bottom: 'bottom',
  None: 'none'
};

export function collisionPlus(wall, hero) {
  const heroBottom = hero.y + hero.height,
        heroRight = hero.x + hero.width,
        wallBottom = wall.y + wall.height,
        wallRight = wall.x + wall.width;

  const bCollision = wallBottom - hero.y,
        tCollision = heroBottom - wall.y,
        lCollision = heroRight - wall.x,
        rCollision = wallRight - hero.x;

  let res = Collision.None;

  if (tCollision < bCollision && tCollision < lCollision && tCollision < rCollision)
  {                           
    res = Collision.Top;
  }
  else if (bCollision < tCollision && bCollision < lCollision && bCollision < rCollision)                        
  {
    res = Collision.Bottom;
  }
  else if (lCollision < rCollision && lCollision < tCollision && lCollision < bCollision)
  {
    res = Collision.Left;
  }
  else if (rCollision < lCollision && rCollision < tCollision && rCollision < bCollision)
  {
    res = Collision.Right;
  }
  return res;
}
