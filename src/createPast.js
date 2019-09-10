import { Sprite } from "kontra";

export const createPast = canvas => {
  return Sprite({
    type: "past",
    x: -canvas.width + 10, // starting x,y position of the sprite
    y: 0,
    color: "grey", // fill color of the sprite rectangle
    width: canvas.width, // width and height of the sprite rectangle
    height: canvas.height,
  });
};
