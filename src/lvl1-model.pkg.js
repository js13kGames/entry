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
const HOTDOG = uid();
const EXIT = uid();
const colorStreet = '#111327';

const initModel = (height, width, foodCoveragePercent) => {
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

  // Building size
  const building = [
    [BUILDING_2X4, B],
    [B, B],
    [B, B],
    [B, B]
  ];

  // Container to hold sliced image cells
  const buildingImageCells = {};

  // Create building styles
  function drawBuilding (color, type) {
    const [, ctx] = createCanvas('canvas');
    ctx.canvas.width = 200;
    ctx.canvas.height = 400;

    const fillStyle = s => { ctx.fillStyle = s; };
    const moveTo = (...a) => ctx.moveTo(...a);
    const lineTo = (...a) => ctx.lineTo(...a);
    const quad = (...a) => ctx.quadraticCurveTo(...a);
    const fill = () => ctx.fill();
    const fillRect = (...a) => ctx.fillRect(...a);
    const begin = () => ctx.beginPath();
    const close = () => ctx.closePath();

    fillStyle(colorStreet);
    ctx.fillRect(0, 0, 200, 400);

    // Sidewalk (5px rounded corner)
    fillStyle('#686868');
    moveTo(5, 354);
    lineTo(195, 354);
    quad(200, 354, 200, 359);
    lineTo(200, 395);
    quad(200, 400, 195, 400);
    lineTo(5, 400);
    quad(0, 400, 0, 395);
    lineTo(0, 359);
    quad(0, 354, 5, 354);
    fill();

    // streetlamp
    // glow
    begin();
    fillStyle('#DFD8C1');
    ctx.ellipse(16, 390, 12, 4, 0, 0, PI2)
    fill();
    // pole
    begin();
    fillStyle('#014404');
    ctx.fillRect(14, 370, 4, 20);
    // lamp
    begin();
    fillStyle('#FE8');
    ctx.arc(16, 372, 4, 0, PI2);
    fill();

    // Building
    // base color
    begin();
    ctx.fillStyle = color;
    moveTo(8, 10);
    lineTo(48, 0);
    lineTo(192, 0);
    lineTo(192, 391);
    lineTo(48, 391);
    lineTo(8, 358);
    close();
    fill();
    // shadow
    begin();
    fillStyle('rgba(0,0,0,0.3)');
    moveTo(8, 10);
    lineTo(48, 0);
    lineTo(48, 391);
    lineTo(8, 358);
    close();
    fill();

    // windows
    if (type == 1) {
      // horizontal windows
      for (let y = 25; y <= 241; y += 27) {
        fillRect(61, y, 115, 16)
      }
    } else if (type == 2) {
      // vertical windows
      for (let x = 61; x <= 160; x += 33) {
        fillRect(x, 25, 20, 321);
      }
    }
    return ctx.getImageData(0, 0, 200, 400);
  }

  // Create police car image 100x100
  const policeLeftImg = (() => {
    const [,ctx] = createCanvas();
    const size = 100;
    ctx.canvas.height = size;
    ctx.canvas.width = size;

    ctx.fillStyle = colorStreet;
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
      ctx.fillStyle = '#fff';
      ctx.fillRect(x + 12, y+10, 17, 12);

      // front wheel
      ctx.fillStyle = '#bbb';
      ctx.arc(x+8, y+22, 5, 0, PI2);
      ctx.fill();

      // back wheel
      ctx.arc(x+31, y+22, 5, 0, PI2);
      ctx.fill();

      // light
      ctx.beginPath();
      ctx.fillStyle = '#ff0'; // yellow
      ctx.arc(x+3, y+13, 2, 0, PI2);
      ctx.fill();
      ctx.closePath();
    }

    function makeCars () {
      makeCar(5, 19);
      makeCar(55, 53);
    }

    makeCars();

    return ctx.getImageData(0, 0, size, size);
  })();

  // slice building in to 100x100 image datas
  const sliceBuilding = (building, imageData) => {
    const [,ctx] = createCanvas();
    return building.map((row, rowIdx) => (
      row.map((_, colIdx) => {
        ctx.putImageData(imageData, colIdx * -100, rowIdx * -100);
        return ctx.getImageData(0, 0, 100, 100);
      })
    ));
  }

  buildingImageCells['2x4'] = sliceBuilding(building, drawBuilding('#01ADC4', 1));
  buildingImageCells['2x4-2'] = sliceBuilding(building, drawBuilding('#700', 2));


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
    const b = building;
    for (let row = 0; row < map.length; row += (b.length + 1)) {
      for (let column = 0; column < map[0].length; column += (b[0].length + 1)) {
        const bpx = buildingImageCells['2x4' + (random() < .5 ? '' : '-2')];
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
      const swap = floor(random() * arr.length);
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

  const openForPolice = getOpenSquares();
  const policeLocations = [0, 10, 48, 75, 100, 125, 156, 175, 200, 225, 250, 275, 300, 315, 325, 350, 375, 400, 425, 450, 455, 475, 500, 525, 528, 550, 575, 595, 625, 655, 675];
  for (let i = 0; i < policeLocations.length; i++) {
    openForPolice[policeLocations[i]].canEnter = false;
    openForPolice[policeLocations[i]].displayId = POLICE;
    openForPolice[policeLocations[i]].imgData = policeLeftImg;
  }

  const openSquaresForPizzas = getOpenSquares();
  const numFoods = floor(openSquaresForPizzas.length * foodCoveragePercent);
  dealShuffled(openSquaresForPizzas, numFoods)
    .forEach(square => { square.itemId = random() < .5 ? PIZZA : HOTDOG; });

  // TODO ensure port entrance is open

  return {
    getMapView,
    numFoods,
    enableExit
  };
};
