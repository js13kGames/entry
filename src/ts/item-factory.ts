/// <reference path="./item.ts" />
/// <reference path="./util.ts" />

function daggerItem(): Item {
  return new Item(daggerName, ItemType.combat, daggerAction, "dag");
}

function swordItem(): Item {
  return new Item(swordName, ItemType.combat, swordAction, "sw");
}

function bucklerItem(): Item {
  return new Item(bucklerName, ItemType.combat, bucklerAction, "buc");
}

function shieldItem(): Item {
  return new Item(shieldName, ItemType.combat, shieldAction, "sh");
}

function bandageItem(): Item {
  return new Item(bandageName, ItemType.any, bandageAction, "heal");
}

function firstAidItem(): Item {
  return new Item(firstAidName, ItemType.any, firstAidAction, "heal");
}

function diceItem(): Item {
  return new Item("normal die", ItemType.dice, null, "die");
}

function riskyDiceItem(): Item {
  return new Item("risky die", ItemType.dice, null, "die", 0xFF8888FF);
}

function midDiceItem(): Item {
  return new Item("middle die", ItemType.dice, null, "die", 0xFFFF8888);
}
