import * as v from './vector';

const { vec3 } = v;

export default function physics(opts) {
  
   opts = { pos: vec3(0),
            vel: vec3(0),
            acc: vec3(0),
            theta: vec3(0),
            vTh: vec3(0),
            gravity: vec3(0, 10, 0),
            ...opts };

  let { pos, vel, acc, theta, vTh, gravity } = opts;

  this.jump = (xHeight, yHeight, zHeight) => {
    let s = vec3(xHeight, yHeight, zHeight);
    s = v.scale(s, -100 * 0.006);
    this.vel({ x: s[0], y: s[1], z: s[2] });
  };

  this.jump2 = (yHeight) => {
    let s = -1 * Math.sign(gravity[1]) *
        Math.sqrt(Math.abs(2 * gravity[1] * yHeight));
    this.vel({ x: 0, y: s, z: 0 });
  };

  this.move = (dir, grounded) => {
    let x = dir[0],
        xAcc = x * 2,
        xV = x * 20;

    this.acc({ x: xAcc });
    this.vel({ x: xV });
  };

  this.pos = ({ x = pos[0], y = pos[1], z = pos[2] }) => {
    pos = vec3(x, y, z);
  };

  this.vel = ({ x = vel[0], y = vel[1], z = vel[2] }) => {
    vel = vec3(x, y, z);
  };

  this.acc = ({ x = acc[0], y = acc[1], z = acc[2] }) => {
    acc = vec3(x, y, z);
  };

  this.rot = ({ x = theta[0], y = theta[1], z = theta[2] }) => {
    theta = vec3(x, y, z);
  };

  this.vrot = ({ x = vTh[0], y = vTh[1], z = vTh[2] }) => {
    vTh = vec3(x, y, z);
  };

  this.grav = grav => {
    gravity[1] = grav;
  };

  this.gravity = () => gravity[1];

  this.falling = () => gravity[1] > 0;
  this.flying = () => gravity[1] < 0;

  this.values = (_pos = pos, _theta = theta) => {

    return {
      x: _pos[0],
      y: _pos[1],
      z: _pos[2],
      theta: [_theta[0],
              _theta[1],
              _theta[2]]
    };
  };

  this.calculateUpdate = (delta, collisions = {}) => {
    const dt = delta * 0.01;

    let newTheta = v.addScale(theta, vTh, dt);

    let newVel = v.addScale(vel, acc, dt);
    newVel = v.addScale(newVel, gravity, dt);

    if ((collisions.top && newVel[1] < 0) ||
        (collisions.bottom && newVel[1] > 0)) {
      newVel[1] = 0;
    }
    if ((collisions.left && newVel[0] < 0) ||
        (collisions.right && newVel[0] > 0)) {
      newVel[0] = 0;
    }

    let newPos = v.addScale(pos, newVel, dt);

    return {
      theta: newTheta,
      vel: newVel,
      pos: newPos
    };
  };

  this.applyUpdate = update => {
    theta = update.theta;
    vel = update.vel;
    pos = update.pos;
  };

  this.update = delta => {
    this.applyUpdate(this.calculateUpdate(delta));
  };

}
