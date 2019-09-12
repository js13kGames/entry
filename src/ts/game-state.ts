/// <reference path="./dice.ts" />
/// <reference path="./encounter.ts" />
/// <reference path="./item.ts" />

enum Dif {
  None,
  Easy,
  Medium,
  Hard
}

enum GameLen {
  None,
  Short,
  Medium,
  Long
}

type GameState = {
  _food: number;
  _maxHp: number;
  _hp: number;
  _def: number;
  _diff: Dif;
  _gameLength: GameLen;
  _tray: DiceTray;
  _map: EncounterMap;
  _mapLength: number;
  _encounter: Encounter;
  _debuffs: string[];
  _inventory: Item[];
  _lootDeck: Item[];
};

const gameState: GameState = {
  _food: 0,
  _hp: 0,
  _maxHp: 0,
  _def: 0,
  _diff: Dif.None,
  _gameLength: GameLen.None,
  _tray: null,
  _map: null,
  _mapLength: 0,
  _encounter: null,
  _debuffs: [],
  _inventory: [],
  _lootDeck: []
};

function attackPlayer(val: number): void {
  if (gameState._def > 0) {
    val -= gameState._def;
  }
  if (val > 0) {
    gameState._hp -= val;
  }
}

function heal(val: number): void {
  gameState._hp += val;
  if (gameState._hp > gameState._maxHp) {
    gameState._hp = gameState._maxHp;
  }
}

function getInventoryActions(): void {
  for (const item of gameState._inventory) {
    if (item._type === ItemType.combat &&
      (gameState._encounter._type === EncounterType.Fight || gameState._encounter._type === EncounterType.Boss)) {
      gameState._encounter._add(item._action());
    }
    if (item._type === ItemType.any) {
      gameState._encounter._add(item._action());
    }
  }
}
