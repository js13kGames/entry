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
    return ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow'][parseInt(i, 10) % 6];
  }

  // init
  for (var row = 0; row < 101; row++) {
    map[row] = [];
    for (var col = 0; col < 101; col++) {
      map[row][col] = getColor();
    }
  }

  return {
    getMapView
  };
};
