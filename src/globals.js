export let nextScene
export let currentScore = 0
export let lineClears = 0
export let currentLevel = 1

export function setScene (scene) {
  nextScene = scene
}

export function resetScore () {
  currentScore = 0
}

export function addToScore (amount) {
  currentScore += amount
}

export function resetLineClears () {
  lineClears = 0
  currentLevel = 1
}

export function addLineClears (amount) {
  lineClears += amount
  currentLevel = Math.floor(lineClears / 10) + 1
}
