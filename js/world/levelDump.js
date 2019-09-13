let jB = {t:"jump",w:27*3,h:27*1.5}; // tiger characteristics
let fB = {t:"fly",w:20*2,h:20*2}; // bird characteristics

let  level1 = {

  // level boundaries
  size:1300,
  // trees
  cosmetics: [ 0,2,4,6,8,14,18 ],

  plat: [// platforms
    //  { x,y, width }
    // all values *10

    // top two
    {x:30,y:75,w:30},  //0
    {x:65,y:67,w:5},

    // left steps
    {x:45,y:60,w:10}, //2
    {x:38,y:58,w:5},
    {x:30,y:52,w:10},
    {x:31,y:46,w:3},

    // right steps
    {x:80,y:60,w:10}, //6
    {x:92,y:58,w:5},
    {x:100,y:52,w:10},
    {x:102,y:46,w:3},

    // middle platform
    {x:32,y:40,w:73}, //10

    // steps leading up
    {x:55,y:35,w:5}, //11
    {x:75,y:35,w:5},
    {x:62.5,y:28,w:10}, // small step

    {x:40,y:25,w:8}, //14 // left steps
    {x:32,y:18,w:5},
    {x:38,y:12,w:5},
    {x:32,y:6,w:5},

    {x:88,y:25,w:8}, //18 // right steps
    {x:95,y:18,w:5},
    {x:89,y:12,w:5},
    {x:95,y:6,w:5},

    {x:66,y:46,w:3}, // extra step at center of middle platform
    {x:65,y:72,w:5}, // extra top step 
  ],

  baddies: [

    {p:10, x:365, r:325, kit:jB },
    {p:10, x:480, r:245, kit:fB },
    {p:16, x:30, r:300, kit:fB },
    {p:-1, x:500, r:450, kit:jB },
    {p:2, x:10, r:40, kit:jB },
    {p:14, x:-5, r:245, kit:fB },
  ],

  player: {p:0,x:30},

  babies:{count:3, pos:[15, -1,21,5],p:0,x:0}
};


let  level2 = {

  size:2500, // boundaries for the level

  // tree locations (platform #)
  cosmetics: [ 2, 5, 10, 8, 12, 13, 14, 17, 18, 20, 21 ],

  plat: [ // platforms
    //  { x,y, width }
    // all values *10

    {x:0,y:5,w:5}, //0 stairs to nest
    {x:0,y:10,w:5},
    {x:0,y:15,w:15}, //2 : nest

    {x:30,y:8,w:10}, //3
    {x:40,y:14,w:10},
    {x:50,y:20,w:25}, //5 first peak

    {x:90,y:8,w:10}, //6
    {x:100,y:14,w:10},
    {x:90,y:21,w:10}, //8
    {x:100,y:28,w:10},
    {x:110,y:35,w:25}, //10 second peak

    // third peak:
    {x:150,y:7,w:10}, //11 lower steps
    {x:160,y:14,w:10},
    {x:170,y:20,w:25}, //13 first platform

    {x:195,y:27,w:25}, //14 second platform

    {x:190,y:35,w:5}, //15 left steps
    {x:185,y:42,w:5}, //16
    {x:180,y:49,w:5}, //17
    {x:170,y:56,w:10}, //18 top left platform

    {x:220,y:35,w:5}, //19 right step
    {x:225,y:42,w:5},
    {x:230,y:49,w:5}, //21
    {x:235,y:49,w:10}, //22 top right platform
  ],

  baddies: [ // list each baddie here:
    // step patrols
    {p:7, x:30, r:100, kit:fB },
    {p: 21, x:-100, r:250, kit:fB},
    {p:4, x:-50, r:100, kit:fB },

    // larger plat baddies
    {p:5, x:80, r:70, kit:jB },
    {p:10, x:80, r:70, kit:jB },
    {p:13, x:80, r:70, kit:jB },
    {p:14, x:80, r:70, kit:jB },

    // ground patrols
    {p:-1, x:500, r:200, kit:jB },
    {p:-1, x:1000, r:200, kit:jB },
    {p:-1, x:2000, r:200, kit:jB },
    {p:-1, x:1700, r:800, kit:fB },
  ],

  player: {p:2,x:10},
  babies:{count:3, pos:[5, 10, 13, 14, 18, 22],p:0,x:0}
};
