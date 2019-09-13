"use strict";

// - - - - - - - - - - - - - - - - - - - - - - - - - 
//. Classes
// - - - - - - - - - - - - - - - - - - - - - - - - - 
class Vec {
    constructor(x=0,y=0) {
        this.x = x;
        this.y = y;
        this.m;
        return this;
    };
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    vFrD(d) {
        this.x = Math.cos(d);
        this.y = Math.sin(d);
        return this;
    };
    clear() {
        this.x = 0;
        this.y = 0;
        return this;
    };
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    scale(n) {
        this.x *= n;
        this.y *= n;
        return this;
    };
    dir(v) {
        return Math.atan2(this.y,this.x);
    };
    dist(v) {
        return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
    };
    mag() {
        this.m = Math.sqrt(this.x*this.x +this.y*this.y);
        return this.m;
    };
    unit() {
        this.mag();
        this.x /= this.m;
        this.y /= this.m;
        this.m = 1;
        return this;
    };
    dotPrd(v) {
        v.unit();
        return this.x * v.x + this.y *v.y;
    };
    project(v,out) {
        this.m = this.dotPrd(v);
        out.x = this.m * v.x;
        out.y = this.m * v.y;
        return out;
    };
    perp() {
        this.m = this.x;
        this.x = this.y;
        this.y = -this.m;
        return this;
    };
    limit(n) {
        this.mag();
        if(this.m > n) {
            this.unit();
            this.scale(n);
        }
        return this;
    }
};
class Obj {
    constructor(type='brick',round = false,w,h) {
        this.id =_id++,
        this.pos = new Vec();
        this.w = w||0;
        this.h = h||0;
        this.pos2 = new Vec();

        this.vel = new Vec();
        this.acc = 0.6;
        this.min = 256;
        this.max = 256;

        this.round = round;

        this.type = type;
        this.energy = 0;
        this.time = 0;
        this.reserve = 0;

        this._centre = new Vec();
        // this._split = 0;
        this._collis = {};
    };
    //. FINDS 4 CLOSEST CELLS TO TO OBJECT [NOT USEFUL FOR LARGE PLAYER OBJECT]
    setBP() {
        _fW = 512/11;
        _i = Math.floor(this.pos.y/_fW);
        this.rows = [_i,((this.pos.y%_fW)/_fW >= 0.5 ? _i+1 : _i-1)]
        

        _i = Math.floor(this.pos.x/_fW);
        this.cols = [_i,((this.pos.x%_fW)/_fW >= 0.5 ? _i+1 : _i-1)]
        // if(this.type == 'brick')
            // console.log(((this.pos.y%_fW)/_fW >= 0.5 ? _i+1 : _i-1))
            // console.log(_i,((this.pos.x%_fW)/_fW)>= 0.5 ? _i+1 : _i-1)

    };
    update(fT) {
        this.setBP();

        this.vel.limit(this.max);
        //. SCALE TO FRAME TIME
        _tVec.copy(this.vel).scale(fT/1000);

        switch(this.type) {
            case 'particle':
                // this.vel.x *= 0.99*fT/1000;
                this.vel.y += 5*fT/1000;
                // if(this.id == 29)
                    // console.log(this.pos)
                this.energy -= fT;
                this.min = this.energy/this.max;
                // console.log(this.id)
                if(this.energy <= 0)
                    particlesI.push(particlesA.splice(particlesA.indexOf(this),1));
            break;
            case 'ball':
                //  GET BALL UNSTUCK
                if(this.pos.dist(this.pos2)< 0.5) {
                    if(this.pos.y > 500)
                        ball.pos.y = 500;
                    if(this.pos.x < 12)
                        this.pos.x = 12;
                    if(this.pos.x > 500)
                        this.pos.x = 500;
                    // console.log('unstuck')
                }
                this.pos2.copy(this.pos);
                //  BOOST VELOCITY BASED ON BALLS ENERGY
                _tVec.scale(1+Math.min(this.max,this.energy/2000*this.max)/this.max);
                if(this.vel.mag()<this.max)
                    this.vel.unit().scale(this.max);
                //. MINIMUM SPEED
                if(Math.abs(this.vel.mag()) < this.min)
                    this.vel.unit().scale(this.min);
                if(this.energy < 0)
                    this.energy = 0;
                // console.log((1-this.energy/10000)/2)
                if(Math.random()>(1-this.energy/10000)/2-0.2)
                    addParticle([this.pos,300,{x:0,y:0},Math.min(11,1+11*this.energy/10000)/12,2,1,0.3])
                //     addParticle([this.pos,1000,_tVec.clear(),0,1])
            break;
            case 'brick':
                if(this.time) {
                    //. pos2 IS USED FOR IMAGE SOURCE min FOR TIME HIT
                    // this.pos2.x = 32 * Math.floor(8 - 7*(ease[3]((gameTime - this.min)/this.time)));

                    this.collis = [];
                    _fW = 0;
                    //.  FIND NEIGHBOURING BRICKS
                    for(_i=-1; _i<2; _i++) {
                        for(_j=-1; _j<2; _j++) {
                            if(brickL[this.col+_i]
                            && brickL[this.col+_i][this.row+_j])
                                _fW = brickL[this.col+_i][this.row+_j];
                            if(_fW && _fW.id !== this.id) this.collis.push(_fW)
                            // console.log(this.id,_fW);
                        }
                    }
                    // console.log(this.colour)
                    // this.collis.forEach(c=>console.log(c.colour))
                    //
                    this.collis.sort((a,b)=>Math.abs(this.colour-a.colour)<Math.abs(this.colour-b.colour));
                    // this.collis.forEach(c=>console.log(c.colour))
                    // console.log(this.collis)
                    //. LEECH ENERGY
                    this.collis.forEach((b,i) => {
                        if(this.energy > b. energy) {

                            // if(b.colour == this.colour)
                            if(Math.abs(this.colour - b.colour)<0.12
                            || Math.abs(this.colour - b.colour)>0.41) {
                                // if(Math.abs(this.colour - b.colour)>0.85)
                                //     console.log('greater')
                                b.energy += (1/this.collis.length) * 5 * this.energy * fT/1000;
                            }
                        }
                    });
                    this.collis.length = 0;
                    this.energy *= 1-(1*fT/1000)

                    //. OUT OF TIME
                    if(((gameTime - this.min)/this.time) > 1) {
                        this.time = 0;
                        score += Math.floor(1000 * ((1-gameTime/200000)/2+0.5));
                        // console.log(score, '+ '+ 1000 * ((1-gameTime/200000)/2+0.5));

                        
                        playBuffer(0.1,'test',72)
                        // console.log(Math.sqrt(this.energy))
                        for(_i=0; _i<Math.min(100,this.energy/20); _i++) {
                            _tVec2.vFrD(Math.floor(Math.random()*4)*(pi/2)).scale(Math.sqrt(this.energy)*3);
                            addParticle([{x:this.pos.x+Math.random()*this.w-this.w/2,y:this.pos.y+Math.random()*this.h-this.h/2}
                                ,300,_tVec2,
                                this.colour,
                                1,0.5,0.3])
                        }

                    
                        //. REMOVE FROM ACTIVE BRICKS, ADD TO INACTIVE BRICKS
                        bricksI.push(bricksA.splice(bricksA.indexOf(this),1));
                        delete brickL[this.col][this.row];

                    }
                    // this.collis.length = 0;

                    // console.log(brickL)

                    
                    // console.log(this.collis)

                    // if(this.time <= 0) {
                        // this.time = 0;
                    // }

                } else {
                    this.pos2.x = Math.floor(7-Math.min(this.energy/100,1)*7)*32
                    if(this.energy >= 100) {
                        this.energy -= 100;
                        // this.time = gameTime;
                        this.time = 500 - gameTime%500 + Math.floor(Math.random()*2)*125;
                        if(this.time < 250)
                            this.time += 250;
                        this.min = gameTime;
                    } else this.energy = Math.max(0,this.energy-fT/20)
                }
            // if(this.energy > 0)
                    // console.log(this.energy)
                // this.pos2.x = 

                // if(this.energy >= 100 || this.pos.y > 480) {
                    //. RESET ENERGY
                    // this.energy = 0;
                    //. REMOVE FROM ACTIVE BRICKS, ADD TO INACTIVE BRICKS
                    // bricksI.push(bricksA.splice(bricksA.indexOf(this),1));
                    // delete brickL[this.col][this.row];

                // } else {
                    //. REPORT LOCATION FOR BROADPHASE COLLISION DETECTION
                    //. TAKES DATA GATHERED IN this.setBP() AND STORES IT IN bp
                    //. TO BE USED LATER TO NARROW DOWN COLLISION RESULTS
                    this.rows.forEach(r => {
                        if(!bp[r]) bp[r] = [];
                        this.cols.forEach(c => {
                            if(!bp[r][c]) bp[r][c] = [];
                            bp[r][c].push(this);
                        })
                    });
                    if(this.acc > 0) {
                        this.acc -= fT;
                        if(this.acc < 0)
                            this.acc = 0;
                        // this.acc -= 100/8;
                    }
                // }
                
            break;
            case 'player':
                if(this.reserve > 10) {
                    this.energy += this.reserve * 0.6;
                    this.reserve *= 0.4;
                }               
            break;
        };
        this.pos.add(_tVec);

        // //. FLIP TO OTHER SIDE
        // if(this.pos.x < -this.w/2)
        //  this.pos.x += field.w;
        // if(this.pos.x + this.w/2 > field.w)
        //  this.pos.x -= field.w;

        // //  IS THIS OBJECT STRADDLING THE EDGE
        // if(this.pos.x <= this.w/2)
        //  this._split = 1;
        // else if(this.pos.x + this.w/2 > field.w)
        //  this._split = -1;
        // else this._split = 0;
    };
    render(ctx) {
        _ctx.save();
        _ctx.translate(this.pos.x,this.pos.y);
        // _ctx.rotate(1.57);
        //. DRAW OBJECT
        _ctx.fillStyle = 'red';
        switch(this.type) {
            case 'particle':
                _i = Math.max(Math.min(1,ease[3](this.min)),0)*this.time;
                _ctx.save();
                _ctx.scale(_i,_i);
                _ctx.globalCompositeOperation = 'add';
                _ctx.globalAlpha = this.collis;
                // _ctx.fillStyle = this.colour;
                // _ctx.fillStyle = 'white';

                // console.log(this.acc);
                // _ctx.fillRect(-4,-4,8,8);
                _i = Math.floor(this.colour*12);
                _ctx.drawImage(images['p'+this.reserve],32*(_i%4),32*Math.floor(_i/4),32,32,-16,-16,32,32);
                _ctx.restore();
            break;
            case 'ball':
            // console.log(this.vel.dir());
                this.time += this.vel.dir()/4;
                _ctx.save();
                _ctx.rotate(this.time);
                _ctx.drawImage(images['ball'],-9,-9);
                _ctx.restore();

                // _ctx.beginPath()
                // _ctx.arc(0,0,this.w/2,0,Math.PI*2);
                // _ctx.fill();
            break;
            case 'brick':
            // console.log('b'+Math.floor(8*this.colour/256))
                // _ctx.drawImage(images['b'+Math.floor(8*this.colour/256)],
                // _ctx.drawImage(images['b'+(this.colour/256>0.4?0:7)],
                // console.log('b'+Math.floor(this.colour*8))
                // if(this.id === 8)
                    // console.log((Math.floor(this.colour*4)+6)%12)
                    // console.log(Math.floor((Math.min(100,this.acc)/100)*7)*32)

                _ctx.drawImage(images['b'+((Math.floor(this.colour*7)+colourOffset)%12)],


                                // Math.floor((7-(Math.min(100,this.energy)/100)*8)|0)*32,
                                this.pos2.x,
                                Math.floor(Math.max(0,(Math.min(100,this.acc))/100)*7)*32,
                                // this.pos2.y,
                                32,32,
                                // -15,-15,30,30);
                                -this.w/2,-this.h/2,this.w,this.h);

            break;
            case 'player':
                _i = ease[2](Math.min(0.999,this.energy/10000))*100;
                // console.log(Math.floor(_i/20)*128,(_i%20)*25)
                // console.log(_i,Math.floor(_i%20)*25)
                _ctx.drawImage(images['player'],Math.min(896,Math.floor(_i/20)*128),
                                                Math.floor(_i%20)*25,
                                                128,
                                                24,
                                                -this.w/2,
                                                -this.h/2,
                                                this.w,
                                                this.h);
                // _ctx.fillRect(-this.w/2,-this.h/2,this.w,this.h);
            break;
        };
        // if(this.round) {
            
            
        // // } else {

        // //   _ctx.fillRect(-this.w/2,-this.h/2,this.w,this.h);
        // //   //  DRAW SECOND OBJECT WHEN STRADDLING
        // //   // if(this._split !== 0)
        // //   //  _ctx.fillRect(this._split*field.w-this.w/2,-this.h/2,this.w,this.h);
        // // }
        _ctx.restore();

        
    };
    get centre() {
        return this._centre.copy(this.pos);
    };
    get TL() {
        _tVec.x = this.pos.x - this.HW;
        _tVec.y = this.pos.y - this.HH;
        return _tVec;
    };
    get TR() { 
        _tVec.x = this.pos.x + this.HW;
        _tVec.y = this.pos.y - this.HH;
        return _tVec;
    };
    get BL() { 
        _tVec.x = this.pos.x - this.HW;
        _tVec.y = this.pos.y + this.HH;
        return _tVec;
    };
    get BR() { 
        _tVec.x = this.pos.x + this.HW;
        _tVec.y = this.pos.y + this.HH;
        return _tVec;
    }
    get HW() { return this.w/2};
    get HH() { return this.h/2};
}

