const initModel = (height, width, foodCoveragePercent) => {
  // display constants
  const OUT_OF_BOUNDS = uid();
  const BLOCKED = uid();
  const B = BLOCKED;
  const BUILDING_2X4 = uid();
  const POLICE = uid();
  const OUT_OF_BOUNDS_CUTOFF = uid();
  const STREET = uid();
  const S = STREET;
  const PIZZA = uid();
  const EXIT = uid();

  const map = [];
  // Create cell object
  function makeMapCell (cellId, imgData) {
    return {
      displayId: cellId,
      canEnter: cellId > OUT_OF_BOUNDS_CUTOFF,
      itemId: null,
      imgData
    }
  }

  // 2D slice of map matrix
  function sliceMap (startRow, endRow, startCol, endCol) {
    const slice = [];
    const oob = makeMapCell(OUT_OF_BOUNDS);
    for (var row = startRow; row <= endRow; row++) {
      slice[row - startRow] = [];
      for (var col = startCol; col <= endCol; col++) {
        let value = oob;
        try {
          if (map[row][col]) value = map[row][col];
        } catch (_) {}
        slice[row - startRow].push(value);
      }
    }
    return slice;
  }

  // Get the required cells for the view
  function getMapView (position, bufferRow, bufferCol) {
    return sliceMap(
      position.row - bufferRow,
      position.row + bufferRow,
      position.col - bufferCol,
      position.col + bufferCol
    );
  }

  // Add the exit cell
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

  // Container to hold sliced image cells
  const buildingsImageCells = {};

  // Create full size building image data 200x400
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

  // Create Full size building image data 200x400 (style 2)
  const building2x4Img2 = (() => {
    const ctx = createElement('canvas').getContext('2d');
    ctx.canvas.height = 400;
    ctx.canvas.width = 200;
    function drawWindow (ctx, x, y) {
      ctx.fillStyle = Math.random() < .8 ? 'cyan' : 'yellow';
      if (ctx.fillStyle === '#ffff00') {
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

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 200, 400);
    ctx.fillStyle = 'brown';
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.bezierCurveTo(50, 30, 25, 0, 100, 0);
    ctx.bezierCurveTo(175, 0, 150, 30, 200, 30);
    ctx.lineTo(200, 400);
    ctx.lineTo(0, 400);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.arc(100, 30, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = '#8c8c8c';
    ctx.fillRect(0, 0, 100, 400);
    ctx.fillStyle = `#640`;
    for (var x = 0; x < ctx.canvas.width; x++) {
      for (var y = 0; y < ctx.canvas.height; y++) {
        if (Math.random() >= .5) ctx.fillRect(x, y, 1, 1)
      }
    }
    ctx.globalCompositeOperation = 'source-over';

    const windowWidth = 24;
    const windowGap = 24;
    const windowHeight = 40;
    const floorGap = 28;

    for (var y = 87; (y + windowHeight) < 380; y += windowHeight + floorGap) {
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

  // Create police car image 100x100
  const policeLeftImg = (() => {
    const ctx = createElement('canvas').getContext('2d');
    const size = 100;
    ctx.canvas.height = size;
    ctx.canvas.width = size;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, size, size);

    // 40 x 27
    function makeCar (x, y) {
      ctx.beginPath();
      // siren light
      ctx.fillStyle = 'red';
      ctx.filter = 'blur(1px)';
      ctx.fillRect(x+15, y-2, 6, 5);
      ctx.filter = 'none';

      ctx.fillRect(x+16, y, 4, 3);

      const blue = 'blue';
      // car top
      ctx.strokeStyle = blue;
      ctx.lineWidth = 2;
      ctx.strokeRect(x+8, y+3, 25, 9);

      // car body
      ctx.fillStyle = blue;
      ctx.fillRect(x, y+10, 40, 12);

      // car white section
      ctx.fillStyle = 'white';
      ctx.fillRect(x + 12, y+10, 17, 12);

      // front wheel
      ctx.fillStyle = 'darkgray';
      ctx.arc(x+8, y+22, 5, 0, 2*Math.PI);
      ctx.fill();

      // back wheel
      ctx.arc(x+31, y+22, 5, 0, 2*Math.PI);
      ctx.fill();

      // light
      ctx.beginPath();
      ctx.fillStyle = 'yellow';
      ctx.arc(x+3, y+13, 2, 0, 2*Math.PI);
      ctx.fill();
      ctx.closePath();
    }

    function makeCars (x, y) {
      makeCar(60, 1);
      makeCar(30, 19);
      makeCar(0, 37);
      makeCar(30, 53);
      makeCar(60, 71);
    }

    makeCars(0, 0);

    return ctx.getImageData(0, 0, size, size);
  })();

  // slice building in to 100x100 image datas
  const sliceBuilding = (building, imageData) => {
    const ctx = createElement('canvas').getContext('2d');
    return building.map((row, rowIdx) => (
      row.map((_, colIdx) => {
        ctx.putImageData(imageData, colIdx * -100, rowIdx * -100);
        return ctx.getImageData(0, 0, 100, 100);
      })
    ));
  }

  buildingsImageCells['2x4'] = sliceBuilding(buildings['2x4'], building2x4Img);
  buildingsImageCells['2x4-2'] = sliceBuilding(buildings['2x4'], building2x4Img2);


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
    for (let row = 0; row < map.length; row += (b.length + 1)) {
      for (let column = 0; column < map[0].length; column += (b[0].length + 1)) {
        const bpx = buildingsImageCells['2x4' + (Math.random() < .5 ? '' : '-2')];
        // iterating building with plus one street space
        if (map[row][column].canEnter) {
          addBuilding(map, row, column, b, bpx);
        }
      }
    }
  }

  function dealShuffled (arr, draw) {
    let shuffled = [...arr];
    for (let i = 0; i < draw; i++) {
      const swap = Math.floor(random() * arr.length);
      [shuffled[i], shuffled[swap]] = [shuffled[swap], shuffled[i]];
    }
    return shuffled.slice(0, draw);
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
  dealShuffled(getOpenSquares(), 2)
    .forEach(cell => {
      cell.canEnter = false;
      cell.displayId = POLICE;
      cell.imgData = policeLeftImg;
    })

  const openSquaresForPizzas = getOpenSquares();
  const numFoods = floor(openSquaresForPizzas.length * foodCoveragePercent);
  dealShuffled(openSquaresForPizzas, numFoods)
    .forEach(square => { square.itemId = PIZZA; });

  // TODO ensure port entrance is open

  return {
    getMapView,
    cellIds: {
      OUT_OF_BOUNDS,
      BLOCKED,
      BUILDING_2X4,
      POLICE,
      OUT_OF_BOUNDS_CUTOFF,
      STREET,
      PIZZA,
      EXIT
    },
    numFoods,
    enableExit
  };
};
