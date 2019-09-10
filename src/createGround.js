import { Sprite } from "kontra";

export const createGround = (ctx, x) => {
  return Sprite({
    x: x, // starting x,y position of the sprite
    y: 141,
    color: "green", // fill color of the sprite rectangle
    width: 1, // width and height of the sprite rectangle
    height: 10,
    context: ctx,
  });
};
