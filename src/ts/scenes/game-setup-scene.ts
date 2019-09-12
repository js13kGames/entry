/// <reference path="../consts.ts" />
/// <reference path="../scene.ts" />
/// <reference path="../util.ts" />
/// <reference path="../dice.ts" />
/// <reference path="../button.ts" />
/// <reference path="../encounter.ts" />
/// <reference path="../game-state.ts" />
/// <reference path="../item.ts" />
/// <reference path="../item-factory.ts" />

let gameDifficultyContainer: SceneNode;
let gameLengthContainer: SceneNode;

const gameSetupScene: Scene =
  new Scene(
    "GameSetup",
    () => {
      gameState._tray = new DiceTray();
      gameState._tray._dice.push({ _values: [1, 2, 3, 4, 5, 6], _colour: white });
      gameState._tray._dice.push({ _values: [1, 2, 3, 4, 5, 6], _colour: white });
      gameState._food = 5;
      gameState._hp = 10;
      gameState._maxHp = 10;
      gameState._diff = Dif.None;
      gameState._gameLength = GameLen.None;

      gameDifficultyContainer = new SceneNode();
      gameDifficultyContainer._rel.x = SCREEN_WIDTH / 2 - 100;
      gameDifficultyContainer._rel.y = SCREEN_HEIGHT / 2 - 65;
      gameDifficultyContainer._size.x = 200;
      gameDifficultyContainer._size.y = 130;

      gameLengthContainer = new SceneNode();
      gameLengthContainer._rel.x = SCREEN_WIDTH / 2 - 100;
      gameLengthContainer._rel.y = SCREEN_HEIGHT / 2 - 65;
      gameLengthContainer._size.x = 200;
      gameLengthContainer._size.y = 130;

      gameSetupScene._root._add(gameDifficultyContainer);
      gameSetupScene._root._add(gameLengthContainer);

      gameDifficultyContainer
        ._add(new Button(
          "easy",
          0,
          0,
          200,
          30,
          () => {
            gameState._diff = Dif.Easy;
          }));

      gameDifficultyContainer
        ._add(new Button(
          "medium",
          0,
          50,
          200,
          30,
          () => {
            gameState._diff = Dif.Medium;
          }));

      gameDifficultyContainer
        ._add(new Button(
          "hard",
          0,
          100,
          200,
          30,
          () => {
            gameState._diff = Dif.Hard;
          }));

      gameLengthContainer._add(new Button(
        "short",
        0, 0,
        200, 30,
        () => {
          gameState._gameLength = GameLen.Short;
          setup();
          SceneManager._pop();
          SceneManager._push("Game");
        }));

      gameLengthContainer._add(new Button(
        "medium",
        0, 50,
        200, 30,
        () => {
          gameState._gameLength = GameLen.Medium;
          setup();
          SceneManager._pop();
          SceneManager._push("Game");
        }));

      gameLengthContainer._add(new Button(
        "long",
        0, 100,
        200, 30,
        () => {
          gameState._gameLength = GameLen.Long;
          setup();
          SceneManager._pop();
          SceneManager._push("Game");
        }));
    },
    () => {
    },
    (delta: number) => {
      if (gameState._diff === Dif.None) {
        gameDifficultyContainer._enabled = true;
        gameDifficultyContainer._visible = true;
        gameLengthContainer._enabled = false;
        gameLengthContainer._visible = false;
      } else {
        gameDifficultyContainer._enabled = false;
        gameDifficultyContainer._visible = false;
        gameLengthContainer._enabled = true;
        gameLengthContainer._visible = true;
      }
    },
    (delta: number) => {
      if (gameState._diff === Dif.None) {
        drawText("select game difficulty", SCREEN_WIDTH / 2, 100, { _textAlign: Align.C, _scale: 5 });
      } else {
        drawText("select game length", SCREEN_WIDTH / 2, 100, { _textAlign: Align.C, _scale: 5 });
      }
    }
  );

