/// <reference path="./encounter.ts" />
/// <reference path="./action-factory.ts" />
/// <reference path="./enemy-factory.ts" />
/// <reference path="./util.ts" />
/// <reference path="./text.ts" />
/// <reference path="./game-state.ts" />
/// <reference path="./scenes/game-scene.ts" />

function emptyEncounter(encounter: Encounter = new Encounter()): Encounter {
  encounter._empty();
  encounter._name = "clearing";
  encounter._tips.length = 0;
  encounter._tips.push("be sure to forage food at every clearing");
  encounter._tips.push("if you run out of food, you will take damage each time you move forward");
  encounter._type = EncounterType.Empty;
  encounter._add(restAction());
  encounter._add(forageAction());
  return encounter;
}

function campEncounter(): Encounter {
  const encounter: Encounter = new Encounter();
  encounter._name = "camp";
  encounter._tips.push("camps are a great spot to gather food, and heal up");
  encounter._tips.push("increasing your max hp is helpful, but make sure it doesn't leave you starving!");
  encounter._type = EncounterType.Camp;
  encounter._add(eatAction());
  encounter._add(sleepAction());
  encounter._add(harvestAction());
  return encounter;
}

function enemyEncounter(difficulty: Dif, encounter: Encounter = new Encounter(), thirdAct: boolean = false): Encounter {
  encounter._type = EncounterType.Fight;
  encounter._name = "enemy";
  switch (difficulty) {
    case Dif.Medium:
      const rm: number = rand(0, 5);
      if (rm < 3) {
        encounter._enemy = boarEnemy();
        encounter._tips.push(stunTip);
      } else {
        encounter._enemy = wolfEnemy(thirdAct);
        encounter._tips.push(bleedTip);
      }
      break;
    case Dif.Hard:
      const rh: number = rand(0, 5);
      if (rh < 3) {
        encounter._enemy = wolfEnemy(thirdAct);
        encounter._tips.push(bleedTip);
      } else {
        encounter._enemy = bearEnemy();
        encounter._tips.push(stunTip);
        encounter._tips.push(bleedTip);
      }
      break;
    case Dif.Easy:
    default:
      encounter._enemy = snakeEnemy();
      encounter._tips.push("your defense goes back to zero after each turn");
      encounter._tips.push("after defeating an enemy, this area will turn into a clearing");
      encounter._tips.push("any remaining dice you have can be spent at this clearing");
  }
  encounter._add(encounter._enemy);
  encounter._enemy._rel = { x: encounter._size.x - 200, y: 270 };
  encounter._onComplete = () => {
    emptyEncounter(encounter);
    getInventoryActions();
  };
  encounter._add(attackAction());
  encounter._add(defendAction());
  return encounter;
}

function lootEncounter(encounter: Encounter = new Encounter()): Encounter {
  encounter._empty();
  encounter._name = "treasure";
  encounter._tips.length = 0;
  encounter._tips.push("read item descriptions carefully, sometimes food or hp will be better for you");
  encounter._tips.push("you can only have 6 dice total");
  encounter._type = EncounterType.Loot;
  encounter._add(obtainAction());
  encounter._add(abstainAction());
  encounter._add(sustainAction());
  encounter._add(trainAction());
  encounter._add(riskyAction());
  encounter._add(middlingAction());
  encounter._onComplete = () => { };
  return encounter;
}

function bossEncounter(difficulty: Dif, thirdAct: boolean = false): Encounter {
  const encounter: Encounter = enemyEncounter(difficulty, undefined, thirdAct);
  encounter._name = "boss fight";
  encounter._tips.push("boss enemies are twice as strong as their regular counterparts");
  encounter._enemy._desc[0] = `${encounter._enemy._desc[0]} + ${encounter._enemy._desc[0]}`;
  encounter._type = EncounterType.Boss;
  encounter._enemy._name = `boss ${encounter._enemy._name}`;
  encounter._enemy._hp = encounter._enemy._maxHp = ~~(encounter._enemy._maxHp * 2);
  const dice: Dice = new Dice(encounter._enemy._dice[0]._values, white, 1);
  dice._used = true;
  dice._rel.x = -33;
  encounter._enemy._add(dice);
  encounter._onComplete = () => {
    if (!thirdAct) {
      phase = Phase.Begin;
      lootEncounter(encounter);
    } else {
      phase = Phase.GameOver;
    }
  };
  return encounter;
}
