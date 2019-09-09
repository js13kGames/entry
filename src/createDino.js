import { Sprite, SpriteSheet } from "kontra";

export let dino;

let image = new Image();
image.src = "dino.png";
image.onload = function() {
  const width = 24;
  const height = 30;
  let spriteSheet = SpriteSheet({
    image: image,
    frameWidth: width,
    frameHeight: height,
    animations: {
      idle: {
        frames: "0..2",
        frameRate: 5,
      },
      jump: {
        frames: "11..12",
        frameRate: 10,
        loop: true,
        frameRate: 3,
      },
      walk: {
        frames: "3..8",
        frameRate: 10,
      },
      moonwalk: {
        frames: "8..3",
        frameRate: 10,
      },
      cry: {
        frames: "15..15",
        frameRate: 10,
      },
    },
  });

  dino = Sprite({
    type: "dino",
    x: 125 + 12,
    y: 120,
    halfWidth: 7.5,
    halfHeight: 8.5,
    gravity: 0.75,
    grounded: false,
    jumping: false,
    lastY: 0,
    animations: spriteSheet.animations,
  });
};
