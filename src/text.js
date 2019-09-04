export function text(g, {
  text, x, y,
  font = '20px Arial',
  color = 'black'
}) {
  
  g.draw(ctx => {
    
    ctx.fillStyle = color;

    ctx.font = font;
    ctx.fillText(text, x, y);
    
  });

}
