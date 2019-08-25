import kontra from 'kontra';
import Monster from '../monster';

export default function skullFace() {
  const weaponSheet = kontra.SpriteSheet({
    image: document.querySelector("#weapons"),
    frameWidth: 8,
    frameHeight: 19,
    animations: {
      weapon: {
        frames: "1..1",
        frameRate: 1
      }
    }
  });

  return new Monster({
    baseHealth: 500,
    damage: 100,

    animations: {
      walk: {
        frames: "5..8",
        frameRate: 8
      },
      ouch: {
        frames: "9..9",
        frameRate: 1
      }
    },

    shouldAttack: monster => {
      const result = monster.attackAt && monster.attackAt < ~~new Date();

      if (!monster.attackAt || monster.attackAt < ~~new Date()) {
        monster.attackAt = ~~new Date() + 5000;
      }

      return result;
    },

    attack: (monster, sprite) => {
      const weaponDefaults = {
        monster,
        type: "monsterWeapon",
        x: sprite.x - 5,
        y: sprite.y + sprite.height / 2 + 10,
        dx: -2,
        height: 10,
        width: 4,
        animations: weaponSheet.animations,
        anchor: { x: 0.5, y: 0.5 },
        rotation: 0,
        rotationDelta: 1,
        update() {
          this.advance();
          this.rotation = this.rotation + 0.3;
        }
      };

      monster.weapons.push(kontra.Sprite({ ...weaponDefaults }));
      monster.weapons.push(
        kontra.Sprite({ ...weaponDefaults, dx: 2, x: sprite.x + sprite.width })
      );
      monster.weapons.push(
        kontra.Sprite({
          ...weaponDefaults,
          dx: 0,
          dy: -2,
          x: sprite.x + sprite.width / 2 - 5,
          y: sprite.y + 10
        })
      );
      monster.weapons.push(
        kontra.Sprite({
          ...weaponDefaults,
          dx: 0,
          dy: 2,
          x: sprite.x + sprite.width / 2 - 5,
          y: sprite.y + sprite.height + 5
        })
      );
    }
  });
}
