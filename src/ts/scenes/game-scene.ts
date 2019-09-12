/// <reference path="../consts.ts" />
/// <reference path="../scene.ts" />
/// <reference path="../button.ts" />
/// <reference path="../sprite.ts" />
/// <reference path="../dice.ts" />
/// <reference path="../encounter-factory.ts" />
/// <reference path="../scene-node.ts" />
/// <reference path="../util.ts" />

enum Phase {
  Begin,
  Rolling,
  Player,
  Enemy,
  Restock,
  Victory,
  GameOver
}

let fwdBtn: Button;
let endBtn: Button;
let phase: Phase;
let go_c: number;
let itemX: number;

const gameScene: Scene =
  new Scene(
    "Game",
    () => {
      go_c = 0;
      itemX = 195;
      phase = Phase.GameOver;
      const root: SceneNode = gameScene._root;

      if(document.monetization && document.monetization.state === "started") {
        const subItem: Item = bandageItem();
        subItem._name = "Coil Bonus Bandage";
        gameState._inventory.push(subItem);
        addItem(subItem);
      }

      root._add(gameState._tray);
      gameState._tray._rel = { x: 80, y: 280 };

      root._add(
        new Sprite(
          [
            { _tex: "g_0", _duration: 250 },
            { _tex: "g_1", _duration: 250 }
          ],
          { x: 0, y: 270 },
          { x: 5, y: 5 }));

      fwdBtn = new Button(
        "forward!",
        root._size.x - 120, root._size.y - 150,
        100, 30,
        (self: Button): void => {
          if (gameState._encounter) {
            gameScene._root._remove(gameState._encounter);
          }
          gameState._map._playerNode = gameState._map._playerNode._next;
          gameState._encounter = gameState._map._playerNode._encounter;
          gameScene._root._add(gameState._encounter);
          phase = Phase.Begin;
          if (gameState._food > 0) {
            gameState._food--;
          } else {
            gameState._hp--;
            if (gameState._hp <= 0) {
              phase = Phase.GameOver;
            }
          }
          self._enabled = self._visible = false;
          endBtn._enabled = endBtn._visible = false;
        },
        0xFF1A8944,
        0xFF1FA150,
        0xFF156E37);
      root._add(fwdBtn);

      endBtn = new Button(
        "end turn",
        root._size.x - 120, root._size.y - 150,
        100, 30,
        (self: Button): void => {
          if (phase === Phase.Player) {
            phase = Phase.Enemy;
          }
          self._enabled = self._visible = false;
        });
      root._add(endBtn);

      root._add(gameState._map);
    },
    () => {
    },
    (delta: number, now: number) => {
      if ((!gameState._encounter) && gameState._map._playerNode._next) {
        fwdBtn._enabled = fwdBtn._visible = true;
        endBtn._enabled = endBtn._visible = false;
      } else {
        if (phase === Phase.GameOver) {
          if (go_c >= 280) {
            SceneManager._pop();
            SceneManager._push("GameOver");
          }
          else {
            go_c += 4;
          }
        } else if (phase === Phase.Begin) {
          gameState._def = 0;
          gameState._debuffs.length = 0;

          if (gameState._encounter && gameState._encounter._type !== EncounterType.Loot) {
            getInventoryActions();
          } else if (gameState._encounter && gameState._encounter._type === EncounterType.Loot) {
            // limit player to 6 dice
            if (gameState._tray._dice.length >= 6) {
              gameState._encounter._removeActionCards("train");
              gameState._encounter._removeActionCards("take a risk");
              gameState._encounter._removeActionCards("meditate");
            }
          }
          phase = Phase.Rolling;
        } else if (phase === Phase.Restock) {
          for (const [id, child] of gameState._encounter._nodes) {
            if (child instanceof ActionCard) {
              child._reset();
            }
          }
          gameState._def = 0;

          let stuns: number = 0;
          for (const debuff of gameState._debuffs) {
            switch (debuff) {
              case "stun":
                stuns++;
                break;
              case "bleed":
                gameState._hp -= 1;
                break;
              default:
            }
          }
          gameState._tray._lock(stuns);

          gameState._debuffs.length = 0;
          phase = Phase.Rolling;
        } else if (phase === Phase.Rolling) {
          if (gameState._encounter._enemy) {
            gameState._encounter._enemy._roll(now);
          }
          gameState._tray._restock(now);
          phase = Phase.Player;
          endBtn._enabled = endBtn._visible = true;
        }

        switch (gameState._encounter._type) {
          case EncounterType.Boss:
          case EncounterType.Fight:
            if (phase === Phase.Player) {
              if (gameState._encounter._enemy && gameState._encounter._enemy._isDead && gameState._map._playerNode._next) {
                endBtn._enabled = endBtn._visible = false;
                fwdBtn._enabled = fwdBtn._visible = true;
              }
            } else if (phase === Phase.Enemy) {
              if (gameState._encounter._enemy) {
                gameState._encounter._enemy._turn();
              }
              if (gameState._hp <= 0) {
                phase = Phase.GameOver;
              } else {
                phase = Phase.Restock;
              }
            }
            break;
          case EncounterType.Loot:
          case EncounterType.Camp:
          case EncounterType.Empty:
          default:
            if (gameState._map._playerNode._next) {
              fwdBtn._enabled = fwdBtn._visible = true;
              endBtn._enabled = endBtn._visible = false;
            } else {
              fwdBtn._enabled = fwdBtn._visible = false;
            }
            break;
        }
      }
    },
    (delta: number) => {
      const root: SceneNode = gameScene._root;
      drawText(`food ${gameState._food}`, root._size.x - 70, root._size.y - 115, { _textAlign: Align.C, _scale: 2 });
      drawText(`def ${gameState._def}`, 80, 320, { _scale: 2, _colour: 0xFFF2A231 });
      drawText(`hp  ${gameState._hp > 0 ? gameState._hp : 0}/${gameState._maxHp}`, 80, 335, { _scale: 2, _colour: 0xFF3326BE });
      if (phase === Phase.GameOver) {
        gl._col(colourToHex(go_c > 255 ? 255 : go_c, 78, 72, 47));
        drawTexture("solid", 0, 0, 800, 450);
      }
    }
  );

function addItem(item: Item): void {
  gameScene._root._add(item);
  item._rel = { x: itemX, y: 330 };
  itemX += 17;
}
