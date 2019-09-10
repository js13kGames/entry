import { Sprite } from "kontra";

export const createEnemy = ctx => {
  const size = Math.round(Math.random() * 20 + 5);
  var precision = 100; // 2 decimals
  var randomnum = () =>
    Math.floor(Math.random() * (5 * precision - 2 * precision) + 2 * precision) / (2 * precision);

  return Sprite({
    type: "bullet",
    x: -size * 0.5,
    y: -size * 0.5,
    // dx: randomnum(),
    // dy: randomnum(),
    dx: Math.random() * 5 - 2,
    dy: Math.random() * 5 - 2,
    radius: size,
    render() {
      this.context.fillStyle = "firebrick";

      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.context.fill();
    },
  });
};
