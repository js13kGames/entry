import * as u from './util';

export function ringGeometry(radius, end = u.TAU, edges = 10) {
  const vertices = [],
        lines = [],
        faces = [];

  let frontFace = [];
  let lineI = 0,
      faceI = 0;
  for (let a = 0; a < end; a+= u.PI / edges) {
    let c = Math.cos(a) * radius,
        s = Math.sin(a) * radius;
    vertices.push([c, s, 0]);
    frontFace.push(faceI++);

    if (lineI++ % 2 === 0) {
      lines.push([lineI, lineI - 1]);
    }
  }

  faces.push([...frontFace, 0]);

  let faceIndexes = {
    front: 0
  };

  return { vertices, lines, faces, faceIndexes };
}

export function planeGeometry(width, height = width) {
  const vertices = [],
        lines = [],
        faces = [];

  vertices.push([0, 0, 0]);
  vertices.push([0, height, 0]);
  vertices.push([width, height, 0]);
  vertices.push([width, 0, 0]);

  lines.push([0, 1]);
  lines.push([1, 2]);
  lines.push([2, 3]);
  lines.push([3, 0]);

  //front
  faces.push([0, 1, 2, 3, 0]);

  let faceIndexes = {
    front: 0,
  };

  return { vertices, lines, faces, faceIndexes };  
}

export function cubeGeometry(width, height = width, depth = width) {
  const vertices = [],
        lines = [],
        faces = [];

  vertices.push([0, 0, 0]);
  vertices.push([0, height, 0]);
  vertices.push([width, height, 0]);
  vertices.push([width, 0, 0]);

  vertices.push([0, 0, depth]);
  vertices.push([0, height, depth]);
  vertices.push([width, height, depth]);
  vertices.push([width, 0, depth]);

  lines.push([0, 1]);
  lines.push([1, 2]);
  lines.push([2, 3]);
  lines.push([3, 0]);

  lines.push([0, 4]);
  lines.push([1, 5]);
  lines.push([2, 6]);
  lines.push([3, 7]);

  lines.push([4, 5]);
  lines.push([5, 6]);
  lines.push([6, 7]);
  lines.push([7, 4]);

  //front
  faces.push([0, 1, 2, 3, 0]);
  //back
  faces.push([4, 5, 6, 7, 4]);
  //left
  faces.push([0, 4, 5, 1, 0]);
  //right
  faces.push([3, 7, 6, 2, 3]);
  //top
  faces.push([0, 4, 7, 3, 0]);
  // bottom
  faces.push([1, 5, 6, 2, 1]);

  let faceIndexes = {
    front: 0,
    back: 1,
    left: 2,
    right: 3,
    top: 4,
    bottom: 5
  };

  return { vertices, lines, faces, faceIndexes };
}

export function triGeometry(width, depth = 10) {
   const vertices = [],
        lines = [],
        faces = [];

  vertices.push([0, 0, 0]);
  vertices.push([0, width, 0]);
  vertices.push([width, 0, 0]);

  vertices.push([0, 0, depth]);
  vertices.push([0, width, depth]);
  vertices.push([width, 0, depth]);


  lines.push([0, 1]);
  lines.push([1, 2]);
  lines.push([2, 0]);

  lines.push([0, 3]);
  lines.push([1, 4]);
  lines.push([2, 5]);

  lines.push([3, 4]);
  lines.push([4, 5]);
  lines.push([5, 3]);

  // front
  faces.push([0, 1, 2, 0]);

  let faceIndexes = {
    'front': 0
  };

  return { vertices, lines, faces, faceIndexes };  
}

export function spikeGeometry(width, depth = 10) {
   const vertices = [],
        lines = [],
        faces = [];

  vertices.push([0, 0, 0]);
  vertices.push([width*0.5, width, 0]);
  vertices.push([width, 0, 0]);

  vertices.push([0, 0, depth]);
  vertices.push([width*0.5, width, depth]);
  vertices.push([width, 0, depth]);


  lines.push([0, 1]);
  lines.push([1, 2]);
  lines.push([2, 0]);

  lines.push([0, 3]);
  lines.push([1, 4]);
  lines.push([2, 5]);

  lines.push([3, 4]);
  lines.push([4, 5]);
  lines.push([5, 3]);

  // front
  faces.push([0, 1, 2, 0]);

  let faceIndexes = {
    'front': 0
  };

  return { vertices, lines, faces, faceIndexes };  
}
