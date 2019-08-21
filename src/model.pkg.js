const initModel = () => {
  const map = [];
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

  function getMapView(position, bufferRow, bufferCol) {
    return sliceMap(
      position.row - bufferRow,
      position.row + bufferRow,
      position.col - bufferCol,
      position.col + bufferCol
    );
  }

  function getColor (i = (Math.random() * 6)) {
    return ['black', 'white', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow'][parseInt(i, 10) % 6];
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
  function initMap(height, width) {
    for (let x = 0; x < height; x++) {
      map[x] = [];
      for (let y = 0; y < width; y++) {
        map[x][y] = getColor(1);
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
        map[row + rowIndex][column + cellIndex] = getColor(cell);
      })
    })
  }
  // Loop through map rows to add buildings
  // TODO add a variety of buildings
  function addBuildings(map, buildings) {
    const b = buildings['2x4'];
    for (let row = 0; row < map.length; row += (b.length + 1)) {
      for (let column = 0; column < map[0].length; column += (b[0].length + 1)) {
        if (map[row][column] === 'white') {
          addBuilding(map, row, column, b);
        }
      }
    }
  }

  function addFoods(percent, openSquares) {
    let numFoods = Math.floor(openSquares * percent * 10);
    // this does mean that the first open space will always have a pizza
    let counter = 1;
    map.forEach((row, rI) => {
      row.forEach((column, cI) => {
        if (column === 'white') {
          counter--;
          if (numFoods > 0 && counter === 0) {
            map[rI][cI] = getColor(2);
            numFoods--;
            // randomize counter reset
            counter = Math.ceil(Math.random() * 8);
          }
        }
      })
    })
  }

  function calculateOpenSquares(mapSize) {
    let numOpenSquares = 0;
    map.forEach(row => {
      row.forEach(column => {
        if (column === 'white') {
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
  addBuildings(map, buildings);
  const openSquares = calculateOpenSquares(mapSize);
  addFoods(foodCoveragePercent, openSquares);

  return {
    getMapView
  };
};
