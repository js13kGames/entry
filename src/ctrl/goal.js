import * as u from '../util';

export default function goal(ctrl) {

  const { camera } = ctrl;

  let material;

  this.init = d => {

    material = 'black';
    this.data = { ...d };
  };

  this.hit = () => {
    material = 'white';
  };

  this.material = () => material;

  this.view = () => {
    return camera.project([
      this.data.x,
      this.data.y,
      0
    ]);
  };
 
  this.update = delta => {
    
  };
 
}
