function getColor (i = (Math.random() * 8)) {
  return ['black', 'white', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow'][parseInt(i, 10) % 8];
}

let map = [];

function sliceMap (startRow, endRow, startCol, endCol) {
  const slice = [];
  for (var row = startRow; row <= endRow; row++) {
    slice[row - startRow] = [];
    for (var col = startCol; col <= endCol; col++) {
      let value = 'black';
      try {
        value = map[row][col]
      } catch (_) {}
      slice[row - startRow].push(value);
    }
  }
  return slice;
}

export function getMapView(position, bufferRow, bufferCol) {
  return sliceMap(
    position.row - bufferRow,
    position.row + bufferRow,
    position.col - bufferCol,
    position.col + bufferCol
  );
}

// Building size options
const buildings = {
  '2x4': [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ],
  '4x2': [
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  '4x4': [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  '4x5xalley': [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
}

// Set map height and width
// 1 = player can access, 0 = can't
function initMap() {
  const height = 20;
  const width = 24;
  for (let x = 0; x < height; x++) {
    map[x] = [];
    for (let y = 0; y < width; y++) {
      map[x][y] = getColor(1);
    }
  }
}

// Make sure there is space on the map to add one building
function addBuilding(map, row, column, building) {
  console.log('adding one');
  try {
    const start = map[row][column];
    const end = map[row + building.length - 1][column + building[0].length - 1];
    if (!start || !end) return;
  } catch (e) {
    console.log(e);
    return;
  }
  building.forEach((buildingRow, rowIndex) => {
    buildingRow.forEach((cell, cellIndex) => {
      map[row + rowIndex][column + cellIndex] = getColor(cell);
    })
  })
}

// Loop through map rows to add buildings
// TODO add a variety of buildings
function addBuildings(map, buildings) {
  console.log('adding');
  const b = buildings['2x4'];
  for (let row = 0; row < map.length; row += (b.length + 1)) {
    for (let column = 0; column < map[0].length; column += (b[0].length + 1)) {
      if (map[row][column] === 'white') {
        addBuilding(map, row, column, b);
      }
    }
  }
}

export function init() {
  initMap();
  addBuildings(map, buildings);
}
