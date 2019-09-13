class groundTile{
  constructor(x,y,w){
    this.x = x;
    this.y = y;
    this.w = w;
    this.hasCos = false;
  }

  display(){

    let pos = posOnScreen(this);

    // display ground tile
    for(let i=0; i<this.w/20; i++){
      displayImage( groundImg.a, groundImg.c, pos.x+i*20,this.y-yShift-4, 5,4,1 )
    }

    if(this.hasCos!=false && inBox(pos.x,pos.y,-80,0,canvasW+80,canvasH+80) ){
      let tree = trees[this.hasCos.t];
      let stretch = 3;
      displayTree(tree, pos.x+this.hasCos.x, this.y-yShift-tree.w*stretch,stretch)
    }
  }
}

function displayTree(tree,x,y,stretch){
  displayImage( tree.a, tree.c, x,y, tree.w,stretch,1 )
}
