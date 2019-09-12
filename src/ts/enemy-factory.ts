/// <reference path="./sprite.ts" />
/// <reference path="./enemy.ts" />
/// <reference path="./util.ts" />

function snakeEnemy(): Enemy {
  const enemy: Enemy = new Enemy([1, 1, 2, 2, 3, 3]);
  enemy._name = "snake";
  enemy._desc.push("1-3 dmg");
  if (gameState._diff === Dif.Easy) {
    enemy._maxHp = enemy._hp = rand(7, 8);
  } else {
    enemy._maxHp = enemy._hp = rand(9, 10);
  }
  enemy._add(new Sprite(
    [
      { _tex: "s_0", _duration: 250 },
      { _tex: "s_1", _duration: 250 }
    ],
    { x: 0, y: 0 },
    { x: 5, y: 5 }));
  enemy._size = { x: 80, y: 80 };
  enemy._turn = () => {
    attackPlayer(enemy._dmg);
    const org: V2 = V2.copy(enemy._rel);
    enemy._moveTo(V2.add(enemy._rel, { x: -10, y: 0 }), 100, () => { zzfx(.1, .1, 440, .7, .4, 10, 2, 60, 0); enemy._moveTo(org, 50, null); }, easeInBack);
  };
  return enemy;
}

function boarEnemy(): Enemy {
  const enemy: Enemy = new Enemy([2, 2, 3, 3, 4, 5]);
  enemy._name = "boar";
  enemy._desc.push("2-4 dmg");
  enemy._desc.push("+stun");
  if (gameState._diff === Dif.Easy) {
    enemy._maxHp = enemy._hp = rand(10, 12);
  } else {
    enemy._maxHp = enemy._hp = rand(12, 15);
  }
  enemy._add(new Sprite(
    [
      { _tex: "b_0", _duration: 250 },
      { _tex: "b_1", _duration: 250 }
    ],
    { x: 0, y: 0 },
    { x: 5, y: 5 }));
  enemy._size = { x: 80, y: 80 };
  enemy._turn = () => {
    attackPlayer(enemy._dmg);
    gameState._debuffs.push("stun");
    const org: V2 = V2.copy(enemy._rel);
    enemy._moveTo(V2.add(enemy._rel, { x: -10, y: 0 }), 100, () => { zzfx(1, .1, 2, .2, .1, 1.5, .4, 22, .62); enemy._moveTo(org, 50, null); }, easeInBack);
  };
  return enemy;
}

function wolfEnemy(thridAct: boolean): Enemy {
  const enemy: Enemy = new Enemy([2, 2, 3, 3, 4, 4]);
  if (thridAct) {
    enemy._name = "greater wolf";
  } else {
    enemy._name = "lesser wolf";
  }
  enemy._desc.push("2-4 dmg");
  enemy._desc.push("+bleed");
  if (thridAct) {
    enemy._desc.push("+bleed");
    enemy._desc.push("+stun");
  }
  if (gameState._diff === Dif.Easy) {
    if (thridAct) {
      enemy._maxHp = enemy._hp = rand(15, 20);
    } else {
      enemy._maxHp = enemy._hp = rand(10, 12);
    }
  } else {
    if (thridAct) {
      enemy._maxHp = enemy._hp = rand(20, 25);
    } else {
      enemy._maxHp = enemy._hp = rand(12, 15);
    }
  }
  enemy._add(new Sprite(
    [
      { _tex: "w_0", _duration: 250 },
      { _tex: "w_1", _duration: 250 }
    ],
    { x: 0, y: 0 },
    { x: 5, y: 5 }));
  enemy._size = { x: 80, y: 80 };
  enemy._turn = () => {
    attackPlayer(enemy._dmg);
    gameState._debuffs.push("bleed");
    if (thridAct) {
      gameState._debuffs.push("bleed");
      gameState._debuffs.push("stun");
    }
    const org: V2 = V2.copy(enemy._rel);
    enemy._moveTo(V2.add(enemy._rel, { x: -10, y: 0 }), 100, () => { zzfx(1,.1,468,.6,.51,.1,0,0,.79); enemy._moveTo(org, 50, null); }, easeInBack);
  };
  return enemy;
}

function bearEnemy(): Enemy {
  const enemy: Enemy = new Enemy([3, 3, 4, 4, 5, 5]);
  enemy._name = "bear";
  enemy._desc.push("3-5 dmg");
  enemy._desc.push("+stun");
  enemy._desc.push("+stun");
  enemy._desc.push("+bleed");
  if (gameState._diff === Dif.Easy) {
    enemy._maxHp = enemy._hp = rand(15, 20);
  } else {
    enemy._maxHp = enemy._hp = rand(20, 25);
  }
  enemy._add(new Sprite(
    [
      { _tex: "br_0", _duration: 250 },
      { _tex: "br_1", _duration: 250 }
    ],
    { x: 0, y: 0 },
    { x: 5, y: 5 }));
  enemy._size = { x: 80, y: 80 };
  enemy._turn = () => {
    attackPlayer(enemy._dmg);
    gameState._debuffs.push("stun");
    gameState._debuffs.push("stun");
    gameState._debuffs.push("bleed");
    const org: V2 = V2.copy(enemy._rel);
    enemy._moveTo(V2.add(enemy._rel, { x: -10, y: 0 }), 100, () => { zzfx(.8,.1,100,.9,.1,0,3,0,0); enemy._moveTo(org, 50, null); }, easeInBack);
  };
  return enemy;
}
