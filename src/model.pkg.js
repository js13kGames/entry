const initModel = (height, width, foodCoveragePercent) => {
  // display constants
  const OUT_OF_BOUNDS = uid();
  const BLOCKED = uid();
  const B = BLOCKED;
  const BUILDING_2X4 = uid();
  const OUT_OF_BOUNDS_CUTOFF = uid();
  const STREET = uid();
  const S = STREET;
  const PIZZA = uid();
  const EXIT = uid();

  const map = [];
  function makeMapCell (cellId, imgData) {
    return {
      displayId: cellId,
      canEnter: cellId > OUT_OF_BOUNDS_CUTOFF,
      itemId: null,
      imgData
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

  function getMapView (position, bufferRow, bufferCol) {
    return sliceMap(
      position.row - bufferRow,
      position.row + bufferRow,
      position.col - bufferCol,
      position.col + bufferCol
    );
  }

  function enableExit () {
    const newCell = makeMapCell(EXIT);
    map.push([newCell]);
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

  const buildingsPixels = {};

  const building2x4Img = (() => {
    const otherCanvas = document.createElement('canvas');
    const ctx = otherCanvas.getContext('2d');
    ctx.canvas.width = 200;
    ctx.canvas.height = 400;

    ctx.beginPath();
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, 200, 400);

    const windowWidth = 20;
    const windowGutter = 12;
    const windowHeight = 30;
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    for (var y = 8; (y + windowHeight) < 400; y += windowHeight + windowGutter) {
      for (var x = 10; x < 200; x += (windowWidth + windowGutter)) {
        ctx.fillRect(x, y, windowWidth, windowHeight);
      }
    }
    return ctx.getImageData(0, 0, 200, 400);
  })();
  const canvas = document.createElement('canvas');
  const newCtx = canvas.getContext('2d');
  buildingsPixels['2x4'] = buildings['2x4'].map((row, rowIdx) => (
    row.map((_, colIdx) => {
      newCtx.putImageData(building2x4Img, colIdx * -100, rowIdx * -100);
      return newCtx.getImageData(0, 0, 100, 100);
    })
  ));

  console.log(buildingsPixels)

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
  function addBuilding(map, row, column, building, pxs) {
    try {
      const start = map[row][column];
      const end = map[row + building.length - 1][column + building[0].length - 1];
      if (!start || !end) return;
    } catch (e) {
      console.error(e);
      return;
    }
    building.forEach((buildingRow, rowIndex) => {
      buildingRow.forEach((cell, colIndex) => {
        map[row + rowIndex][column + colIndex] = makeMapCell(cell, pxs[rowIndex][colIndex]);
      })
    })
  }
  // Loop through map rows to add buildings
  // TODO add a variety of buildings
  function addBuildings() {
    const b = buildings['2x4'];
    const bpx = buildingsPixels['2x4'];
    for (let row = 0; row < map.length; row += (b.length + 1)) {
      for (let column = 0; column < map[0].length; column += (b[0].length + 1)) {
        // iterating building with plus one street space
        if (map[row][column].canEnter) {
          addBuilding(map, row, column, b, bpx);
        }
      }
    }
  }

  function addFoods(numFoods, openSquares) {
    let foodsRemaining = numFoods;
    while (foodsRemaining) {
      const index = floor(random() * openSquares.length);
      const square = openSquares[index];
      square.itemId = PIZZA;
      openSquares = openSquares.slice(0, index).concat(openSquares.slice(index + 1));
      foodsRemaining--;
    }
  }

  function getOpenSquares() {
    let openSquares = [];
    map.forEach(row => {
      row.forEach(cell => {
        if (cell.canEnter) {
          openSquares.push(cell);
        }
      })
    });
    return openSquares;
  }

  // init
  initMap(height, width);
  addBuildings();
  const openSquares = getOpenSquares();
  const numFoods = floor(openSquares.length * foodCoveragePercent);
  addFoods(numFoods, openSquares);

  return {
    getMapView,
    cellIds: {
      OUT_OF_BOUNDS,
      BLOCKED,
      BUILDING_2X4,
      OUT_OF_BOUNDS_CUTOFF,
      STREET,
      PIZZA,
      EXIT
    },
    numFoods,
    enableExit
  };
};
