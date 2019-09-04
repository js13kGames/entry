function createContext(width, height) {
  const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

  return ctx;
};

export default function graphics(state, screenCtx) {

  const { width, height } = state.game;

  this.noop = _ => {};

  this.buffers = {
    Screen: screenCtx,
    Collision: createContext(width, height)
  };

  this.renderTarget = this.buffers.Screen;

  this.raw = f => f(this.renderTarget);

  this.draw = (f, dims, transform) => {
    let cT = this.renderTarget.currentTransform;
    if (transform) {
      cT = transform(this.renderTarget, f, dims);
    } else {
      f(this.renderTarget, dims);
    }
    if (dims) {
      return boundsAfterCurrentTransform(dims, cT);
    } else {
      return null;
    }
  };

  this.stroke = col => this.raw(ctx => {
    ctx.strokeStyle = col;
  });

  this.path = ({ path, x, y, width, height, transform }, color) =>
  this.draw(ctx => {
    ctx.fillStyle = color;
    ctx.fill(path);
  }, { x, y, width, height }, transform);

  this.rect = ({ x, y, width, height, transform }, color) =>
  this.draw(ctx => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }, {x, y, width, height}, transform);

  this.image = ({ image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, transform }) =>
  this.draw(ctx => {
    ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }, { x: dx, y: dy, width: dWidth, height: dHeight }, transform);
}


export function makeTransform(props) {
  return (ctx, f, dims) => {
    if (props.transform) {
      return props.transform(ctx, () =>
        applyTransform(f, ctx, props, dims), 
        dims);
    } else {
      return applyTransform(f, ctx, props, dims);
    }
  };
}


function applyTransform(f,
                        ctx,
                        { translate, rotate, scale },
                        dims) {

  const { x, y, width, height } = dims,
        cx = x + 0.5 * width,
        cy = y + 0.5 * height;

  ctx.save();
  if (translate) {
    ctx.translate(translate[0], translate[1]);
  }
  if (rotate) {
    ctx.translate(cx, cy);
    ctx.rotate(rotate);
    ctx.translate(-cx, -cy);
  }
  if (scale) {
    ctx.translate(cx, cy);
    ctx.scale(scale[0], scale[1]);
    ctx.translate(-cx, -cy);
  }

  let ct = ctx.currentTransform;

  f(ctx, dims);

  ctx.restore();
  return ct;
};


function boundsAfterCurrentTransform(bounds, ct) {
  return { 
    x: ct.e + bounds.x * ct.a,
    y: ct.f + bounds.y * ct.d,
    width: bounds.width * ct.a,
    height: bounds.height * ct.d
  };
}
