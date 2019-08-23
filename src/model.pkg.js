const initModel = () => {
  // display constants
  const OUT_OF_BOUNDS = uid();
  const BLOCKED = uid();
  const B = BLOCKED;
  const BUILDING_2X4 = uid();
  const OUT_OF_BOUNDS_CUTOFF = uid();
  const STREET = uid();
  const S = STREET;
  const PIZZA = uid();

  const map = [];
  function makeMapCell (cellId) {
    return {
      displayId: cellId,
      canEnter: cellId > OUT_OF_BOUNDS_CUTOFF
    }
  }

  function sliceMap (startRow, endRow, startCol, endCol) {
    const slice = [];
    for (var row = startRow; row <= endRow; row++) {
      slice[row - startRow] = [];
      for (var col = startCol; col <= endCol; col++) {
        let value = makeMapCell(OUT_OF_BOUNDS);
        try {
          if (map[row][col]) value = map[row][col];
        } catch (_) {}
        slice[row - startRow].push(value);
      }
    }
    return slice;
  }

  function getMapView(position, bufferRow, bufferCol) {
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
      [BUILDING_2X4, B],
      [B, B],
      [B, B],
      [B, B]
    ],
    '4x2': [
      [B, B, B, B],
      [B, B, B, B]
    ],
    '4x4': [
      [B, B, B, B],
      [B, B, B, B],
      [B, B, B, B],
      [B, B, B, B]
    ],
    '4x5xalley': [
      [B, B, B, B],
      [B, B, B, B],
      [S, S, S, B],
      [B, B, B, B],
      [B, B, B, B]
    ]
  }

  // Set map height and width
  // 1 = player can access, 0 = can't
  function initMap(height, width) {
    for (let x = 0; x < height; x++) {
      map[x] = [];
      for (let y = 0; y < width; y++) {
        map[x][y] = makeMapCell(STREET);
      }
    }
  }

  // Make sure there is space on the map to add one building
  function addBuilding(map, row, column, building) {
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
        map[row + rowIndex][column + cellIndex] = makeMapCell(cell);
      })
    })
  }
  // Loop through map rows to add buildings
  // TODO add a variety of buildings
  function addBuildings() {
    const b = buildings['2x4'];
    for (let row = 0; row < map.length; row += (b.length + 1)) {
      for (let column = 0; column < map[0].length; column += (b[0].length + 1)) {
        // iterating building with plus one street space
        if (map[row][column].canEnter) {
          addBuilding(map, row, column, b);
        }
      }
    }
  }

  function addFoods(percent, openSquares) {
    let numFoods = floor(openSquares * percent * 10);
    // this does mean that the first open space will always have a pizza
    let counter = 1;
    map.forEach((row, rI) => {
      row.forEach((cell, cI) => {
        if (cell.canEnter) {
          console.log('canEnter!')
          counter--;
          if (numFoods > 0 && counter === 0) {
            console.log('adding za')
            map[rI][cI] = makeMapCell(PIZZA);
            numFoods--;
            // randomize counter reset
            counter = ceil(random() * 8);
          }
        }
      })
    })
  }

  function calculateOpenSquares(mapSize) {
    let numOpenSquares = 0;
    map.forEach(row => {
      row.forEach(cell => {
        if (cell.canEnter) {
          numOpenSquares++;
        }
      })
    });
    return numOpenSquares / mapSize;
  }

  // init
  const height = 20;
  const width = 24;
  const mapSize = height * width;
  const foodCoveragePercent = 10;
  initMap(height, width);
  addBuildings();
  const openSquares = calculateOpenSquares(mapSize);
  addFoods(foodCoveragePercent, openSquares);
  console.log(map)

  return {
    getMapView,
    cellIds: {
      OUT_OF_BOUNDS,
      BLOCKED,
      BUILDING_2X4,
      OUT_OF_BOUNDS_CUTOFF,
      STREET,
      PIZZA
    }
  };
};
