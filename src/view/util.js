import { objForeach } from '../util2';

export function renderMesh(ctrl, g, mesh) {

  let material = mesh.material();
  let { view, lines, faces, faceIndexes } = mesh.geometry();

  g.draw(ctx => {

    objForeach(faceIndexes, (faceKey, faceIndex) => {
      ctx.fillStyle = material[faceKey] || `rgba(0, 0, 0, 0)`;

      let face = faces[faceIndex];

      ctx.beginPath();
      let v1 = view[face[0]];
      ctx.moveTo(v1[0], v1[1]);

      face
        .slice(1, face.length)
        .map(_ => view[_]).forEach(v => {
          ctx.lineTo(v[0], v[1]);
        });
      ctx.fill();
    });

    ctx.strokeStyle = material['stroke'] || `rgba(0, 0, 0, 0)`;
    lines.forEach(line => {
      ctx.beginPath();
      let v1 = view[line[0]],
          v2 = view[line[1]];

      ctx.moveTo(v1[0], v1[1]);
      ctx.lineTo(v2[0], v2[1]);
      ctx.stroke();
    });
    
  });
}
