import kontra from "kontra";
import { radiansToDegrees } from "../../misc/helper";

export default class Weapon {
  constructor(player) {
    this.player = player;

    this.syncPosition(player.getPlayerSprite());
  }

  syncPosition({ x, y }) {
    const sprite = this.getSprites();

    if (!this.animate) {
      sprite.x = x + 15;
      sprite.y = y + 35;
    }
  }

  getSprites() {
    if (!this.sprite) {
      const weapon = this;
      const player = this.player;

      this.sprite = kontra.Sprite({
        type: "weapon",
        x: 40,
        y: 50,
        dx: 0,
        height: 38,
        width: 16,
        image: document.querySelector("#sword"),
        anchor: { x: 0, y: 1 },
        rotation: 0,
        rotationDelta: player.swordSpeed
      });

      const spriteUpdate = this.sprite.update.bind(this.sprite);

      this.sprite.update = function() {
        spriteUpdate();

        if (weapon.animate) {
          this.rotation = this.rotation + player.swordSpeed;
        }
      }.bind(this.sprite);
    }

    return this.sprite;
  }

  throw(target) {
    const speed = 5;

    const tx = (target.x + this.sprite.width / 2) - (this.sprite.x + this.sprite.width / 2);
    const ty = (target.y + this.sprite.height / 2) - (this.sprite.y + this.sprite.height / 2);
    const dist = Math.sqrt(tx * tx + ty * ty);
    const targetDx = tx / dist * speed;
    const targetDy = ty / dist * speed;

    this.sprite.dx = targetDx;
    this.sprite.dy = targetDy;
    this.animate = true;
    this.sprite.ttl = 75;
  }
}
