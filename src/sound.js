import './jsfxr'

const BLAST = [3,0.41,0.19,0.09,0.54,0.3675,,-0.2497,,,,,,,,,0.4074,-0.0065,1,,,,,0.5]
const UPGRADE = [0,,0.038,0.5987,0.4229,0.8043,,,,,,0.5084,0.6852,,,,,,1,,,,,0.5]
const GAME_START_AND_BEATEN = [3,0.25,0.54,0.2,0.84,0.47,,1,,,,,,,,,0.58,,1,,,,,0.5]
const GAME_OVER = [3,,0.42,0.2,0.84,0.43,,-0.4399,,,,,,,,0.2,0.76,,1,,,,,0.5]
const PLAYER_HIT = [3,0.07,0.18,,0.25,0.68,,-0.48,,,,,,,,,,,1,,,,,0.5]

function playSound(data) {
  const player = new Audio()
  player.src = jsfxr(data)
  player.play()
}

const Sound = {
  blast: () => { playSound(BLAST) },
  upgrade: () => { playSound(UPGRADE) },
  gameOver: () => { playSound(GAME_OVER) },
  gameStartAndBeaten: () => { playSound(GAME_START_AND_BEATEN) },
  playerHit: () => { playSound(PLAYER_HIT) }
}

export default Sound