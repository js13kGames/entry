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
    const width = 200;
    const height = 400;
    const ctx = createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    function drawWindow (ctx, x, y) {
      const lightsOn = Math.random() >= .8;
      ctx.fillStyle = lightsOn ? 'yellow' : 'cyan';
      if (lightsOn) {
        ctx.filter = 'blur(15px)';
        ctx.fillRect(x, y, windowWidth, windowHeight);
        ctx.filter = 'none';
      }
      ctx.fillRect(x, y, windowWidth, windowHeight);
      ctx.filter = 'blur(1px)';
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 16, y + 20);
      ctx.lineTo(x + 9, y + 20);
      ctx.lineTo(x + windowWidth, y + windowHeight);
      ctx.stroke();
      ctx.filter = 'none';
    }

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 200, 400);
    ctx.fillStyle = '#4d4d4d';
    ctx.fillRect(0, 0, 100, 400);

    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = `#640`;
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        if (Math.random() >= .5) ctx.fillRect(x, y, 1, 1)
      }
    }
    ctx.globalCompositeOperation = 'source-over';

    const windowWidth = 24;
    const windowGap = 24;
    const windowHeight = 40;
    const floorGap = 28;

    for (var y = 18; (y + windowHeight) < 380; y += windowHeight + floorGap) {
      for (var x = 16; x < 200; x += (windowWidth + windowGap)) {
        drawWindow(ctx, x, y);
      }
    }

    ctx.fillStyle = 'cyan';
    ctx.fillRect(16, 360, 55, 30);
    ctx.fillRect(129, 360, 55, 30);
    ctx.fillRect(85, 360, 30, 40);

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