let scale,
    Canvas = (w,h,context='2d') => {
        let cnv = document.createElement('canvas'),
            ctx = cnv.getContext(context);
        cnv.width = w;
        cnv.height = h;
        cnv.context = ctx;
        return cnv;
    },
    // o  = [ctx,[x,y,r,x1,y1,r1],[stop,colour],[stop,colour]...]
    makeRGrad = (o) => {
        _ctx = o[0];
        _fW = _ctx.createRadialGradient(o[1][0],o[1][1],o[1][2],o[1][3],o[1][4],o[1][5]);
        for(_k=2; _k<o.length; _k++)
            _fW.addColorStop(o[_k][0],[o[_k][1]]);
        return _fW;
    },
    hillNoise,
    hillNumber = 0,
    drawHill = (img) => {                
        _ctx = images[img].context;
        _ctx.clearRect(0,0,1024,1024);
        _ctx.strokeStlye = 'darkgreen';
        _ctx.fillStyle = 'green';
        _ctx.beginPath();
        _ctx.moveTo(0,1024);
        _ctx.lineTo(0,hillNoise[0][0]*4)
        for(_i=1; _i<32; _i++) {
            _ctx.quadraticCurveTo(_i*32,hillNoise[_i][hillNumber]*4,_i*32+16,((hillNoise[_i][hillNumber]+hillNoise[(_i+1)%32][hillNumber])/2)*4);
        }
        _ctx.lineTo(1023-16,1023);
        _ctx.closePath();
        _ctx.stroke();
        _ctx.fill();
        

        _ctx.save();
        _ctx = images['dmy'].context;
        _ctx.clearRect(0,0,1024,1024);
        _ctx.drawImage(images[img],0,0);
        _ctx.globalCompositeOperation = 'multiply';
        _ctx.drawImage(images['hG'],0,0);
        
        _ctx = images[img].context;
        _ctx.globalCompositeOperation = 'source-atop';
        _ctx.drawImage(images['dmy'],0,0);

        _ctx.globalCompositeOperation = 'destination-over';
        _ctx.fillStyle = 'blue';
        _ctx.fillRect(0,562,1008,462);

        _ctx.restore();
        
        // console.log(hillNumber)
        hillNumber = (hillNumber + 1) % 32;
    },
    drawAssets = o => {
        //  HILLS IN THE BACKGROUND
        BG.style.left = innerWidth/2 - 512 + 'px';
        BG.style.top = innerHeight/2 - 512 + 'px';
        for(_i=0;_i<8; _i++) {
            hills.push(new Obj('hill'))
        };
        hills.forEach((h,i) => {
            h.w = 1024;
            h.h = 1024;
            h.pos.y = (i/8)*512;
            h.acc = i;
        });

        let img = Canvas(256,256);
        _ctx = img.context;
        // _ctx.imageSmoothingEnabled = false;

        //  DRAWING BACKGROUND OF FIELD
        images['bgN'] = Canvas(512,512);
        makeNoise(images['bgN'].context,null,512,1/64,4,(n,x,y)=>[n,n,n]);
        images['bgM'] = Canvas(512,512);
        _ctx = images['bgM'].context;
        for(_i=0; _i<512; _i++) {
            for(_j=0; _j<512; _j++) {
                _k = (_j<51?_j/50:1)*Math.max(_i<51?1-_i/50:(_i>462?1-(511-_i)/50:0),
                    _j>462?1-(511-_j)/50:0);
                _ctx.fillStyle = 'rgba(0,0,0,'+_k+')';
                _ctx.fillRect(_i,_j,1,1);
            }
        }
        images['bg'] = Canvas(1024,1024);
        _ctx = images['bg'].context;
        for(_i=0; _i<4; _i++) {
            _ctx.drawImage(images['bgN'],_i%2*512,Math.floor(_i/2)*512);
        }
        //. DRAWING BRICKS
        //  NOISE TEXTURE FOR BRICKS
        images['n0'] = Canvas(32,32);
        makeNoise(images['n0'].context,null,32,1/32,2,(n,x,y)=> {
                n = Math.min(n*((x<9?x/8:(x>23?(31-x)/8:1))*0.9+0.1),
                    n*((y<9?y/8:(y>23?(31-y)/8:1))*0.9+0.1));
            return [n,n,n]
        });

        //  TWELVE BANKS OF 8x8 TILES
        for(_k=0; _k<12; _k++) {
            //  EACH BANK IT'S OWN 256x256 CANVAS
            images['b'+_k] = Canvas(256,256);
            _ctx = images['b'+_k].context;
            //  8x8 GRID OF TILES
            for(_i=0; _i<8; _i++) {
                for(_j=0; _j<8; _j++) {
                    //  NOISEY TEXTURE LESS APPARENT, DECREASING TO THE LEFT
                    _ctx.globalAlpha = 0.6*_i/8+0.4;
                    // if(_k == 1)
                    //     console.log(_i/8)
                    _ctx.drawImage(images['n0'],_i*32+1,_j*32+1,30,30);
                    _ctx.globalAlpha = 1;
                    _ctx.globalCompositeOperation = 'multiply';
                    //  SCALE CANVAS NUMBER TO HUE SCALE
                    _fW = ease[1](_k/12)*360;
                    //  EACH GRID IS EVENLY[ISH] SPREAD OUT ACROSS HUE BUT SHIFTS TO
                    //  180 DEGREES FROM THEIR CURRENT POSITION AS YOU MOVE DOWN THE CANVAS
                    _ctx.fillStyle = 'hsl('+((1-_j/8)*_fW+(_j/8)*(ease[0](_k/12)*330+180))
                                            //  80% - 100% SATURATION TOP TO BOTTOM
                                            +','+(_j/8*20+80)+'%,'
                                            //   COUNTS FROM 100ish DOWN TO 50
                                            +(100-100/16*(_i+1))+'%)';
                    //   FILL DEM BRICKS
                    _ctx.fillRect(_i*32+1,_j*32+1,30,30);
                }
            }
        }

        //  NOISE TEXTURE FOR PLAYER
        images['n1'] = Canvas(128,24);
        makeNoise(images['n1'].context,null,128,1/64,6,(n,x,y)=>{
                n = Math.min(n*(x<11?x/10:(x>117?(127-x)/10:1)),
                    n*(y<11?y/10:(y>13?(24-y)/10:1)));
            return [n,n,n]
        });
        //  8 COLUMNS OF 126x24 SPRITES, SLOWLY GLOWING BRIGHTER
        images['player'] = Canvas(1024,512);
        _ctx = images['player'].context;
        for(_i=0; _i<100; _i++) {
            //  Y POSITION OF CURRENT CELL
            _j = Math.floor(_i/20)*128;
            //  MAKE A RADIAL GRADIENT
            _ctx.fillStyle = makeRGrad([_ctx,
                                        //  X CENTERED
                                        [_j+64,
                                            //  Y AT THE BOTTOM OF THE CELL
                                            (_i%20)*25+12,
                                            //  RADIUS STARTING AT 10, INCREASING TO HALF THE WIDTH OF THE CELL
                                            (_i/100)*54+10,
                                            //  X CENTERED
                                            _j+64,
                                            //  Y AT THE BOTTOM OF THE CELL
                                            (_i%20)*25+12,
                                            //  0 RADIUS
                                            0],
                                        //  DARK GREEN EDGES
                                        [0,'hsl(100,80%,30%)'],
                                        //  LIGHT GREEN INTERIOR
                                        [1,'hsl(120,100%,50%)']
                                        ]);
            //  FILL DAT CELL
            _ctx.fillRect(_j+1,(_i%20)*25+1, 126, 24);
            //  OVERLAY NOISE
            _ctx.save();
            _ctx.globalCompositeOperation = 'multiply';
            _ctx.globalAlpha = 0.8-(_i/100)*0.8;
            _ctx.drawImage(images['n1'],_j+1,(_i%20)*25+1);
            _ctx.restore()
        }

        //  THE BALL
        images['ball'] = Canvas(18,18);
        _ctx = images['ball'].context;
        _fW = makeRGrad([_ctx,[8,8,8,8,8,0],[0,'grey'],[1,'white']]);
        _ctx.fillStyle = _fW;
        _ctx.beginPath();
        _ctx.arc(9,9,8,0,Math.PI*2);
        _ctx.fill();




        hillNoise = makeNoise(null,[],32,1/32,6,n=>n);
        //  HILL GRADIENT
        images['hG'] = Canvas(1024,1024);
        //  DUMMY EXTRA MAP
        images['dmy'] = Canvas(1024,1024);

        _ctx = images['hG'].context;
        _ctx.fillStyle = makeRGrad([_ctx,[512,0,1024,512,0 ,0],[0,'rgba(0,0,0,0.8)'],[0.7,'rgba(0,0,0,0)']]);
        _ctx.drawImage(images['bg'],0,0,1024,4096);
        _ctx.globalCompositeOperation = 'destination-in';
        _ctx.fillRect(0,0,1023,1023);
        for(_j=0; _j<8; _j++) {
            images['h'+_j] = Canvas(1024,1024);
            drawHill('h'+_j);
            
        }

        //  DRAW GRADIENT AND CLOUDS ON SKY
        _ctx = images['dmy'].context;
        _ctx.clearRect(0,0,1024,1024);
        // _ctx.fillStyle = makeRGrad([_ctx,[512,1024,1024,512,1024 ,0],[0,'rgba(0,0,1,1)'],[0.7,'rgba(0,0,1,0)']]);
        _ctx.fillStyle = makeRGrad([_ctx,[512,1024,1024,512,1024 ,0],[0,'darkblue'],[0.55,'rgba(0,0,0,0)']]);
        _ctx.fillRect(0,0,1024,1024);
        _ctx.globalCompositeOperation = 'source-atop';
        _ctx.drawImage(images['bg'],0,0);
        images['sG'] = Canvas(1024,1024);
        _ctx = images['sG'].context;
        // _ctx.fillStyle = makeRGrad([_ctx,[512,1536,2048,512,1536 ,0],[0,'darkblue'],[0.7,'cornflowerblue']]);
        _ctx.fillStyle = makeRGrad([_ctx,[512,1024,1024,512,1024 ,0],[0,'darkblue'],[0.7,'cornflowerblue']]);

        // _ctx.fillStyle = 'blue'
        _ctx.fillRect(0,0,1024,1024);
        _ctx.globalAlpha = 0.4;
        _ctx.globalCompositeOperation = 'screen';
        _ctx.drawImage(images['dmy'],0,0);


        //  PARTICLES
        for(_i=0; _i<4; _i++) 
            images['p'+_i] = Canvas(128,128);
        
        //  p0 = BALL/BRICK COLLISION PARTICLES
        _ctx = images['p0'].context;
        for(_k=0; _k<12; _k++) {
            for(_i=0; _i<32; _i++) {
                for(_j=0; _j<32; _j++) {
                    _ctx.fillStyle = 'hsla('+330*_k/12+',100%,50%,'+ease[2](1-(Math.abs(_i-16)/16))*ease[2](1-(Math.abs(_j-16)/16))+')';
                    _ctx.fillRect(_i+(_k%4)*32,_j+Math.floor(_k/4)*32,1,1);
                }
            }
        }
        //  BRICKSPLOSION AND PLAYER PARTICLES
        _ctx = images['p1'].context;
        for(_k=0; _k<12; _k++) {
            for(_i=0; _i<16; _i++) {
                for(_j=0; _j<16; _j++) {
                    _ctx.fillStyle = 'hsla('+330*_k/12+',100%,50%,'+Math.min(1,1.1*ease[3]((_i/16)*(_j/16)))+')';
                    _ctx.fillRect(_i+(_k%4)*32,_j+Math.floor(_k/4)*32,1,1);
                    _ctx.fillRect(31-_i+(_k%4)*32,_j+Math.floor(_k/4)*32,1,1);
                    _ctx.fillRect(_i+(_k%4)*32,31-_j+Math.floor(_k/4)*32,1,1);
                    _ctx.fillRect(31-_i+(_k%4)*32,31-_j+Math.floor(_k/4)*32,1,1);
                    // console.log((_i/31)*(_j/31))
                }
            }
        }
        //  BALL PARTICLES
        images['p2'] = Canvas(256,256);
        _ctx = images['p2'].context;
        for(_i=0; _i<12; _i++) {
            _ctx.fillStyle = 'rgba(255,'+255*(_i+1)/12+','+255*(_i+1)/12+',0.5)'
            _ctx.beginPath();
            _ctx.arc(16+(_i%4)*32,16+Math.floor(_i/4)*32,7,0,tau,false);
            _ctx.fill();
        }


        // _ctx = images['dmy'].context;
        // _ctx.globalCompositeOperation = 'source-over'
        // for(let i=0; i<12; i++) {
        //     _ctx.drawImage(images['b'+i],(i%4)*256,Math.floor(i/4)*256+i*10);
        // }
        // document.body.appendChild(images['p2']);
        // images['dmy'].style.zIndex =
        // images['p0'].style.position = 'fixed';
        // images['p0'].style.top = 0;
        
    },
    
