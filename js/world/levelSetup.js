// setuplevel()
// create all game elements using the input (l) level object

function setupLevel(l){

  // reset level objects
  ground = [];
  baddies = [];
  babies = [];
  currentPhase =0;
  sunPos = {x:canvasW/4,y:sunStart};
  levelRange = l.size;

  // create new ground platforms
  for(let i=0; i<l.plat.length; i++){
    ground.push( new groundTile(
      l.plat[i].x*10,
      canvasH-l.plat[i].y*10,
      l.plat[i].w*10
    ));

    // add trees to the platforms marked in the cosmetics array
    if(l.cosmetics.includes(i)) {
      let rand = randI(3);
      // .hasCos = 'has cosmetic item'. initially i wanted to add rocks too,
      // hence why it's not called .hasTree
      ground[ ground.length-1 ].hasCos = { x:l.plat[i].w*2, t:rand };}
  };

  // add baddies as described in the baddies array
  for(let i=0; i<l.baddies.length; i++){
    let res = getXYOnPlat(l.baddies[i],l.plat);
    let kit = l.baddies[i].kit;

    // assign display and update functions accordingly
    if(kit.t==="jump"){
      kit.d=displayJumpingBaddie;
      kit.u=updateJumpingBaddie;
    }
    else {
      kit.d=displayFlyingBaddie;
      kit.u=updateFlyingBaddie;
    }

    // create new baddie
    newBaddie( res.x, res.y, l.baddies[i].r, l.baddies[i].kit );
  }

  // add extra tiles throughout ground 0 with trees on em
  for(let i=0; i<l.size/150; i++){
    let rand = randI(3)
    ground.push(new groundTile( i*200+flRand(0,50), canvasH, 10 ));
    ground[ ground.length-1 ].hasCos = { x:0, t:rand };
  }

  // place player
  let p = getXYOnPlat(l.player,l.plat);
  player = new movingObject(p.x, p.y, 75,75,displayDudeBox,updatePlayerMotion,"player");
  player.sleeping = true;
  player.babiesCarried =0;
  // set home to player position
  startPos = {x:p.x,y:p.y,w:80,h:80};
  babiesReturned = 0;

  // place babies
  for(let i=0; i<l.babies.count; i++){
    l.babies.p  = l.babies.pos[ randI(l.babies.pos.length) ];
    let res = getXYOnPlat(l.babies,l.plat)
    newBaby( res.x+i*10,res.y )
  }

}
