const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'].map(_ => _.toUpperCase());

export default function textures() {

  const tss = {};

  tss['scoreLabel'] = labelTexture('SCORE');

  tss['letters'] = letters.map(labelTexture);
  
  return tss;
};

// const gridTexture = () => withCanvasTexture(1024, 1024, (w, h, ctx, canvas) => {
//   const gap = h * 0.01;

//   ctx.strokeStyle = 'white';
//   ctx.lineWidth = 1;
//   ctx.beginPath();

//   ctx.fillStyle = 'white';
//   ctx.moveTo(0, 0);
//   // ctx.fillRect(0, 0, 100, 100);

//   for (let i = 0; i < w; i+= gap) {
//     ctx.moveTo(i, 0);
//     ctx.lineTo(i, h);
//   }
//   for (let i = 0; i < h; i+= gap) {
//     ctx.moveTo(0, i);
//     ctx.lineTo(w, i);
//   }
//   ctx.stroke();

//   return canvas;
// });

const labelTexture = (label) => {
  return withCanvasTexture(label.length * 100 * 0.5, 100, (w, h,  ctx, canvas) => {


   // ctx.fillStyle = 'edrfe34v uyhtgrfecd nred';
    // ctx.fillRect(0, 0, w, h);
    ctx.font = 'bold 50pt Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, 50);
    
    return canvas;
  });
};

function withCanvasTexture(width, height, f) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  f(width, height, canvas.getContext('2d'), canvas);
  const texture = canvas;
  // document.body.append(canvas);
  return texture;
}
