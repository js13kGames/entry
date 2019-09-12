/// <reference path="./scene-node.ts" />
/// <reference path="./mouse.ts" />
/// <reference path="./draw.ts" />

enum ItemType { combat, dice, any }
class Item extends SceneNode {
  constructor(name: string, type: ItemType, action: () => ActionCard, spriteName: string, colour: number = white) {
    super();
    this._name = name;
    this._type = type;
    this._action = action;
    this._size = { x: 16, y: 16 };
    this._add(new Sprite([{ _tex: spriteName, _duration: 0 }], { x: 0, y: 0 }, { x: 2, y: 2 }, colour));
  }
  public _name: string = "";
  public _type: ItemType;
  public _action: () => ActionCard;
  public _update(delta: number, now: number): void {
    if (mouse._over.has(this._id)) {
      drawText(this._name, this._abs.x + 9, this._abs.y - 9, { _textAlign: Align.C });
    }
    super._update(delta, now);
  }
}
