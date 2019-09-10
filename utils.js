//@ts-ignore canvas
class Position {
  x;
  y;
  rotate;
}

// Get position of an object within the canvas by taking into account
// the position of the camera
function getCanvasPosition(
  objectPosition,
  cameraPosition,
  canvas,
  distance = 0
) {
  // distance affects how distant objects react to the camera changing
  // distant objects move slower that close ones (something like parallax)
  // that is, moving the ship will have less effect on distant objects
  // than near ones

  // distance is a value between 0 (close) and 1 (far)
  // at most the deviation factor will be 0.8
  let deviationFactor = 1 - distance * 0.2
  
  // include canvasSize / 2 because the camera is always pointing
  // at the middle of the canvas
  let canvasPosition = {
    x:
      objectPosition.x -
      (cameraPosition.x * deviationFactor - canvas.width / 2),
    y:
      objectPosition.y -
      (cameraPosition.y * deviationFactor - canvas.height / 2),
  }

  return canvasPosition
}

function randomInt(from, to) {
  return Math.random() * (to-from) + from;
}

function DegreesToRadians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}