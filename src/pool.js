export default function Pool(makeCtrl, parentCtrl) {

  this.alive = [];
  this.dead = [];

  this.create = (d) => {
    if (this.dead.length > 0) {
      let ctrl = this.dead.pop();
      ctrl.init(d);
      this.alive.push(ctrl);
      return ctrl;
    } else {
      let newCtrl = new makeCtrl(parentCtrl);
      newCtrl.init(d);
      this.alive.push(newCtrl);
      return newCtrl;
    }
  };

  this.release = (ctrl) => {
    let i = this.alive.indexOf(ctrl);
    if (i > -1) {
      this.dead.push(this.alive.splice(i, 1)[0]);
    }
  };

  this.each = (f) => {
    this.alive.forEach(f);
  };

  this.find = (p) => {
    return this.alive.find(p);
  };

}
