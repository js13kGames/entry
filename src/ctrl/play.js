import { objFilter, objForeach, objMap } from '../util2';
import * as u from '../util';
import Pool from '../pool';

import * as levels from '../levels';

import makeTile from './tiles';
import makeBlock from './block';
import makeHero from './hero';
import makeGoal from './goal';
import makeExplosion from './explosion';

export default function ctrl(ctrl, g) {

  const { width, height, tileWidth } = ctrl.data.game;

  this.tiles = new Pool(id => new makeTile(ctrl), {
    warnLeak: 1000
  });

  this.hero = new makeHero(ctrl);

  this.blocks = new Pool(id => new makeBlock(ctrl, this, id));

  this.explosions = new Pool(id => new makeExplosion(ctrl, this));

  this.goal = new makeGoal(ctrl);

  const tilePos2WorldPos = pos => {
    return {
      x: -width * 0.45 + pos[1] * tileWidth,
      y: -height * 0.44 + pos[0] * tileWidth
    };
  };

  const worldPos2TilePos = pos => {
    return [
      u.clamp(0, levels.rows - 1, 
              Math.floor((pos.y + height * 0.44) / tileWidth)),
      u.clamp(0, levels.cols - 1, 
              Math.floor((pos.x + width * 0.45) / tileWidth))
    ];
  };

  let heroTile = [levels.rows - 2, levels.cols - 2];
  let goalTile = [2, levels.cols - 6];

  // goalTile = [levels.rows - 2, levels.cols - 8];

  let goalKey = levels.pos2key(goalTile);

  this.init = d => {
    this.data = {
      gameover: 0,
      goal: false,
      tiles: levels.make(),
      ...d
    };

    this.tiles.releaseAll();

    this.hero.init({
      ...tilePos2WorldPos(heroTile),
    });

    this.goal.init({
      ...tilePos2WorldPos(goalTile),
    });

    objForeach(this.data.tiles, (key, tile) => {
      const pos = levels.key2pos(key);

      tile.ctrl = this.tiles.acquire(_ => _.init({
        ...tilePos2WorldPos(pos),
        ...tile.role
      }));
    });
  };

  const collisionKeys = (dims) => {
    let collTiles = { 'lefttop': [dims.left, dims.top],
                     'leftbottom': [dims.left, dims.bottom],
                     'righttop': [dims.right, dims.top],
                     'rightbottom': [dims.right, dims.bottom]
                   };

    return objMap(collTiles, (_, pos) => 
      levels.pos2key(
        worldPos2TilePos({ x: pos[0], y: pos[1] }))
    );
  };

  const collisionsFromKeys = f => (collisions) => {
    let collTiles = objMap(collisions, (_, key) => {
      let tile = this.data.tiles[key];

      return f(tile);
    });

    return {
      left: collTiles['lefttop'] && collTiles['leftbottom'],
      top: collTiles['lefttop'] && collTiles['righttop'],
      right: collTiles['righttop'] && collTiles['rightbottom'],
      bottom: collTiles['rightbottom'] && collTiles['leftbottom']
    };
  };

  const collisionWithBlocks = collisionsFromKeys(tile => 
    tile.role.block);

  const collisionWithSpace = collisionsFromKeys(tile =>
    tile.role.role === 'space');

  const collisionWithKill = collisionsFromKeys(tile =>
    tile.role.kill);

  const collisionWithGravity = collisionsFromKeys(tile =>
    tile.role.gravity);

  const collisionWithGoal = collisionsFromKeys(tile =>
    tile.role.key === goalKey
  );

  const collisionsWithAll = collisionsFromKeys(tile => true);

  const updateTilesForCollisions = ({bottomF = u.noop, topF = u.noop}) => (collisionKeys, collisions) => {
    if (collisions.bottom) {
      [collisionKeys['rightbottom'],
       collisionKeys['leftbottom']]
        .map(_ => this.data.tiles[_].ctrl)
        .forEach(bottomF);
    } 
    if (collisions.top) {
      [collisionKeys['righttop'],
       collisionKeys['lefttop']]
        .map(_ => this.data.tiles[_].ctrl)
        .forEach(topF);
    }
  };

  const updateTileFacesForBlocks = updateTilesForCollisions({
    bottomF: _ => _.heroStep(),
    topF: _ => _.heroStep('bottom')
  });

  const updateTileFacesForBullets = updateTilesForCollisions({
    bottomF: _ => _.bulletStep(),
  });
  

  const updateHeroCollisions = delta => {
    const { before, after } = this.hero.entity.dimensions(delta);

    const afterCollisionKeys = collisionKeys(after);

    let blockCollisions = collisionWithBlocks(afterCollisionKeys);

    updateTileFacesForBlocks(afterCollisionKeys, blockCollisions);

    this.hero.entity.applyPhysics(delta, blockCollisions);

    let goalCollisions = collisionWithGoal(afterCollisionKeys);

    if (Object.keys(objFilter(goalCollisions, (_, v) => v)).length > 0) {

      this.goal.hit();

      this.data.goal = true;

      if (this.data.gameover === 0) {
        this.data.gameover = u.now();
      }

    }

    let gravityCollisions = collisionWithGravity(afterCollisionKeys);

    this.hero.hitGravity(gravityCollisions.top);

    let spikeCollisions = collisionWithKill(afterCollisionKeys);

    if (spikeCollisions.top || spikeCollisions.bottom) {
      this.explosions.acquireLimit(_ => _.init({
        x: after.left,
        y: after.top,
        z: 0
      }), 3);
      this.hero.hitSpike();
      if (this.data.gameover === 0) {
        this.data.gameover = u.now();
      }
    }
  };

  const updateBulletCollisions = delta => {
    this.hero.bullets.each(_ => {
      const { after } = _.entity.dimensions(delta);

      if (after.front > width * 0.1) {
        const afterCollisionKeys = collisionKeys(after);
        
        let allCollisions = collisionsWithAll(afterCollisionKeys);

        updateTileFacesForBullets(afterCollisionKeys, allCollisions);

      }
    });
  };

  const maybeSpawnBlock = u.withDelay(_ => {
    this.blocks.acquire(_ => _.init({
      ...tilePos2WorldPos([u.randInt(0, levels.rows), 
                           u.randInt(0, levels.cols)]),
    }));
  }, 1000);


  const maybeEndPlay = delta => {
    if (this.data.gameover > 0) {
      u.ensureDelay(this.data.gameover, () => {
        this.data.gameover = 0;
        ctrl.data.state = u.States.Over;
      }, 600);
    }
  };

  this.update = delta => {
    maybeSpawnBlock(delta);
    maybeEndPlay(delta);

    this.tiles.each(_ => _.update(delta));

    this.blocks.each(_ => _.update(delta));

    this.explosions.each(_ => _.update(delta));

    updateHeroCollisions(delta);
    updateBulletCollisions(delta);

    this.hero.update(delta);
  };
}