// - - - - - - - - - - - - - - - - - - - - - - - - - 
//. Reuseable Variables
// - - - - - - - - - - - - - - - - - - - - - - - - - 
    _ctx,
    _fW,
    _i,_j,_k,
    _id = 0,
    _tVec = new Vec(),
    _tVec2 = new Vec(),
    _tBrick = new Obj(),
    _touch,
// - - - - - - - - - - - - - - - - - - - - - - - - - 
//. Timing
// - - - - - - - - - - - - - - - - - - - - - - - - - 
    paused = false,
    timePaused = 0,
    lastT = 0,
    deltaT = 0,
    simT = 1000/60,
    simulate = timeStamp => {
        if(!paused) {
            deltaT += timeStamp - lastT;
            lastT = timeStamp;

            begin(timeStamp);
            while(deltaT > simT) {
                deltaT -= simT;
                update(simT);
            }
            render();
            // console.log(lastT)
        } else {
            deltaT += timeStamp - lastT;
            lastT = timeStamp;
            while(deltaT > simT) {
                deltaT -= simT;
                timePaused += simT;
            }
            // console.log(lastT)
        }
        requestAnimationFrame(simulate);
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - 
//. Collision
// - - - - - - - - - - - - - - - - - - - - - - - - - 
    //  MINIMUM TRANLATION VECTOR
    mtv = new Vec(),
    collision = (o1,o2) => {
        mtv.clear();
        // if(o2.type === 'brick')
        // console.log(o1.type,o2.type)

        if(o1.round || o2.round) {
            if(o1.round && o2.round)
                return CvC(o1,o2);
            else if(!o1.round)
                return CvR(o2,o1);
            else return CvR(o1,o2,true);
        } else {
            return RvR(o1,o2);
        }
    },
    //. DISTANCE, HALF WIDTHS, HALF HEIGHTS
    dist, hWs, hHs,
    over = new Vec(),
    RvR = (o1,o2,invert) => {
        dist = o1.centre.sub(o2.centre);
        hWs = o1.w/2 + o2.w/2;
        hHs = o1.h/2 + o2.h/2;
        if(Math.abs(dist.x) < hWs) {
            if(Math.abs(dist.y) < hHs) {
                over.x = hWs - Math.abs(dist.x);
                over.y = hHs - Math.abs(dist.y);
                if(over.x > over.y) {
                    if(dist.y > 0) {
                        // mtv.side = 'bottom';
                        mtv.y = over.y;
                    } else {
                        // mtv.side = 'top';
                        mtv.y = -over.y;
                    }
                } else {
                    if(dist.x > 0) {
                        // mtv.side = 'right';
                        mtv.x = over.x;
                    } else {
                        // mtv.side = 'left';
                        mtv.x = -over.x;
                    }
                };
                if(invert) mtv.scale(-1);
                return true;        
            }
        }
        return false;
    },
    len, quadC, quadP, dirP, distP,
    quadrants = {
        0: 'BR',
        1: 'BL',
        '-1': 'TR',
        '-2': 'TL',
        2: 'TL'
    },
    // PvC = (p,c) => {
    //  if(c.pos.dist(p) < c.w/2) {
    //      // mtv.copy(c.pos).sub(p).unit().scale(c.w/2);
    //      return true;
    //  }
    //  return false;
    // },
    CvR = (c,r,invert) => {
        //. DISTANCE BETWEEN CIRCLE AND RECT CENTRES
        dist = c.centre.sub(r.centre);
        //. LENGTH OF CIRCLE RADIUS + RECT HALF DIAGONAL
        len = c.w/2 + _tVec.copy(r.TL).sub(r.centre).mag();
        // len = _tVec.copy(r.TL).sub(r.centre).mag();

        //. IF THE MAGNITUDE OF THE DISTANCE VECTOR IS SMALL ENOUGH TO POSSIBLY COLLIDE
        if(dist.mag() < len) {
            //. DIRECTION FROM CENTRE OF RECT TO CENTRE OF CIRCLE TRANSLATED TO QUADRANT
            quadC = quadrants[Math.floor(dist.dir()/Math.PI*2)];
            //. DISTANCE FROM CENTRE OF CIRCLE TO CORNER IN THAT QUADRANT 
            distP = c.centre.sub(r[quadC]);
            // _corner.copy(r[quadC]);
            //. DIRECTION OF CIRCLE FROM CORNER
            dirP = Math.floor(distP.dir()/Math.PI*2);
            //. QUADRANT THE CIRCLE IS IN RELATED TO THE CORNER OF THE RECT
            quadP = quadrants[dirP];
            // console.log(quadC,quadP);
            //. IF THE TWO QUADRANTS ARE THE SAME
            if(quadP === quadC) {
                // console.log('corner')
                if(distP.mag() < c.w/2) {
                    mtv.copy(distP).unit().scale(c.w/2-distP.mag());
                    if(invert) mtv.scale(-1);
                    return true;
                }
                return false;
            //. ELSE DO CIRCLE VS 
            } else return RvR(c,r,true);
            
        }
    },
    CvC = (o1,o2) => {
        dist = o1.centre.sub(o2.centre);
        hWs = o1.w/2 + o2.w/2;

        if(dist.mag()<hWs) {
            mtv.copy(dist).unit().scale(hWs-dist.mag());
            return true;
        }
        return false;
    },
    prj1 = new Vec(),
    prj2 = new Vec(),
    Bounce = v => {
        prj1 = v.project(mtv.perp(),prj1);
        prj2 = v.project(mtv.perp().unit(),prj2).scale(-1);
        return v.copy(prj1.add(prj2));
    },
// - - - - - - - - - - - - - - - - - - - - - - - - - 
//. Controls
// - - - - - - - - - - - - - - - - - - - - - - - - - 
    initControls = () => {
        addEventListener('mousemove',mouseHandler,false);
        addEventListener('mousedown',mouseHandler,false);
        addEventListener('mouseup',mouseHandler,false);

        addEventListener('touchstart',mouseHandler,false);
        addEventListener('touchend',mouseHandler,false);
        addEventListener('touchmove',mouseHandler,false);

        addEventListener('resize',resize,false);

        // addEventListener('keydown',keyHandler,false);

        socket.on('hiScores',s=>{
            hiScores = s;
        });
        socket.emit('getScores');
        setTimeout(()=>{
            if(!hiScores)
                socket.emit('getScores');
        },2000);
        socket.on('place',p=>{
            console.log('you placed ',p[0]+1,p[1]);
            hiScores = p[1];
            render();
        });


    },
    keyHandler = e => {
        if(e.keyCode == 32 ) {
            if(!paused)
                paused = true;
            else paused = false;
        }
        // console.log(e.keyCode)
    },
    // noScroll = e => {
    //  window.scrollTo(0,0);
    // },
    mouse = {x:0,y:0},
    tapHit = (n,t) => {
        tapHits.push([n,t]);
    },
    mouseHandler = e => {

        if(e.touches && e.touches[0]) {
            mouse.x = (e.touches[0].clientX - field.pos.x)/scale;
            mouse.y = e.touches[0].clientY;
        } else {
            mouse.x = (e.clientX - field.pos.x)/scale;
            mouse.y = e.clientY;
        }

        if(!dO && (e.type === 'mousedown'
        || e.type === 'touchstart')) {
            switch(gameState) {
                case 0:
                    //  CLICK ON HIGH SCORES
                    if(mouse.y > field.pos.y + 256
                    && mouse.x > 150
                    && mouse.x < 350) {
                        _fW = window.open('','Title');
                        _i = '<h3>BeatBricks High Scores</h3><ul>';
                        if(hiScores) {
                            hiScores.forEach(s => {
                                _i += '<li><p>' + s.s + ': ' + s.n + '</li>'
                            })
                        }
                        _i += '</ul>';
                        _fW.document.body.innerHTML = _i;
                    //  CLICK ANYWHERE ELSE TO START THE GAME
                    } else {
                        if(!ready)
                            start();
                        else {
                            if(!starting) {
                                starting = true;
                                setup();
                            }
                        }
                    }

                break;
                case 1:
                    _j = performance.now();
                    _i = Math.floor(_j-tapTime);
                    if(_i > 230 && _i < 270) {
                        tapHit(300,_j);
                        // playBuffer(0.1,'drum')
                    }
                    else if(_i > 470 && _i < 530) {
                        tapHit(750,_j);
                        // playBuffer(0.2,'drum')
                    }
                    else if(_i > 950 && _i < 1050) {
                        tapHit(1500,_j);
                        // playBuffer(0.5,'drum')
                    }
                    // console.log()
                    tapTime = _j|0;
                break;
            }
            
           
            
            
        };
        
        // ball.pos.copy(mouse);
        // _tVec.copy(testBrick.TR);
        // ball.energy = 2000;
        // ball.vel.copy(_tVec).sub(ball.pos);
    },


    submitHS = () => {

        hsName = document.getElementById('name').value;
        if(hsName) {
            localStorage['bbHiName'] = hsName;
            socket.emit('submitScore',{n:hsName,s:score});
            hsDiv.style.display = 'none';
            dO = false;
        }
        
    },
    cancelHS = () => {
        hsDiv.style.display = 'none';
        dO = false;
    },
    





// - - - - - - - - - - - - - - - - - - - - - - - - - 
//. Game Code
// - - - - - - - - - - - - - - - - - - - - - - - - - 
    aCtx,
    socket = io({ upgrade: false, transports: ["websocket"] }),
    dO = false, //  DIALOGUE OPEN
    hiScores,
    //  0 = MAIN MENU
    //  1 = PLAYING GAME
    //. 2 = GAME OVER
    gameState = 0,
    ready = false,
    starting = false,
    
    hiScore = localStorage.bbHiScore || 0,
    hsDiv = document.getElementById('subScoreDiv'),
    hsName = localStorage.bbHiName,
    score = hiScore,
    gameTime = 0,
    overTime = 0,
    tapTime = 0,
    tapHits = [],
    _tH,
    hitTime = 0,
    beat = 0,
    maxD = 1.5,
    BG = Canvas(1024,1024),
    screen = Canvas(innerWidth,innerHeight),
    hills = [],
    levelMap = [],
    colourOffset = 0,
    images = {},

    field = new Obj('field',0,512,512),
    player = new Obj('player'),

    bgPos = new Vec(),

    ball = new Obj('ball',true),

    brick = new Obj('brick'),

// testBrick,
// _corner = new Vec(),
    bricksA = [],
    bricksI = [],
    brickL = {},
    rowNum = 0,

    particlesA = [],
    particlesI = [],


    intrvl,
    intCount = -1,
    dNote,

    bp = [],

    controlTimer = 0,
    printed = false,

    start = () => {
        if(!aCtx) {
            aCtx = new (window.AudioContext || window.webkitAudioContext)();
            prepareSounds();
        }
        ready = true;
    },
    gameOver = (state) => {
        // clearInterval(intrvl);
        for(_i=bricksA.length-1; _i>=0; _i--)
            bricksI.push(bricksA.splice(_i,1))
        Y = 0.5;
        gameState = state;
    },

    setup = (s) => {
        // _i = localStorage['bbMessageNumber'] || 0;
        randomMessage = (randomMessage + 1) % messages.length;
        localStorage['bbMessageNumber'] = randomMessage;
        // console.log(localStorage['bbMessageNumber']);
        //  RANDOMIZE BRICK COLOURS
        colourOffset = Math.floor(Math.random()*9)+10;
        
        //  USED FOR NORMALIZING NOISE
        _tVec.x = 0.5;
        _tVec.y = 0.5;
        //  USE NOISE TO DRAW MAP OF COLOURS FOR BRICKS
        makeNoise(null,levelMap,16,1/4,4,n=>{
                        //  n IS BETWEEN 0 - 256
                        //  TRACK LOWEST AND HIGHEST VALUES
                        if(n/256 < _tVec.x)
                            _tVec.x = n/256;
                        if(n/256 > _tVec.y)
                            _tVec.y = n/256
                        //  SCALE TO 0 - 1
                        return n/256;
                    },1,2);
        //  CYCLE THROUGH AND NORMALIZE THE levelMap USING THE LOWEST AND HIGHEST NUMBERS
        for(_i=0; _i<16; _i++) {
            for(_j=0; _j<16; _j++) {
                levelMap[_i][_j] = (1/(_tVec.y-_tVec.x))*(levelMap[_i][_j] - _tVec.x);
            }
        }

        //  STARTING VALUES FOR MANY THINGS
        player.pos.x = 192;
        player.pos.y = 512;

        player.w = 128;
        player.h = 24;
        player.max = 1000;
        player.energy = 0;
        mouse.x = 256;

        ball.w = 16;
        ball.h = 16;
        ball.pos.x = 235;
        ball.pos.y = 200;
        ball.energy = 0;

        ball.vel.x = 1;
        ball.vel.y = 0;

        gameTime = 0;
        

        brickL = {};
        score = 0;

        
        setTimeout(()=>{
            gameState = 4;
            gameTime = -4000;
            starting = false;
        },1000)
        
        // paused = true;

        

    },
    W,H,
    Y = 0.5,
    resize = () => {
        W = innerWidth;
        H = innerHeight;
        screen.width = W;
        screen.height = H;
        
        if(W*1.2 > H)
            scale = (H * 0.75)/512;
        else scale = 0.9*W/512;
        field.pos.x = W/2 - field.w*scale/2;
        field.pos.y = Y*H - field.h*scale/2;
        // field.pos.y = H/2 - field.h*scale/2;
        // console.log(H,field.h*scale)
        BG.style.left = innerWidth/2 - 512 + 'px';
        BG.style.top = innerHeight/2 - 512 + 'px';
        
    },

    //. BRICK WIDTH, GAP WIDTH
    addRow = () => {

        //. 16 BRICKS ACROSS
        for(_i=0; _i<16; _i++) {
            //. CHECK FOR USED BRICKS
            if(bricksI.length > 0) 
                _tBrick = bricksI.pop()[0];
            //  ELSE CREATE A NEW BRICK
            else _tBrick = new Obj('brick');
            //. POSITION BRICK
            _tBrick.pos.x = _i * 32 + 16;
            _tBrick.pos.y = -16
            _tBrick.pos2.x = 7 * 32;
            _tBrick.w = 30;
            _tBrick.h = 30;
            _tBrick.vel.y = 5.4;
            _tBrick.col = _i;
            _tBrick.row = rowNum;
            _tBrick.acc = 0;
            _tBrick.time = 0;
            _tBrick.energy = 0;
            _tBrick.reserve = 0;
            _tBrick.min = null;
            // _tBrick.pos2.clear();
            _tBrick.colour = levelMap[_i][rowNum];
            // console.log(_tBrick.colour)
            bricksA.push(_tBrick);
// 
            if(!brickL[_i]) brickL[_i] = {};
            brickL[_i][rowNum] = _tBrick;
        }
        rowNum++;
        // if(rowNum == 16)
        //  clearInterval(intrvl);
    },
    // o
    // 0 - Vector, position
    // 1 - int, energy [life]
    // 2 - Vector, velocity
    // 3 - CSS colour, fillStyle
    // 4 - int, particle type
    addParticle = o => {
        _fW = particlesI.pop();
        if(!_fW) 
            _fW = new Obj('particle');
        else _fW = _fW[0];
        // console.log(_fW)

        
        _fW.pos.copy(o[0]);
        _fW.energy = o[1];
        _fW.max = o[1];
        if(o[2]) {
            _fW.vel.copy(o[2]);
            _fW.vel.scale(0.8+Math.random()*0.4)
        }
        _fW.colour = o[3] || 'white';
        //  PARTICLE TYPE
        _fW.reserve = o[4];
        //  PARTICLE SCALE
        _fW.time = o[5];
        //  PARTICLE ALPHA
        _fW.collis = o[6];
        particlesA.push(_fW);
        // console.log(particlesA.length,particlesI.length);
    },
    begin = tS => {
        switch(gameState) {
            case 0:
                _i = Math.floor(gameTime/500)%11;
                if(_i !== rowNum) {
                    rowNum = _i;
                    if(ready)
                        playBuffer(0.1,'tick')
                }
            break;
            case 1:
                if((gameTime > 100000 && bricksA.length === 0)
                || gameTime > 200000) {
                    gameOver(3);
                    if(score > hiScore) {
                        localStorage['bbHiScore'] = score|0;
                        hiScore = score;
                    }
                }
                // if(gameState) {
                    if(rowNum == (Math.floor(gameTime/6000))
                    && rowNum < 16) {
                        // console.log('wtf', rowNum)
                        addRow();
                        // colourOffset = (colourOffset + 1) % 12;
                        if(rowNum == 1) {


                            bricksA.forEach(b => b.pos.y += gameTime/1000*b.vel.y);
                        }
                    }
                    if(rowNum == 16)
                        setTimeout(()=>{bricksA.forEach(b => b.vel.clear());},3000);
                // }
                // console.log(performance.now() - hitTime)
                if(aCtx
                && Math.floor(gameTime/250)%16 !== beat) {
                    beat = Math.floor(gameTime/250)%16;
                    _i = Object.keys(brickL[beat]?brickL[beat]:0)
                    if(_i.length) {
                        brickL[beat][_i[_i.length-1]].acc = (beat ==0 || beat == 8 ? 300:150);
                        playBuffer((beat % 4 === 0 ? 0.4:0.1),'tick');

                        _fW = [];
                        _i.forEach(el=>{
                            switch(el) {
                                //. HIGH RANGE BOOPS
                                case rowNum-4+'':
                                case rowNum-7+'':
                                case rowNum-8+'':
                                // console.log(Math.random()>0.9)
                                    if(Math.random() > 0.8) {
                                        // console.log(_i)
                                        playBuffer(0.3,'high',60+minor[Math.floor(Math.random()*8)]);
                                        brickL[beat][el].acc = 500;

                                    }
                                break;
                                case rowNum-2+'':
                                case rowNum-3+'':
                                    if(Math.random() > 0.8) {
                                        playBuffer(0.1,'drum')
                                        brickL[beat][el].acc = 250;
                                    }
                                break;
                                case rowNum-5+'':
                                case rowNum-10+'':
                                case rowNum-12+'':
                                    if(Math.random()>0.8) {
                                        playBuffer(0.2,'mid',42+minor[Math.floor(Math.random()*8)]);
                                        brickL[beat][el].acc = 250;
                                    }
                                break;
                                // case rowNum-3+'':
                                case rowNum-6+'':
                                case rowNum-9+'':
                                case rowNum-11+'':
                                    // if()
                                    if(intCount < 0 && Math.random() > 0.8) {
                                        intCount = 0;
                                        dNote = 36+minor[Math.floor(Math.random()*3)];
                                        intrvl = setInterval(()=>{
                                            playBuffer(0.1,'drone',dNote);
                                            if(brickL[beat][el])
                                                brickL[beat][el].acc = 1000;
                                            intCount++;
                                            if(intCount>32) {
                                                clearInterval(intrvl);
                                                intCount = -1;
                                            }
                                        },62.5)
                                        
                                    }
                                break;
                            }
                        })
                    }   
                }
                while(tapHits.length) {
                    _tH = tapHits.shift();
                    hitTime = _tH[1];
                    player.reserve += _tH[0];
                    for(_j=0; _j<20; _j++) {
                        // console.log(_tH[0])
                        _tVec2.copy(player.pos);
                        _tVec2.x += Math.random()*player.w-player.w/2;
                        _tVec2.y += Math.random()*player.h/2-player.h/4;
                        addParticle([_tVec2,100,{x:0,y:0},4/12,1,_tH[0]/1000,0.1])
                    }
                }
            break;
            case 2:
                if(gameTime>0)
                    gameTime = -2050;
                if(gameTime>-50)
                    gameState = 0;
            break;
            case 3:
                if(gameTime>0) {
                    gameTime = -5050;
                    // if(document.monetization && document.monetization.state === 'started') {
                        dO = true;
                        hsDiv.style.display = 'block';
                        hsDiv.style.top = '1%';
                        hsDiv.style.left = innerWidth/4+'px';
                        hsDiv.children[0].innerHTML = 'Submit your score of '+score;
                        if(hsName)
                            hsDiv.children[2].value = hsName;    
                    // }
                    
                }
                if(gameTime>-50)
                    gameState = 0;
            break;
            case 4:
                if(gameTime > -50) {
                    rowNum = 0;
                    gameState = 1;
                }
            break;
        }       
    },
    update = fT => {
        // console.log(particlesA.length,particlesI.length)
        // if(gameState) {
            gameTime += fT;
            // console.log(Y,gameTime,gameState)
        // }
        // if(!gameState) {}
        if(gameState == 1) {
            hills.forEach((h,i)=>{
            h.pos.y += i/8;
            if(h.min < 1)
                h.min += fT/2000;


            // if(h.pos.y > 1024) {
            //     h.pos.y = 0;
            //     // hills.push(hills.pop());
            // }

            });
            _fW = hills[7];
            if(_fW.pos.y > 512) {
                _fW.pos.y = 0;
                drawHill('h'+_fW.acc);
                _fW.min = 0;
                hills.unshift(hills.pop());
            }
            // testBrick.pos.x = (testBrick.pos.x + 1) % 512;
            // testBrick.pos.y = (testBrick.pos.y + 1) % 512;
            //. PLAYER MOVEMENT
            if(controlTimer <= 0) {
                controlTimer = 0;
                _i = mouse.x - player.centre.x; 
                if(Math.abs(_i) > player.w/10) {
                    player.vel.x += _i * player.acc;
                } else player.vel.scale(0.55);
            } else controlTimer -= fT;

            bp = [];

            //. UPDATE OBJECTS
            player.update(fT);
            ball.update(fT);
            bricksA.forEach(b=>{b.update(fT)});
            particlesA.forEach(p=>p.update(fT));

            // player.pos.copy(mouse);

            

            //  LIMIT PLAYER
            if(player.pos.x > 512) {
                player.pos.x = 512;
                player.vel.clear();
            }
            if(player.pos.x < 0) {
                player.pos.x = 0;
                player.vel.clear();
            }

            //  FIND POSSIBLE COLLISION MATCHES FOR THE BALL
            //. .rows AND .cols WERE FILLED IN ball.update(fT);
            ball.collis = {};
            ball.rows.forEach(r => {
                ball.cols.forEach(c => {
                    if(bp[r]&&bp[r][c]&&bp[r][c].length) {
                        bp[r][c].forEach(i => {
                            ball.collis[i.id] = i;
                        })
                    }
                })
            })
            //. ONE BOUNCE PER FRAME
            ball.bounced = false;
            for(_i in ball.collis) {
                //. SKIPS CHECKING FOR FURTHER COLLISIONS IF ONE HAS ALREADY OCCURED
                // if(ball.bounced) continue;

                //. IF A COLLISION IS DETECTED
                if(collision(ball,ball.collis[_i])) {
                    // console.log(mtv)
                    // playBuffer(0.4,'test',60+(Math.random()*24)|0);


                    // . SUBTRACRT ENERGY FROM BALL, ADD TO BRICK
                    // console.log('hsla('+Math.floor(ball.collis[_i].colour*360)+',100%,50%,0.5)');
                    _k = Math.max(300,ball.energy*0.9);
                    // console.log(Math.sqrt(_i)*5);
                    // console.log(_k)
                    for(_j=0; _j<10; _j++) {
                        _tVec2.vFrD(mtv.dir()+pi+Math.random()*pi -pi/2).scale(Math.sqrt(_k)*2);
                        // _tVec2.vFrD(mtv.dir()+pi);

                        addParticle([ball.pos,
                                        500,
                                        // Math.random()>0.5?_tVec2.scale(100):_tVec2.scale(-100),
                                        _tVec2,
                                        ball.collis[_i].colour,
                                        0,0.6,1])


                    }

                    playBuffer(0.1,'test',60);
                    // playBuffer(0.01,'bounce',49);

                    ball.pos.sub(mtv);
                    Bounce(ball.vel);
                    ball.collis[_i].energy += _k;
                    // console.log(ball.collis[_i].energy)
                    ball.energy *= 0.2;
                    ball.bounced = true;
                    
                }
            }
            ball.collis = {};


            //. CHECK FOR BALL / PLAYER COLLISIONS
            // if(!ball.bounced && collision(ball, player)) {
            if(collision(ball, player)) {
                ball.pos.sub(mtv);
                if(performance.now() - hitTime > 500) {
                    playBuffer(Math.min(0.1,player.energy/100000)+0.01,'bounce',42);
                    ball.energy += player.energy;
                    player.energy = 0;
                }
                

                Bounce(ball.vel);
                // player.bounced = 3;
                _i = (ball.vel.dir()+player.vel.x/1000*maxD);
                _j = Math.min(Math.max((_i>0?-_i:_i),-2.84),-0.3);
                // console.log(_i,_j)
                if(_i > 0)
                    _j *= -1;
                ball.vel.vFrD(_j);
                player.vel.clear();
                //. SUSPEND CONTROLS FOR A SMIDGEN
                controlTimer = 100;
            }
            //. LIMIT BALL
            if(ball.pos.y < 8) {
                ball.vel.y = Math.abs(ball.vel.y);
                // playBuffer(0.1,'test',67);
                playBuffer(0.01,'bounce',49);
                Y -= 0.01;
            }
            if(ball.pos.y > 504) {
                ball.vel.y = -Math.abs(ball.vel.y);
                playBuffer(0.01,'bounce',41);
                Y = Math.max(0,Y+0.01);
                // console.log(Y)
                if(Y > 0.99) gameOver(2);
                if(Y < 0) Y = 0
            }
            field.pos.y = Y*(innerHeight - field.h*scale);

            if(ball.pos.x < 8) {
                playBuffer(0.01,'bounce',47);
                _i = ball.vel.dir();
                if(_i <= pi && _i > pi - pi/16)
                    ball.vel.vFrD(_i-pi/32)
                ball.vel.x = Math.abs(ball.vel.x);
            }
            if(ball.pos.x > 504) {
                playBuffer(0.01,'bounce',47);
                _i = ball.vel.dir();
                if(_i >= 0 && _i < pi/16)
                    ball.vel.vFrD(_i+pi/32);
                ball.vel.x = -Math.abs(ball.vel.x);
            }
        }


        // if(!printed) {
        //  printed = true;
        // }
    },
    drawBG = (a=1) => {
        // console.log(a)
        _ctx = BG.context;
        _ctx.clearRect(0,0,1024,1024);
        
        _ctx.drawImage(images['sG'],-512+(Math.sin(gameTime/30000)*256),0,2048,800);

        hills.forEach((h,i)=> {
            _ctx.save();
            _i = (0.9*h.pos.y/512+0.1)/2;
            _ctx.scale(_i+1,1);
            _ctx.globalAlpha = h.min;
            // if(i==2)
                // console.log(_i)
            _ctx.drawImage(images['h'+h.acc],-1024*_i/4,h.pos.y);
            _ctx.restore();
        })
        _ctx.fillStyle = 'rgba(0,0,0,'+Math.max(0,1-a)+')';
        _ctx.fillRect(0,0,1024,1024);
    },

    render = () => {



        _ctx = screen.context;
        _ctx.fillStyle = 'green';
        _ctx.clearRect(0,0,innerWidth,innerHeight);
        

        _ctx.save();

        

        _ctx.translate(field.pos.x,field.pos.y);
        _ctx.scale(scale,scale);
        // _ctx.fillRect(0,0,field.w,field.h);
        if(gameState!==4) {
            _ctx.save();
            _ctx.globalAlpha = 0.5;
            _ctx.drawImage(images['bg'],-256+Math.sin(gameTime/5000)*40,-256+Math.cos(gameTime/5000)*40);
            _ctx.globalCompositeOperation = 'destination-in';
            _ctx.drawImage(images['bgM'],0,0);
            _ctx.restore();
        }
        
        _ctx.textAlign = 'center';
        switch(gameState) {
            case 0:
                BG.context.clearRect(0,0,BG.width,BG.height);

                _fW = 'BEAT BRICKS';
                
                
                for(_i=0; _i<_fW.length; _i++) {
                    if(rowNum === _i) {
                        _ctx.font = '46px arial';
                        _ctx.fillStyle = 'rgb(0,255,0)';
                    } else {
                        _ctx.font = '42px arial';
                        _ctx.fillStyle = 'white';
                    }
                    _ctx.fillRect(256+40*_i-40*6-18+field.w*0.075,61,38,38)
                    _ctx.fillStyle = 'red';
                    _ctx.fillText(_fW[_i],256+40*_i-40*6+field.w*0.075,96);
                }
                _ctx.font = '16px arial'
                _ctx.fillText('~by KeithK',430,128);
                if(!ready) {
                    _ctx.fillStyle = 'white';
                    _ctx.font = '32px arial'
                    _ctx.fillText('- touch or click -',256,175);
                } else {
                    _ctx.fillStyle = 'grey';
                    _ctx.font = '16px arial'
                    _ctx.fillText('only one level',256,150);
                    _ctx.fillStyle = 'green';
                    _ctx.font = '32px arial'
                    _ctx.fillText("'Back Country'",256,175);
                }
                if(hiScores) {
                    _ctx.fillStyle = 'grey';
                    _ctx.font = '14px arial'
                    _ctx.fillText('Coil Subscriber High Scores',256,230);
                    _ctx.fillStyle = 'white';
                    _ctx.font = '24px arial'
                    for(_i=0; _i<10; _i++) {
                        _j = hiScores[_i];
                        if(_j)
                            _ctx.fillText(_j.s +' - '+_j.n,256,256+_i*24);
                    }
                    _ctx.fillStyle = 'grey';
                    _ctx.font = '14px arial'
                    if(document.monetization && document.monetization.state === 'started')
                        _ctx.fillText('Thanks for subscribing',256,500);
                    else _ctx.fillText('www.Coil.com',256,490);
                }
            break;
            case 1:
            //  DRAW BACKGROUNDS
                drawBG(Math.min(1,ease[2](gameTime/60000)));
                _ctx = screen.context;
                
                player.render(_ctx);
                bricksA.forEach(b => b.render(_ctx));
                particlesA.forEach(p => p.render(_ctx));
                ball.render(_ctx);

                if(gameTime > 190000) {
                    _ctx.save();
                    _ctx.fillStyle = 'red';
                    _ctx.textAlign = 'left';
                    _ctx.font = '5vh futura'
                    _ctx.fillText(''+roundToTwo((200000-gameTime)/1000),220,256);
                    _ctx.restore();
                }
            break;
            case 2:
                _ctx.fillStyle = 'red';
                _ctx.font = '64px arial';
                _ctx.fillText('GAME OVER',256,256);
            break;
            case 3:
                _ctx.fillStyle = 'red';
                _ctx.font = '32px arial';
                _ctx.fillText('YOUR SCORE WAS:',256,256);
                _ctx.fillText(score,256,320);
                // _ctx.fillText(hiScore,48,320);
            break;
            case 4:
                _ctx = screen.context;
                _ctx.fillStyle = 'black';
                _ctx.fillRect(0,0,innerWidth,innerHeight);
                _ctx.font = '32px arial';
                _ctx.fillStyle = 'white';
                _ctx.fillText(messages[randomMessage][0],256,256);
                _ctx.fillText(messages[randomMessage][1],256,288);
            break;
        };

        _ctx.fillStyle = 'white';
        _ctx.font = '24px arial'
        _ctx.rotate(pi/2);
        _ctx.fillText(score,0,20);
        if(gameState == 1)
            _ctx.fillText((200-gameTime/1000)|0,480,20);


        _ctx.restore();
    },

    messages = [
        ['Tap in time with the beat','to energize your hits.'],
        ['Bricks are worth more points,','the earlier they are broken.'],
        ['Tap along with quarter,','half, or whole notes.'],
        ["You don't have to hit the","beat, just stay in time with it."],
        ['Player velocity on contact','determines the balls direction.']
        
    ],
    randomMessage = localStorage['bbMessageNumber'] || 0,


// - - - - - - - - - - - - - - - - - - - - - - - - - 
//. FXR
// - - - - - - - - - - - - - - - - - - - - - - - - - 


    sampleRate = 44100,
    sounds = {},
    instruments = {},
    halfStep = 1.059463094,
    pi = Math.PI,
    minor = [0,2,3,5,7,8,10,12],
    //  i = SAMPLE INDEX, p = PERIOD (FREQUENCY/SAMPLE RATE), h = nth harmonics active
    generate = [
        //. NOISE
        i => Math.max(0.8,Math.random()*2-1),
        //. SINE
        (i,p) => Math.sin(i*6.28/p),
        // SQUARE
        (i,p,h) => wave(i,p,x => x%2==0?0:1,h),
        //. SAW
        (i,p,h) => wave(i,p,x => 1, h),
        //. CUSTOM
        (i,p,h) => wave(i,p,i => Math.sin(i*50),h),
        (i,p,h) => wave(i,p,i => 1/i,h),


    ],
    ease = [
        //  0 LINEAR
        i => i,
        //  1 SMOOTHSTEP
        i => i * i * Math.pow((3 - 2 * i), 1),
        //. 2 ACCELERATION
        i => i * i,
        //. 3 DECELERATION
        i => 1 - Math.pow(1 - i, 2)
    ],
    //  CUMULATIVE VALUE OF WAVE SAMPLE
    _w = 0,
    wave = (i,p,hFun,h) => {
        _w = 0;
        //. FOR EACH HARMONIC WE ARE INCLUDING
        for(let _i=1; _i<h; _i+=1)
            //. CALCULATE VALUE OF SINE WAVE AT SAMPLE i WITH PERIOD p
            _w += generate[1](i,p/_i)/_i * (_i==1?1:Math.max(0,Math.min(1,hFun(_i))));
        return _w;
    },
    //  o - OPTIONS
    //  0 = NAME TO SAVE INSTRUMENT UNDER
    //  1 = ROOT, MIDI NUMBER OF ROOT
    //  2 = RANGE, HOW MANY MIDI NOTES TO COUNT UP
    //  3 = SFX OPTIONS
    createInstrument = o => {
        // instruments[o[0]] = instruments[o[0]] || {};
        instruments[o[0]] = {};

        let inst = instruments[o[0]];
        for(let i=0; i<o[2]; i++) {
            o[3][1] = freqFromMidi(o[1]+i);
            // console.log(freqFromMidi(o[1]+i),o[3][2]);
            inst[o[1] + i] = createBuffer(o[3])
        }
    },
    //  o OPTIONS
    //. 0  MAIN GENERATOR 0-3: NOISE, SQUARE, SINE, SAW
    //. 1  MAIN FREQUENCY hz
    //. 2  HARMONIC COUNT
    //. 3  ATTACK s
    //. 4  DECAY s
    //. 5  SUSTAIN s
    //. 6  SUSTAIN LEVEL 0-1
    //. 7  RELEASE s
    //. 8 PITCH SHIFT hz
    //. 9  TREMOLO GENERATOR 0-2: SQUARE, SINE, SAW
    //. 10  TREMOLO FREQUENCY hz
    //. 11  TREMOLO WEIGHT 0-1
    //. 12  TREMOLO SLIDE hz
    //. 13  EASING TYPE 1-3:  LINEAR, SMOOTHSTEP, ACCELERATION, DECELERATION
    //.     -CONTROLS THE PITCH SLIDE AND TREMLO FREQ SLIDE
    bN = 0,
    createBuffer = o => {
        bN++;
        // console.log(bN);
        // console.log(o)
        //  INPUT VALUES
        let mG = o[0],
            mF = o[1],
            h  = o[2],
            // sG = 3,
            // sF = 2,
            // d = 5,
            A = o[3]*sampleRate,
            D = o[4]*sampleRate,
            S = o[5]*sampleRate,
            L = o[6],
            R = o[7]*sampleRate,
            pS = o[8] || 0,
            // pS2 = 10,
            tG = o[9] || -1,
            tF = o[10] || 0,
            tW = o[11] || 0,
            tS = o[12] || 0,
            eT = o[13] || 0,

        //  TIMING SHORTCUTS
            ad = A + D,
            as = ad + S,
        //  PERIOD USED FOR CALCULATION
            P = sampleRate/mF,
            // P2 = sampleRate/sF
        //  EASING VALUE
            eV = 0,

        //  CREATE BUFFER(CHANNELS, LENGTH IN SAMPLES, SAMPLE RATE)
            B = aCtx.createBuffer(2, as+R, sampleRate),
        //  CACHED LENGTH OF BUFFER FOR QUICKER ACCESS
            bL = B.length,
        //  CACHED VALUE VARIABLES
            v = 0,
            e = 0,
            t = 0,

            //. HIGHEST SAMPLE
            hS = 0;


        //  FOR EACH AUDIO CHANNEL
        for(let i=0;i<2; i++) {
            let C = B.getChannelData(i);

            //  FOR EACH SAMPLE OF AUDIO
            for(let j=0,jL=bL; j<jL; j++) {
                //  PROCESS EASING VARIABLE
                eV = ease[eT](j/jL);

                //  UPDATE PERIOD WITH CHANGING PITCH SHIFT VALUE
                P = sampleRate/(mF + pS*eV);

                //  PROCESS MAIN GENERATOR
                v = generate[mG](j,P,h);

                //  PROCESS TREMOLO
                //  tG = TREMELO GENERATOR TYPE
                //  IF NO tG VALUE IS SET, THE TREMELO VALUE t IS JUST 1
                t = 1;
                //  OTHERWISE PROCESS GENERATOR FUNCTION
                if(tG>0) t = generate[tG](j,sampleRate/(tF+tS*eV),100)*tW+(1-tW);
                //  SCALE TREMOLO VALUE TO BE BETWEEN 0 AND 1
                t = t/2 + 0.5;

                //  PROCESS ADSR ENVELOPE
                //  j/A COUNTS FROM 0 TO 1 OVER THE LENGTH OF THE ATTACK
                //. ease[3] = DECELERATION, A SUDDEN START
                if(j<=A) e=ease[3](j/A);
                //. -(j-ad)/D) COUNTS FROM 1 TO 0 OVER THE LENGTH OF THE DECAY
                //. *(1-L)+L  SCALES THE RESULT TO THE PROPER RANGE AND HEIGHT
                // . ease[2] = ACCELERATION
                else if(j<=ad) e= ease[2](-(j-ad)/D)*(1-L)+L;
                //. (-(j-as)/R+1)  COUNTS FROM 1 TO 0 OVER LENGTH OF DECAY
                //. ease[1] = SMOOOTHSTEP
                if(j>as) e = ease[1](-(j-as)/R+1)*L;

                //  SET SAMPLE VALUE
                C[j] = v*t*e;
                if(Math.abs(C[j])>hS)
                    hS = Math.abs(C[j]);
            }
            for(let j=0,jL=bL; j<jL; j++) {
                C[j] *= 1/hS;
            }
        };
        return B;
    },
    //. INPUT MIDI NOTE (int) AND GET BACK CORRESPONDING FREQUENCY (float)
    freqFromMidi = midi => {
        return roundToTwo(440*Math.pow(halfStep,midi - 69));
    },
    //. ROUND TO TWO DECIMAL PLACES
    roundToTwo = value => {
        return Math.round(value*100)/100;
    },
    _source,
    _gain,
    playBuffer = (gain,name,note) => {
        // console.log(aCtx)
        _source = aCtx.createBufferSource();
        _gain = aCtx.createGain();
        _gain.gain.value = gain||0.5;
        if(note) _source.buffer = instruments[name][note];
        else _source.buffer = sounds[name];
        _source.connect(_gain);
        _gain.connect(aCtx.destination);
        _source.start();
    },
    prepareSounds = () => {
        //  MAIN GENERATOR 0-3: NOISE, SINE, SQUARE, SAW
        //  MAIN FREQUENCY hz
        //. NUMBER OF HARMONICS +int
        //  ATTACK s
        //  DECAY s
        //  SUSTAIN s
        //  SUSTAIN LEVEL 0-1
        //  RELEASE s
        //  PITCH SHIFT hz
        //  TREMOLO GENERATOR 1-3: SINE, SQUARE, SAW
        //  TREMOLO FREQUENCY hz
        //  TREMOLO WEIGHT 0-1
        //  TREMOLO SLIDE hz
        //  EASING TYPE 1-3:  LINEAR, SMOOTHSTEP, ACCELERATION, DECELERATION
        // sounds['G4'] = createBuffer([2,freqFromMidi(90),100,0.05,0.1,0.2,0.2,0.1  ,-100]);
        

        // //  GOOD DRONES
        
        // sounds['G2'] = createBuffer([4,97.999,13,1,1,1,0.5,0.1  ,-1])
        // sounds['B2'] = createBuffer([4,123.47,13,0.01,1,1,0.5,0.1  ,-1,2,1,1])
        

        // sounds['A2'] = createBuffer([4,110,13,1,1,1,0.5,0.1  ,-1])


        // sounds['G4'] = createBuffer([5,freqFromMidi(30),30,0.01,0.05,0.05,0.2,0.1  ,-100])
        

        sounds['tick'] = createBuffer([0,,,0.005,0.01,0,0.9,0.01])
        playBuffer(0.4,'tick');
        createInstrument(['bounce',41,14,[2,0,10,0.01,0.05,0,1,0.1, 30,0,4,1,200]]);
        createInstrument(['test',60,13,[2,0,5,0.01,0.05,0,0.5,0.01]]);
        createInstrument(['high',60,13,[4,0,10,0.05,0.2,0,0.5,0.01]]);
        sounds['drum'] = createBuffer([5,130.81,20,0.01,0.25,0,0,0.01,-130]);
        createInstrument(['drone',36,13,[5,0,12,1,0.1,0.5,0.3,0.2,-1]]);
        createInstrument(['mid',42,13,[4,0,10,0.05,0.2,0.25,0.5,0.1,,1,6.125,1]]);


        // console.log(instruments)


        // drawWave('G4');
    },

// - - - - - - - - - - - - - - - - - - - - - - - - - 
//. PERLIN NOISE
// - - - - - - - - - - - - - - - - - - - - - - - - - 
    tau = pi * 2,
    size = 256,
    nums = [],
    perm = [],
    dirs = [],
    // _i,
    _n,
    _X, _Y,
    polyX, polyY,
    distX, distY,
    hash, grad,
    fade = t => 1 - 6*t**5 + 15*t**4 - 10*t**3,
    surflet = (x,y,gridX,gridY,w) => {
        distX = Math.abs(x-gridX);
        distY = Math.abs(y-gridY);
        polyX = fade(distX);
        polyY = fade(distY);
        hash = perm[perm[gridX%w] + gridY%w];
        grad = (x-gridX)*dirs[hash][0] + (y-gridY)*dirs[hash][1];
        return polyX * polyY * grad;
    },
    pNoise = (x,y,w) => {
        _X = x|0;
        _Y = y|0;
        return (surflet(x,y,_X,_Y  ,w)+surflet(x,y,_X+1,_Y  ,w)
               +surflet(x,y,_X,_Y+1,w)+surflet(x,y,_X+1,_Y+1,w));
    },
    turbulence = (x,y,per,octs) => {
        _n = 0;
        for(_i=0; _i<octs; _i++)
            _n += 0.5**_i * pNoise(x*2**_i, y*2**_i, per*2**_i);
        // console.log(x,y,per,octs);
        return _n;
    },
    makeNoise = (ctx,out,wh,f,d,cB,sX=1,sY=1) => {
        
        for(_j=0; _j<wh; _j++) {
            for(_k=0; _k<wh; _k++) {
                _fW = (turbulence(_j*f*(1/sX),_k*f*(1/sY),(wh*f)|0,d)+1)*128;
                
                    _fW = cB(_fW,_j,_k);
                if(out) {
                    if(!out[_j]) out[_j] = {};
                    out[_j][_k] = _fW;
                }
                if(ctx) {
                    ctx.fillStyle = 'rgb('+_fW[0]+','+_fW[1]+','+_fW[2]+')';
                    ctx.fillRect(_j,_k,1,1);
                }
            }
        }
        return out;
    };

//. SET UP PERLIN NOISE PERMUTATION VALUES
for(_i=0; _i<size; _i++) {
    nums.push(_i);
    dirs.push([Math.cos(_i*tau/size),Math.sin(_i*tau/size)]);
};
for(_i=0; _i<size; _i++){
    // perm.push(perm[_i]);
    _n = nums.splice((Math.random()*nums.length)|0,1)[0];
    perm[_i]      = _n;
    perm[_i+size] = _n;
};




resize();
screen.context.imageSmoothingEnabled = false;

document.body.appendChild(BG);
document.body.appendChild(screen);
_ctx = screen.context;
_ctx.fillStyle = 'blue';
_ctx.font = '5vh futura';
_ctx.fillText('loading',innerWidth/2-_ctx.measureText('loading').width/2,innerHeight/2);
setTimeout(()=>{
    drawAssets();
    initControls();
    requestAnimationFrame(simulate);
},10)


// screen.context.save();
// screen.context.scale(0.5,0.5);
// for(let i=0; i<4; i++) {
// //     console.log('h'+i)
//     screen.context.drawImage(images['h'+i],Math.floor(i/2)*1024,i%2*1024);
// }


// for(let i=0; i<12; i++)
 // screen.context.drawImage(images['b'+i],(i%4)*256,Math.floor(i/4)*256);  
// screen.context.fillStyle = 'white';
// screen.context.fillRect(0,0,1024,1024)
// screen.context.drawImage(images['sG'],-512,0,2048,1012);
// screen.context.drawImage(images['bg'],0,0);
// screen.context.drawImage(images['player'],0,0);


// screen.context.drawImage(images['b7'],0,0);
// screen.context.drawImage(img,0,_pX);
// screen.context.drawImage(img,_pX,0);
// screen.context.drawImage(img,_pX,_pX);

// screen.context.restore();
// // console.log(hsName)


// initControls();
// requestAnimationFrame(simulate);