function setup(): void {
  gameState._inventory.length = 0;
  gameState._lootDeck.length = 0;
  gameState._lootDeck.push(daggerItem());
  gameState._lootDeck.push(daggerItem());
  gameState._lootDeck.push(swordItem());
  gameState._lootDeck.push(bucklerItem());
  gameState._lootDeck.push(bucklerItem());
  gameState._lootDeck.push(shieldItem());
  gameState._lootDeck.push(bandageItem());
  gameState._lootDeck.push(bandageItem());
  gameState._lootDeck.push(firstAidItem());

  gameState._lootDeck = shuffle(gameState._lootDeck);

  gameState._encounter = null;
  gameState._map = new EncounterMap();
  const gameMap: EncounterNode[] = [];

  const firstNode: EncounterNode = new EncounterNode(null);
  gameState._map._playerNode = firstNode;
  gameMap.push(firstNode);

  gameMap.push(...generateEncounterNodeDeck(Dif.Easy, gameMap[gameMap.length - 1], true));

  if (gameState._gameLength !== GameLen.Short) {
    gameMap.push(...generateEncounterNodeDeck(Dif.Easy, gameMap[gameMap.length - 1], true));
  }

  if (gameState._diff === Dif.Easy) {
    gameMap.push(...generateEncounterNodeDeck(Dif.Easy, gameMap[gameMap.length - 1], true));
  }

  const camp1: EncounterNode = new EncounterNode(campEncounter());
  gameMap[gameMap.length - 1]._next = camp1;
  camp1._previous = gameMap[gameMap.length - 1];
  gameMap.push(camp1);

  const firstBoss: EncounterNode = new EncounterNode(bossEncounter(Dif.Easy));
  gameMap[gameMap.length - 1]._next = firstBoss;
  firstBoss._previous = gameMap[gameMap.length - 1];
  gameMap.push(firstBoss);

  if (gameState._diff === Dif.Medium) {
    gameMap.push(...generateEncounterNodeDeck(Dif.Medium, gameMap[gameMap.length - 1], true));
  }

  gameMap.push(...generateEncounterNodeDeck(Dif.Medium, gameMap[gameMap.length - 1], true));

  if (gameState._gameLength !== GameLen.Short) {
    gameMap.push(...generateEncounterNodeDeck(Dif.Medium, gameMap[gameMap.length - 1]));
  }

  if (gameState._gameLength === GameLen.Long) {
    gameMap.push(...generateEncounterNodeDeck(Dif.Medium, gameMap[gameMap.length - 1]));
  }

  const camp2: EncounterNode = new EncounterNode(campEncounter());
  gameMap[gameMap.length - 1]._next = camp2;
  camp2._previous = gameMap[gameMap.length - 1];
  gameMap.push(camp2);

  const secondboss: EncounterNode = new EncounterNode(bossEncounter(Dif.Medium));
  gameMap[gameMap.length - 1]._next = secondboss;
  secondboss._previous = gameMap[gameMap.length - 1];
  gameMap.push(secondboss);

  if (gameState._diff === Dif.Hard) {
    gameMap.push(...generateEncounterNodeDeck(Dif.Hard, gameMap[gameMap.length - 1], true));
  }

  if (gameState._gameLength === GameLen.Long) {
    gameMap.push(...generateEncounterNodeDeck(Dif.Hard, gameMap[gameMap.length - 1]));
  }

  gameMap.push(...generateEncounterNodeDeck(Dif.Hard, gameMap[gameMap.length - 1], true));

  const camp3: EncounterNode = new EncounterNode(campEncounter());
  gameMap[gameMap.length - 1]._next = camp3;
  camp3._previous = gameMap[gameMap.length - 1];
  gameMap.push(camp3);

  const finalBossNode: EncounterNode = new EncounterNode(bossEncounter(Dif.Hard, true));
  gameMap[gameMap.length - 1]._next = finalBossNode;
  finalBossNode._previous = gameMap[gameMap.length - 1];
  gameMap.push(finalBossNode);

  gameState._mapLength = gameMap.length;
  gameState._map._add(...gameMap);

  let currentNode: EncounterNode = gameState._map._playerNode;
  const startingX: number = (SCREEN_WIDTH / 2) - (16 * ~~(gameState._mapLength / 2)) - (16 * (gameState._mapLength % 2));
  const drawPos: V2 = { x: startingX, y: 42 };
  while (currentNode !== null) {
    currentNode._rel = V2.copy(drawPos);
    drawPos.x += 16;
    currentNode = currentNode._next;
  }
}

function generateEncounterNodeDeck(difficulty: Dif, connectingNode: EncounterNode, loot: boolean = false): EncounterNode[] {
  const nodes: EncounterNode[] = [];
  nodes.push(new EncounterNode());
  nodes.push(new EncounterNode(enemyEncounter(difficulty, undefined, difficulty === Dif.Hard)));
  nodes.push(new EncounterNode(enemyEncounter(difficulty, undefined, difficulty === Dif.Hard)));

  if (loot) {
    nodes.push(new EncounterNode(lootEncounter()));
  }

  const deck: EncounterNode[] = shuffle(nodes);
  for (let i: number = 0; i < deck.length; i++) {
    if (i !== deck.length - 1) {
      deck[i]._next = deck[i + 1];
    }
    if (i !== 0) {
      deck[i]._previous = deck[i - 1];
    } else {
      connectingNode._next = deck[i];
      deck[i]._previous = connectingNode;
    }
  }
  return deck;
}
