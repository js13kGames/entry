import * as u from './util';


export default function defaults(width, height) {

  const ratio = height / width;

  const tileWidth = width * 0.031;

  const game = {
    highscore: 0,
    width,
    height,
    ratio,
    tileWidth
  };

  return {
    state: u.States.Over,
    game
  };
 
}
