/*
    Xycore
    =-------------------------------------=
    CHANGELOG
    + 1.0.0 : JS13k Version with commentary
    =-------------------------------------=    
*/

// This is a minor attempted space optimization. Unfortunately, the Closure compiler
// optimizes the optimization out, meaning that instead of short calls to a small function
// like 'floor', Closure compiler outputs Math.floor() instead.
// You can manually search-and-replace in your minified code to save a few bytes, but I
// decided it wasn't worth the hassle.

let floor=Math.floor,abs=Math.abs,round=Math.round,rnd=_=>Date.now()%_,random=Math.random

// Similarly, these are simple functions that delegate to sessionStorage
// Also similarly, Closure compiler removes them. I -did- search-and-replace these, since
// they're fairly long and are used in quite a few places in the code.
// As for what this is used for, it saves play-state to the session, meaning that I can
// cheat later by reloading the page to "respawn" the player while keeping progress.
let store = (k,v) => sessionStorage.setItem(k,v)
let retrieve = _ => sessionStorage.getItem(_)

// Gamepad input - a last-minute addition while I was searching for something to do with
// the few hundred kilobytes I had left. This is just the assignment of a global variable
// on connection/disconnection which gets used in the main game loop.
// Naively assumes the first gamepad will be used.

let gp = null, gpinterval = null;
addEventListener('gamepadconnected',_=> {
    gp = navigator.getGamepads()[_.gamepad.index];
});

addEventListener('gamepaddisconnected', _=>{
    gp = null;
});

// I added audio on a whim really late one night. A few hours with the MDN later and 
// I had simple DOS-like bleeps and bloops. I'm a big fan of the old chunky DOS sound,
// so I kept it since it was a relatively minor feature and adds to the game's "feel".

let ac = new AudioContext;
let osc = ac.createOscillator(), gain = ac.createGain();
osc.type = 'square';
osc.connect(gain);
gain.gain.value = 0.0;
osc.start();
gain.connect(ac.destination);

// This function is responsible for all of the audio in the game. It takes a single
// argument: An array of arrays, each sub-array containing two numerical values.
// The first value is the frequency in hertz, the second is the approximate duration
// in milliseconds. 
// It then recursively calls itself after that duration
// with what remains of the array after slicing the front-most element off.
let beep = (notes) => {
        let n = notes[0];
        osc.frequency.setValueAtTime(n[0], ac.currentTime);
        gain.gain.value = 0.04;
        setTimeout(_=> {
            //gain.disconnect(ac.destination)
            gain.gain.value = 0;
            osc.frequency.value = 0;
            if(notes.length > 1) {
                beep(notes.slice(1));
            }
        }, n[1]+5);
    },

// Definitions of some of the sounds used. Some of them are defined on the call-site
// as once-offs, and then there's sndAlarm which I wanted to expand a few times in code
// to repeat - that's done in the init code later on.
    sndExplode = [[110,35],[220,25],[180,15],[440,25],[220,25],[110,25],[55,50],[0,50],[55,75]],
    sndHurt = [[440,15],[220,15],[110,15]],
    sndPlink = [[0,10],[440,10],[680,10]],
    sndPickup = [[523,30],[466,30],[311,30],[261,30],[523,30],[1047,30]],
    sndAlarm = [],

// Variable definition block
// I started optimizing prematurely by defining everything in a single let-block separated by commas.
// Miss a single comma and the Closure Compiler will treat everything after that missed comma as a
// global, meaning the name doesn't get minified.
// =--------------------------------------------=
    // Primary canvas and context. The primary canvas is defined in the game's HTML
    canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d'),

    // Secondary canvas+context used for the water effect and screenshake
    cbuffer = document.createElement('canvas'),
    cbuffercontext = cbuffer.getContext('2d'),
    
    // This variable is completely unused in the final build of the game.
    // I was originally doing raster effects directly on an ImageData buffer,
    // but replaced it with the secondary canvas buffer later on, and forgot
    // to remove it. You will see lots of dead code in this file, but don't
    // worry - I'm -reasonably- sure that the compiler got rid of it.
    bufferImage = new ImageData(128, 128),

    // These are the Image elements used to store the spritesheet and, at one
    // point, a separate bitmap and font image. I eventually consolidated the
    // map into the main spritesheet (.zip adds overhead for each separate
    // file in the archive), and map is now repurposed into a flat array 
    // in the init code. Ignore the uneccessary Image constructor for it.
    sprites = new Image, font = new Image, map = new Image,

    // A global timer of sorts that I use to time certain actions. This one
    // ticks once per animation frame.
    globalclock = 0,

    // This is another clock counter that runs at a fixed interval, and is "faster"
    // than globalclock, used for some things that I can't remember off the top of
    // my head.
    fastclock = 0,

    // My super-dumb input system. Just a basic array of integer values. If they're
    // 1, the key is pressed. Even though I only use 3 keys, this is still somewhat
    // compact since I don't have to perform much logic. The actual event handlers
    // are defined further down.
    keys = new Uint8Array(256),

    // A fixed palette that matches my palette in Aseprite. This is used by the map
    // construction code to match pixels colors to their corresponding palette ID.
    palette = [
        [22,33,26],[127,6,34],[214,36,17],[255,132,38],
        [255,209,0],[250,253,255],[255,128,164],[255,38,116],
        [148,33,106],[67,0,103],[35,73,117],[104,174,212],
        [191,255,60],[16,210,117],[0,120,153],[0,0,0]
    ],

    // Since I have to use the canvas dimensions in my code at several points, I'm leveraging 
    // modern ES6 and the spread operator to "expand" this into any functions that take 
    // these positional arguments. I use the spread operator a lot in this codebase.
    canvasDimensions = [0, 0, 128, 128],

    // These store the current 'screen' of the map that the game is rendering
    screenx = 0, screeny = 0,

    // Each of these arrays corresponds to one of the tilesets used in the game. Each value
    // is an index in linear tile coordinates into the sprite sheet.
    tilesets = [
        [55, 56, 71, 72, 87, 88, 103, 104],
        [57, 58, 73, 74, 89, 90, 105, 106],
        [91, 92, 93, 94, 107, 108, 109, 110],
        [119,120,121,122,135,136,137,138],
        [123,124,125,126,139,140,141,142]
    ],

    // Directional values that I ended up only using for enemy code, basically an enum
    DIRS = {
        NONE: 0, TOP: 1, RIGHT: 2, BOTTOM: 3, LEFT: 4
    },
    
    // A simple function that constructs a sprite object. You'll see this a lot, everywhere.
    SpriteID = (frames, width=8, height=8) => { return {frames, numframes: frames.length, width, height}; },

    // Sprite definitions for the reactor and its associated tiles. This is before I adopted the naming convention
    // I stuck with throughout the rest of the file, and yes, it's confusing, but such is the way of late-night
    // jam code.
    reactor = SpriteID([214], 16),
    reactorCore = SpriteID([15],8,12),
    reactorLights = [
        SpriteID([251]),
        SpriteID([255])
    ],

    // Sprite definitions for the fire used in the third boss-fight.
    sprFireHead = SpriteID([165]),
    sprFireBody = SpriteID([198]),

    // Then randomly in the middle of the sprite definitions, a bossdata array, which stores
    // the positions of the fire in that boss battle.
    bossdata = [],

    // Various sprite definitions
    screwHead = SpriteID([112]),
    screwBody = SpriteID([114]),
    sprSavePoint = SpriteID([115,116,133,116]),
    sprSaveNotice = SpriteID([75],24),
    sprEnmProj2 = SpriteID([169]),
    sprEnmProj3 = SpriteID([160,161]),

    // And again for no apparent reason, the flag for whether or not you're touching
    // a savepoint or not.
    touchedSave = 0,

    // More sprites!
    sprDoorBasic = SpriteID([14],8,16),
    sprDoorBlockPlasma = SpriteID([118]),
    sprDoorBlockRocket = SpriteID([117]),
    sprHealthUpgrade = SpriteID([21]),
    sprUpgradeIconBG = SpriteID([22,40]),
    sprUpgrades = [SpriteID([5]),SpriteID([24]),SpriteID([6]), SpriteID([25]), SpriteID([23])],
    sprWarning = SpriteID([224],40),
    sprEscape = SpriteID([240],32),
    sprStars = [SpriteID([200]),SpriteID([201]),SpriteID([216]),SpriteID([217])],
    sprShip = SpriteID([131],16),

    sprBoss1 = SpriteID([205],24,12),
    sprBoss1_seg = SpriteID([202],24,12),
    sprBoss2_closed = SpriteID([172],8,16),
    sprBoss2_open = SpriteID([173],12,16),
    sprBoss2_pod = SpriteID([183]),
    sprBoss2_vine = SpriteID([168]),
    sprBoss3_brain = SpriteID([147],16,16),
    sprBoss3_barrier = [SpriteID([162]),SpriteID([146]),SpriteID([130])],
    sprBoss4_body = SpriteID([192],16,16),
    sprBoss4_laserstartup = SpriteID([179,180]),
    sprBoss4_laserhead = SpriteID([196,197]),
    sprBoss4_laserbody = SpriteID([181,182]),

    // The player sprite, also before I started sticking spr before all of them for easier lookup.
    player = [SpriteID([0]),SpriteID([16]),SpriteID([1])],

    // Player coordinates. Note that I'm coercing the value returned by retrieve (And thus sessionStorage.getItem)
    // into a number, because it stores and returns strings.
    px = ~~retrieve('px'),
    py = ~~retrieve('py'),
    // 'pf' is 'player facing'. If true, the player sprite is flipped (Facing to the right), otherwise it faces left.
    pf = true,

    // A list of map tiles that can be traversed (i.e.: Get ignored by the collision detection).
    passables = [15, 12, 13, 2, 11, 7, 1, 14, 8, 6],

    // A list of extra bounding boxes to collide with that I never ended up using.
    collidables = [],

    // A timer that's used for all the Sine calculations in the code.
    sintimer = 0.0,

    // FX-related storage. fx contains a list of 'active' effects, and the fxSpr variables
    // contain sprites.
    fx = [],
    fxSprJetpack = SpriteID([32,33,34]),
    fxSprBubbles = [SpriteID([46]),SpriteID([47])],
    fxSprBuster = SpriteID([7,8,9]),
    fxExplosion = SpriteID([35,36,37,38,39]),
    fxSprSave = SpriteID([17]),

    // Player Projectile storage
    player_projectiles = [],

    // Some player-related and save-related flags.
    // damageMult is calculated based on suitlevel, and is used to
    // reduce damage taken by the player when they have suit upgrades.
    suitLevel=0, damageMult = 1.0,
    extraSaveData = {
        hpUpgrades : [0,0,0,0],
        suitUpgrades : [0,0],
        weaponUpgrades : [0,0,0,0]
    },

    // Sprites for the player's projectiles
    prSprNormal = SpriteID([2]),
    prSprLaser = SpriteID([18,19]),
    prSprBuster = SpriteID([20]),
    prSprRocket = SpriteID([3,4]),
    prSprHyper = SpriteID([9,8,7]),

    // Currently selected player weapon, retrieved from store or defaulting to zero.
    playerWeapon = ~~retrieve('pwep')||0,

    // Boss-defeated flags
    bossDefeated = [~~retrieve('boss0'),~~retrieve('boss1'),~~retrieve('boss2'),~~retrieve('boss3'),~~retrieve('boss4')],

    // An array of arrays of arrays of sound notes. Each major array contains a sound effect that maps to the current
    // value of playerWeapon.
    playerWeaponSounds = [[[220,10]],[[550,15],[440,30],[350,20]],[[220,10],[320,10]],[[440,5],[330,5],[220,5],[110,10]],[[880,5],[440,5],[220,5],[110,5],[55,5]]],
    
    // An array I use to launch projectiles or effects in a circle. 
    // Used like "eightDirections.forEach(_=>spawnThing(x,y,..._)", where the arguments we're expanding to
    // are expected to be a directional 'vector'.
    eightDirections = [[-1,0],[-0.7,-0.7],[0,-1],[0.7,-0.7],[1,0],[0.7,0.7],[0,1],[-0.7,0.7]],

    // Array of functions used to spawn the player projectiles. The object pushed by each function
    // has an optional 'effect' parameter that will spawn that effect on destruction if present.
    // To spawn the current weapon we just look up the function at spawnProjectile[playerWeapon] and call it.
    spawnProjectile = [
        (x, y, dx) => player_projectiles.push({sprite: prSprNormal, x, y, dirx: dx, effect: null, damage: 1}),
        (x, y, dx) => player_projectiles.push({sprite: prSprLaser,  x, y, dirx: dx, effect: null, damage: 2}),
        (x, y, dx) => player_projectiles.push({sprite: prSprBuster, x, y, dirx: dx, effect: fxBuster, damage: 3}),
        (x, y, dx) => player_projectiles.push({sprite: prSprRocket, x, y, dirx: dx, effect: fxExplode, damage: 4}),
        (x, y, dx) => player_projectiles.push({sprite: prSprHyper,  x, y, dirx: dx, effect: fxBuster, damage: 5}),
    ],

    // Counter used for effect spawn staggering
    fxCounter=0,

    // Effect spawners.
    fxJetpack = (x, y) => fxCounter++ % 2 == 0 && fx.push({sprite:fxSprJetpack, x, y, lifespan:8, dirx:0, diry:0}),
    fxBubbles = (x, y) => fxCounter++ % 4 == 0 && fx.push({sprite:fxSprBubbles[globalclock%2?0:1], x, y, lifespan:30, dirx:0, diry:-0.15}),
    fxBuster = (x, y) => fx.push({sprite:fxSprBuster, x, y, lifespan:12, dirx:0, diry:0}),
    fxExplode = (x, y) => fx.push({sprite:fxExplosion, x, y, lifespan:12, dirx:0, diry:0}),
    fxSave = (x, y) => eightDirections.forEach(dir => fx.push({sprite:fxSprSave,x,y,lifespan:50,dirx:dir[0],diry:dir[1]})),
    fxBigExplode = (x, y) => {
        // An example of using the eightDirections array to spawn a 'circular' explosion
        eightDirections.forEach(dir => fx.push({sprite:fxSprBuster, x, y, lifespan:200, dirx:dir[0], diry:dir[1]}))
    },
    fxLargeExplode = (x, y) => {
        [[x,y],[x+16,y],[x+8,y+8],[x,y+16],[x+16,y+16]]
        .forEach(a => fxExplode(...a));
    },

    // More sprites
    sprBossDoor = SpriteID([28]),
    sprHealthPickup = SpriteID([26]),

    // A list of currently active health pickups (The ones that drop from enemies)
    health_pickups = [],

    // Enemy template storage - These five arrays are chosen based on adjacent blocks,
    // and contain a list of possible enemy spawners to use for that tile.
    // The last three arguments are rotation and a direction vector, used for facing.
    // The repeated 'false' values are the "has spawned" flag for the spawner.
    // When you leave the screen, these get reset to false and the enemy can spawn
    // again when you return.
    enemyspawnertemplates = [
        [ // No adjacent tile
            (x,y) => [x, y, false, spawnenemy[3], 270, 1, 0],
            (x,y) => [x, y, false, spawnenemy[4], 180, 0, 1],
            (x,y) => [x, y, false, spawnenemy[5], 0, 0, 0],
        ],
        [ // Tile above
            (x,y) => [x, y, false, spawnenemy[0], 180, 0, 1],
            (x, y) => [x, y, false, spawnenemy[1], 180, 0, 1],
            (x, y) => [x, y, false, spawnenemy[2], 180, 0, 1],
            (x, y) => [x, y, false, spawnenemy[4], 180, 0, 1],
        ],
        [ // Tile to right
            (x, y) => [x, y, false, spawnenemy[0], 90, -1, 0],
            (x, y) => [x, y, false, spawnenemy[2], 90, -1, 0],
            (x, y) => [x, y, false, spawnenemy[3], 90, -1, 0]
        ],
        [ // Tile below
            (x, y) => [x, y, false, spawnenemy[0], 0, 0, -1],
            (x, y) => [x, y, false, spawnenemy[1], 0, 0, -1],
            (x, y) => [x, y, false, spawnenemy[2], 0, 0, -1],
            (x, y) => [x, y, false, spawnenemy[4], 0, 0, -1],
        ],
        [ // Tile to left            
            (x, y) => [x, y, false, spawnenemy[0], 270, 1, 0],
            (x, y) => [x, y, false, spawnenemy[2], 270, 0, -1],
            (x, y) => [x, y, false, spawnenemy[3], 270, 1, -1]
        ],
    ],

    // List of enemy spawn locations
    enemy_spawners = [],

    // List of active enemies (Enemies that have been spawned)
    active_enemies = [],

    // List of enemy projectiles)
    enemy_projectiles = [],

    // List of doors
    doors=[],

    // Active boss object. Stores different data for each boss fight, along with a few
    // common values. Null if no boss active.
    active_boss = null,

    // Used for the "WARNING" that shows up when entering a boss room.
    boss_warning = 0,

    // Spawns a door, obviously.
    spawnDoor = (x,y,type) => doors.push({x,y,type}),

    // Enemy sprites
    enmSprVTurret1 = SpriteID([96]),
    enmSprTurret2 = SpriteID([144]),
    enmProjectile = SpriteID([48,64]),
    enmFloater = SpriteID([81]),
    enmJelly = SpriteID([100]),
    enmThing = SpriteID([86]),
    enmBurst = SpriteID([85]),
    enmMine = SpriteID([101]),

    // Actual functions called by the spawners to push the given enemy onto the active_enemies list.
    spawnenemy = [
        (x, y, dir=0, dx=0, dy=0) => active_enemies.push({sprite:enmSprVTurret1, x, y, dir, dx, dy, hp:3, type:0}),
        (x, y, dir=0, dx=0, dy=0) => active_enemies.push({sprite:enmSprTurret2, x, y, dir, dx, dy, hp:4, type:1}),
        (x, y, dir=0, dx=0, dy=0) => active_enemies.push({sprite:enmThing, x, y, dir, dx, dy, hp:4, type:2}),
        (x, y, dir=0, dx=0, dy=0) => active_enemies.push({sprite:y<512?enmFloater:enmJelly, x, y, dir, dx, dy, hp:5, type:3}),
        (x, y, dir=0, dx=0, dy=0) => active_enemies.push({sprite:y<512?enmFloater:enmJelly, x, y, dir, dx, dy, hp:5, type:4}),
        (x, y, dir=0, dx=0, dy=0) => active_enemies.push({sprite:y<512?enmBurst:enmMine, x, y, dir, dx, dy, hp:2, type:5}),
    ],

    // Pretty obvious - spawns an enemy projectile. The type value is used by the projectile update
    // code to give projectiles different behaviors (Like tracking)
    spawnEnemyProjectile = (x, y, type, dx, dy, spr=enmProjectile) => {beep([[110,20]]),enemy_projectiles.push({spr, x, y, type, dx, dy, damage:1})},

    // List of boss spawn locations. When these are on-screen, the game will attempt to spawn a boss.
    bossSpawners = [],

    // More sprites!
    sprHPBarCap = SpriteID([65]),
    sprHPBarMid = SpriteID([66]),
    sprHPBarEnm = SpriteID([78],16),
    sprHPBarHP = SpriteID([10],16),
    sprHPBarWep = SpriteID([69]),    
    sprHPBarPip = [
        SpriteID([60]),
        SpriteID([61]),
        SpriteID([62]),
        SpriteID([63]),
    ],

    sprPlanet = SpriteID([170],16,16),
    sprShipEscape = SpriteID([185]),
    sprWinMessage1 = SpriteID([149],48),
    sprWinMessage2 = SpriteID([230],72),

    // Bunch of flags. 
    kpSpace = false, // Stops key-repeats for the fire button (space)
    enemyCounter = 0, // Counter used for staggering enemy projectiles
    playerHealth = 6, // Current player health
    playerMaxHealth = 6, // And the current player max health
    playerFlicker = 0, // Used to determine i-frames for the player and whether to 'flicker' or not when rendering
    gameOver = false, 
    screenShake = 0, // When set to a value >0 will shake the screen until decremented back to zero
    bossCounter = 0, bossPhase = 0, bossX = 0, bossY = 0, // Some more boss-related internals
    // And misc. flags used at the end of the game
    reactor_hp = 50, escape_sequence = 0, escape_counter = 0, game_won = 0; 

// Function definition block. Same as above, also avoiding function keywords
// =-----------------------------------------------------------------------=

// range() returns a range. Useful for compact iterations over fixed values,
// e.g.: for(i in range(0,15)) { // Do something }
let range = (min, max) => {
        let r = [], x = 0;
        for(let i = min; i < max; i++,x++) r[x]=x;
        return r;
    },
    // Clears the primary context
    clear = () => {
        context.clearRect(...canvasDimensions);
    },
    // Tries to find an associated palette index based on rgb values
    // loaded from the sprite sheet
    getPaletteEntry = (r, g, b) => {
        let i = 0;
        for(let p of palette) {
            if(p[0] === r && p[1] === g && p[2] === b) return i;
            i++;
        }
        return 15; // Return empty color as fallback
    },    
    copyContext = () => context.getImageData(...canvasDimensions),
    // Translates a linear ID into an x,y coordinate pair based on
    // a tile width.
    getCoordsFromLinear = (idex, q) => { return [idex%q, floor(idex/q)]; },

    // Another heavily-used functions - draws a sprite, animates it if
    // it has multiple frames, and can do rotations and flip the image.
    // Non-multiples of 90 degrees as the rotation causes blurry pixels.
    DrawSprite = (sid, dx, dy, rot=0, fliph=false, flicker=0) => {
        let frame = sid.frames[globalclock % sid.numframes];
        [dx,dy] = [floor(dx), floor(dy)];
        let [sx, sy] = getCoordsFromLinear(frame, 16);

        if(flicker--) {
            // Skip drawing this sprite if it's flickering.
            if(globalclock % ~2) return;
        }

        // Save the context state so we can return to a sane state
        // after all the rotation and translation.
        context.save();
        context.translate(dx + sid.width / 2, dy + sid.height / 2);
        let rads = (Math.PI*2) - (rot * (Math.PI / 180));
        fliph&&context.scale(-1, 1);
        context.rotate(rads);
        context.drawImage(sprites, sx*8, sy*8, sid.width, sid.height, -sid.width/2, -sid.height/2, sid.width, sid.height);
        context.restore();
    },

    // Similar to DrawSprite, but has less work to do. Also takes a linear tile coordinate instead of a
    // SpriteID.
    DrawTile = (tiles, dx, dy) => {
        let rtile = (dx+dy) % (tiles.length);
        let [sx, sy] = getCoordsFromLinear(tiles[rtile],16)
        context.drawImage(sprites, sx*8, sy*8, 8, 8, (dx*8), (dy*8), 8, 8);
    },

    // Checks the map cell adjacent to the given map coordinates.
    // Has a weird priority, but it works.
    adjacentCell = (x, y) => {
        let mid = y * 128 + x;
        let dir = DIRS.NONE;
        mid > 128 &&
            map[mid-128] === 5 && (_=> dir = DIRS.TOP)() ||
            map[mid-1] === 5 && (_=> dir = DIRS.LEFT)();
        mid < 16256 &&
            map[mid+128] === 5 && (_=> dir = DIRS.BOTTOM)() ||
            map[mid+1] === 5 && (_=> dir = DIRS.RIGHT)();
        return dir;
    },

    // Returns a random number, but is only used once. I think I forgot about it.
    rnum = (v) => floor(Math.random() * v),

    // Standard lerp
    lerp = (a, b, t) => {
        return ((1.0 - t)*a)+(t*b);
    },

    // Some basic easing functions. Only the final boss makes use of the lerp and easing,
    // because I wasn't planning on implementing them initially, and by the time I did,
    // I had already coded the other bosses and wasn't up for a revisit.
    easeIn = t => t*t,
    easeOut = t => -(t*(t-2)),
    easeInOut = t => t < 0.5 ? 2*t*t : (-2*t*t)+(4*t)-1,
    easeInOutCubic = t=> {
        if(t < 0.5) {
            return 4*t*t*t;
        } else {
            let f = ((2*t)-2);
            return 0.5 * f*f*f+1;
        }
    },

    // The init block. The game's map gets constructed here, and a lot of saved
    // state gets loaded.
    init = () => {
        let i;
        // Set the extra canvas buffer size to the same as the primary canvas.
        cbuffer.width = cbuffer.height = 128;

        for(i in extraSaveData.hpUpgrades) {
            extraSaveData.hpUpgrades[i] = ~~retrieve(`hp${i}`) || 0;
        }
        for(i in extraSaveData.suitUpgrades) {
            extraSaveData.suitUpgrades[i] = ~~retrieve(`suit${i}`) || 0;
        }
        for(i in extraSaveData.weaponUpgrades) {
            extraSaveData.weaponUpgrades[i] = ~~retrieve(`wep${i}`) || 0;
        }

        // Expanding the alarm sound out four times to make it repeat
        for(i = 0; i < 4; i++) {
            sndAlarm.push([131,150],[262,150],[277,150],[139,150])
        }
        // And adding a little trail-off so it doesn't cut off too weirdly
        sndAlarm.push([131,50],[66,20],[33,10],[16,5]);

        // And now we traverse the map and spawn things as necessary.
        for(let i in map) {
            let [cx, cy] = getCoordsFromLinear(i, 128);
            let p = map[cy * 128 + cx];
            if(p === 13) { // Player initial spawn position
                [px, py] = [cx*8, cy*8];
                [screenx, screeny] = [floor(cx/16), floor(cy/16)];
            }
            if(p === 2) { // Enemy spawner - type is pseudo-random
                let dir = adjacentCell(cx, cy);
                enemy_spawners.push(
                    enemyspawnertemplates[dir][rnum(enemyspawnertemplates[dir].length)](cx*8, cy*8)
                );
            }
            if(p === 7) { // Boss spawner
                bossSpawners.push({x:cx*8, y:cy*8})
            }
            if(p === 1) { // Spawn a door, with strength determined by the column the door occupies                
                spawnDoor(cx*8,cy*8,cx%4);
            }            
        }

        // Set player x/y to stored position if it exists
        if(retrieve('px')) {
            px = ~~retrieve('px');
            py = ~~retrieve('py');
        } else {
            // Otherwise set up an initial stored position
            store('px', px);
            store('py', py);
        }

        // Load and initialize player health, suit level and weapon level
        playerHealth = playerMaxHealth = 6 + extraSaveData.hpUpgrades.reduce((ac,v) => ac+=(v*2))
        suitLevel = extraSaveData.suitUpgrades.reduce((ac, v) => ac+=v)
        playerWeapon = extraSaveData.weaponUpgrades.reduce((ac, v) => ac+=v);  
        damageMult -= 0.25*suitLevel;        
    },
    // Returns tile coordinates from world coordinates
    getTileCoords = (x, y) => {
        return { x: floor(x / 8), y: floor(y / 8) };
    },
    // Does a simple AABB test and returns true if intersecting
    aabbTest = (x1, y1, w1, h1, x2, y2, w2, h2) => !(x1 + w1 < x2 || x1 > x2 + w2 || y1 + h1 < y2 || y1 > y2 + h2),
    // Performs a two-point test against the map, and if a tile exists at that point and that tile isn't
    // in the passables list, it returns true.
    mapTest = (x, y, x2=x, y2=y) => {
        let c1 = getTileCoords(x,y), c2 = getTileCoords(x2,y2),
            t1 = map[c1.y * 128 + c1.x], t2 = map[c2.y * 128 + c2.x],
            col = true;
        return col ^= passables.includes(t1) && passables.includes(t2);
    },
    // Snap a value to a multiple
    snap = (x,q) => floor(x/q)*q,

    // Draws an array of arguments to DrawSprite
    DrawBatchSprites = argarray => argarray.forEach(args => DrawSprite(...args)),

    // This function initializes boss data for a given area
    Boss = (area) => {
        let bossdata = {
            flicker : 0,
            counter: 0, counter2: 0, counter3: 0, counter4: 0,
            x:0,y:0
        };
        if(area === 1) {
            bossdata.hp = 20;
            bossdata.barriers = []
            bossdata.turrets = []
            bossdata.phases = 1;
        }
        if(area === 2) {
            bossdata.hp = 20;
            bossdata.open = 0;
            bossdata.phases = 2;
        }
        if(area === 3) {
            bossdata.hp = 20;
            bossdata.lasery = 0;
            bossdata.phases = 2;
        }
        if(area === 4) {
            bossdata.hp = 20;
            bossdata.segs = 4;
        }
        return bossdata;
    }

// Sprite/Map Initialization Block
// Here's where we're actually loading the sprite image. Once it's loaded we can call 
// init() and main()
sprites.onload = () => {
    clear();
   // map.onload = () => {
    context.save();
    context.drawImage(sprites,0,128,128,128,...canvasDimensions);
    let dmap = copyContext(), bmap = [];
    context.restore();
    // Here we're reading the map data from the sprite image and converting it
    // into Tile IDs
    for(let i = 0; i < dmap.data.length; i+=4) {
        bmap.push(getPaletteEntry(...dmap.data.slice(i, i+4)));
    }
    map = bmap;
    init();
    main(); // The game can now start!
    //};
    map.src = './map.png'; // Also this shouldn't be here, but it's not causing the game to 
                            // crash, and it's in the final build, so in it stays.
};

// These two values are unused. There was a brief moment where I was experimenting with
// touch controls, but then decided against it because testing on my own devices would
// be a nightmare (Tiny screen, low power)
let tx = 0, ty = 0;

// Here's where we kick off the loading of the sprite sheet.
// As you can see here, this is the fourth version of said sprite sheet. I made lots
// of copies in an effort to be non-destructive when experimenting with various
// space-saving techniques.
sprites.src = './sprsheet4.png';

// Here's the remainder of the dead-simple keyboard handler.
onkeydown=_=>keys[_.keyCode]=1;
onkeyup=_=>keys[_.keyCode]=0;

// And here's where the real work begins. main() is a function that 
// makes a call to requestAnimationFrame() until the game ends. It's a monolithic beast.
let main = () => {
    // We clear the primary context at the beginning of each frame
    clear();

    // Some internal flags that get used through. i and j in particular get reused anytime I need
    // to do a quick loop over something, except for when I forgot to use them.
    let moving = 0,distortion = 0, drawn_reactor = 0, distrow = 0, area = 0,
    i, j,
    sx = screenx*16, sy = screeny*16;
    collidables = [];

    // When the win condition is met, this code fires and then returns without requesting any further
    // animation frames.
    if(game_won) {
        for(i=0;i<16;i++) {
            for(j=0;j<7;j++) {
                DrawSprite(sprStars[floor(random()*4)%4],(i*8),(j*8),(floor(random()*4))*90,random()>0.5);
            }
        }
        DrawSprite(sprWinMessage1, 40, 64);
        DrawSprite(sprWinMessage2, 28, 72);        
        DrawSprite(sprPlanet, 112, 112);
        DrawSprite(sprShipEscape, 100, 120)
        
        return;        
    }

    // A nested function that is used in a few spots below for this specific
    // calculation.
    let getTransformedCoords = (x, y, m=1) => [(x-sx)*m, (y-sy)*m];

    // Draw the current screen
    for(let iy = sy; iy < sy + 16; iy++) {
        for(let ix = sx; ix < sx + 16; ix++) {
            let id = map[(iy*128)+ix];
            // This is a special handler for the starting room that draws stars in the sky.
            if(screenx == 3 && screeny == 0) {
                if(id === 15 && iy < 4) {
                    DrawSprite(sprStars[(iy&ix)%4],(ix*8)-sx*8,(iy*8)-sy*8);
                }
                if(escape_sequence && aabbTest(px,py,8,8,88+sx*8,48+sy*8,16,8)){
                    // Trigger win condition if we touch the spaceship after
                    // destroying the central core.
                    game_won = 1;                    
                }
                DrawSprite(sprShip, 88, 48, 0, 1);
            }
            
            // This renders wall tiles after setting the area based on quadrant,
            // with an exception for the center four rooms (The reactor area).
            // If we're in the lower half of the world, we enable the water
            // distortion effect.
            if(id === 5) {
                area = 0;
                if(screenx < 4 && screeny < 4) area = 1;
                if(screenx > 3 && screeny < 4) area = 3;
                if(screenx < 4 && screeny > 3) area = 2;
                if(screenx > 3 && screeny > 3) area = 4;
                if(screenx >= 3 && screenx <= 4 && screeny >= 3 && screeny <= 4) area = 0;
                distortion |= screeny > 3 && area != 0;
                DrawTile(tilesets[area], ...getTransformedCoords(ix, iy));
            }

            // Water tile. If we encounter one, we set the distortion effect and tell it
            // to start on the row we found the tile.
            if(id === 11) {
                DrawSprite(SpriteID([49,50,51],8,8), ...getTransformedCoords(ix, iy, 8), 0);
                distrow = ((iy-sy)*8)+4;

                distortion = true;
            }
            // Save Point - when this gets hit we save the player X/Y coordinates and refill
            // their health.
            if(id === 12) {
                let [x, y] = getTransformedCoords(ix, iy, 8);
                DrawSprite(sprSavePoint,x,y);
                if(aabbTest(px, py, 8, 8, x+sx*8,y+sy*8, 8, 8)) {
                    if(!touchedSave) {
                        beep([[329,50],[440,50],[659,50]])
                        store('px', px);
                        store('py', py);
                        fxSave(x, y)
                        playerHealth=playerMaxHealth;
                    }
                    touchedSave = 60
                }
            }
            // Health Upgrade - adds 2 max health points
            if(id === 14 &&!extraSaveData.hpUpgrades[area-1]) { 
                let [x,y] = getTransformedCoords(ix, iy, 8);
                DrawSprite(sprUpgradeIconBG, x, y);
                DrawSprite(sprHealthUpgrade, x, y);
                if(aabbTest(px, py, 8, 8, x+sx*8, y+sy*8, 8, 8)) {
                    fxSave(x, y)
                    fxBigExplode(x, y);
                    beep(sndPickup)
                    extraSaveData.hpUpgrades[area-1]=1;
                    store(`hp${area-1}`, 1);
                    playerMaxHealth = playerHealth = playerMaxHealth+2;
                }

            }
            // Suit upgrade. Reduces damage taken by 25% for each one found.
            if(id === 8 && !extraSaveData.suitUpgrades[ix < 64 ? 0:1]) {
                let [x,y] = getTransformedCoords(ix, iy, 8);
                DrawSprite(sprUpgradeIconBG, x, y);
                DrawSprite(sprUpgrades[0], x, y);
                if(aabbTest(px, py, 8, 8, x+sx*8, y+sy*8, 8, 8)) {
                    fxSave(x, y);
                    fxBigExplode(x, y);
                    beep(sndPickup);
                    extraSaveData.suitUpgrades[ix < 64 ? 0: 1] = 1;
                    store(`suit${ix<64?0:1}`,1);
                    suitLevel++; damageMult-=0.25;
                }
            }
            // Weapon upgrades - four in total
            if(id === 6 && !extraSaveData.weaponUpgrades[area-1]) {
                let [x, y] = getTransformedCoords(ix, iy, 8);
                DrawSprite(sprUpgradeIconBG, x, y);
                DrawSprite(sprUpgrades[area], x, y);
                if(aabbTest(px, py, 8, 8, x+sx*8, y+sy*8, 8, 8)) {
                    fxSave(x, y);
                    fxBigExplode(x, y);
                    beep(sndPickup);
                    beep(sndExplode);
                    extraSaveData.weaponUpgrades[area-1]=1;
                    store(`wep${area-1}`,1);
                    playerWeapon++;
                }
            }
            // The reactor in the middle of the map
            if(id === 9 && !drawn_reactor && reactor_hp > 0) {
                let [x,y] = getTransformedCoords(ix, iy, 8);
                let bosses = bossDefeated.reduce((ac,v) => ac+v)
                // If we've defeated all four bosses, open it up and allow it to take damage
                if(bosses == 4) {
                    for(i of player_projectiles) {
                            if(aabbTest(x-1+sx*8,y-2+sy*8,16,24,i.x, i.y, 8, 8)) {
                            i.x = -100;
                            beep(sndExplode);
                            screenShake = 4;
                            reactor_hp -= i.damage;
                        }   
                    }
                    if(reactor_hp <= 0) {
                        beep(sndAlarm);
                        beep(sndExplode);
                        beep(sndPickup);
                        screenShake = 8;
                        fxBigExplode(x+4,y+6);
                        fxLargeExplode(x-8,y-8);
                        fxLargeExplode(x+16,y-8);
                        fxLargeExplode(x-8,y+24);
                        fxLargeExplode(x+16,y+24);
                        escape_sequence = 1;
                    }
                    DrawBatchSprites([
                        [reactor, x, y-16],
                        [reactor, x, y+24,180,true],
                        [reactorCore, x,y-2],
                        [reactorCore, x+8,y-2,0,1],
                        [reactorCore, x,y+10,180,1],
                        [reactorCore, x+8,y+10,180,0],
                        [reactorLights[bossDefeated[1]], x-8, y-16],
                        [reactorLights[bossDefeated[2]], x+16, y-16],
                        [reactorLights[bossDefeated[3]], x+16, y+24],
                        [reactorLights[bossDefeated[4]], x-8, y+24],
                        [screwHead, x+4, y-8],
                        [screwHead, x+4, y+16, 180, true],
                        [screwBody,x+4, y-16],
                        [screwBody,x+4, y+24, 180, true]
                    ])
                } else {
                    // Otherwise we render the reactor and the lights around it
                    // lighting up the ones that correspond to a defeated boss.
                    DrawBatchSprites([
                        [reactor, x, y],
                        [reactor, x, y+8,180,true],
                        [reactorLights[bossDefeated[1]], x-8, y-16],
                        [reactorLights[bossDefeated[2]], x+16, y-16],
                        [reactorLights[bossDefeated[3]], x+16, y+24],
                        [reactorLights[bossDefeated[4]], x-8, y+24],
                        [screwHead, x+4, y-8],
                        [screwHead, x+4, y+16, 180, true],
                        [screwBody,x+4, y-16],
                        [screwBody,x+4, y+24, 180, true]
                    ])
                }

                drawn_reactor = true;
            }
        }
    }

    // The 'escape sequence'. Basically shakes the screen every few frames,
    // and spawns random explosions on the screen.
    if(escape_sequence) {
        DrawSprite(sprEscape,48,120);
        if(escape_counter<20) escape_counter++;
        else {
            screenShake = 1+floor(random()*3);
            escape_counter = 0;            
            
            beep(sndHurt);
            beep(sndHurt);
            distortion = true;
            fxExplode(random()*128,random()*128);
            fxLargeExplode(random()*128,random()*128);
        }
    }

    // Screen position update code
    screenx = floor((px / 8) / 16);
    screeny = floor((py / 8) / 16);

    // A function to allow things to hurt the player. Until about halfway through the month, I
    // was using on-location damage checks - a very bad idea, since it's repeating the same
    // code over-and-over.
    let hurtPlayer = (damage,len) => {
        if(!playerFlicker) {
            playerFlicker = len;
            playerHealth -= damage*damageMult;
            beep(sndHurt);
            screenShake = 2;
        }
    }

    // This function checks if the given coordinate is outside of the view
    let outOfView = (x, y) => {
        [x, y] = [x-sx*8, y-sy*8];
        return x < 0 || x > 127 || y < 0 || y > 127;
    };

    // And this one tests the given coordinate against all the currently active player projectiles.
    // If one is colliding and a callback was provided, the callback is called.
    let playerProjectileTest = (x,y,w=8,h=8, cb=null) => {
        for(i of player_projectiles) {
            if(aabbTest(i.x+2,i.y+2,4,4,x,y,w,h)) {
                // You'll be seeing lots of this kind of short-circuit evaluation abuse.
                cb&&cb(i)
            }
        }
    }

    // And here's one of my favorite hacks - using Array.filter to create a simple entity system.
    // If we need to kill anything in a list off, we just return false.
    // This is the effect list, and all it does is draw the effect, update its position and 
    // delete it if the lifespan is zero.
    fx = fx.filter((effect) => {
        DrawSprite(effect.sprite,effect.x,effect.y);
        effect.lifespan -= 1;
        effect.x += effect.dirx;
        effect.y += effect.diry;
        return effect.lifespan > 0;
    });

    // Player projectile update code. Nothing special, they just move and get destroyed
    // if they collide with a wall or are outside of the view.
    // They will also spawn an effect if they have one set.
    player_projectiles = player_projectiles.filter((proj) => {
        DrawSprite(proj.sprite, proj.x-sx*8, proj.y-sy*8, 0, proj.dirx < 0);
        proj.x += proj.dirx;
        let live = true;
        if(mapTest(proj.x+2, proj.y+2, proj.x+6, proj.y+6)) {
            proj.effect && proj.effect(proj.x-sx*8,proj.y-sy*8);
            beep([[100,20]]);
            live = false;
        }
        live ^= outOfView(proj.x,proj.y);
        return live;
    });

    // The doors. We're just checking their "type" against the currently equipped player
    // weapon damage to determine whether they can be destroyed or not. Also we're doing
    // a simple collision test to prevent players from moving through them.
    doors = doors.filter(door=>{
        let live = true;
        DrawSprite(sprDoorBasic,door.x-sx*8,door.y-sy*8);
        if(door.type==1) DrawSprite(sprDoorBlockRocket,door.x-sx*8,door.y+4-sy*8);
        if(door.type==2) DrawSprite(sprDoorBlockPlasma,door.x-sx*8,door.y+4-sy*8);
        if(aabbTest(door.x,door.y,8,16,px,py,8,8)) {
            if(door.x+4 > px) px = door.x-8; else px = door.x+8;
        }
        playerProjectileTest(door.x,door.y,8,16,_=>{
            _.x=-1000;
            if(_.damage-1>=door.type+1) {
                beep(sndExplode);
                fxLargeExplode(door.x-8-sx*8,door.y-4-sy*8);
                live=false;
            } else {
                beep(sndPlink);
            }
        });
        return live;
    });

    // This 'spawn after' array is used after the main update loop for
    // enemy_projectiles, specifically for the one projectile type that spawns
    // a bunch of mini-projectiles after it expires.
    let spawnAfter = [];

    // Enemy projectile behaviors are dealt with based on their type value.
    enemy_projectiles = enemy_projectiles.filter((proj) => {
        DrawSprite(proj.spr, proj.x-sx*8, proj.y-sy*8);
        let live = true;

        // This function returns a vector pointing to the player. Used by the 
        // tracking projectiles.
        let slope = (x1,y1,x2,y2,m=1.0) => {
            let [lx,ly]=[x2-x1,y2-y1]
            let len = Math.sqrt(lx*lx+ly*ly);
            return [lx/len*m,ly/len*m]
        }

        if(proj.type==1) { // This type fires diagonally left or right.
            !proj.init&&(proj.init=proj.dx=px<proj.x?-1:1)
        }
        if(proj.type == 2) { // This type is used by the second boss - the 'bubbles'
            !proj.desty&&(proj.desty=(sy*8)+16+floor(random()*64));
            proj.y>proj.desty&&(proj.y-=0.5)
            proj.y<=proj.desty&&(live=0);
        }
        if(proj.type == 3) { // This type is the tracking projectile
            !proj.init&&(proj.init=[proj.dx,proj.dy]=slope(proj.x,proj.y,px,py,0.6))            
        }

        proj.x += proj.dx;
        proj.y += proj.dy;

        // If this projectile is type 2 and it's expired, spawn a bunch of
        // normal projectiles.
        if(proj.type==2 && live==0) {
            eightDirections.forEach(_=>spawnAfter.push([proj.x,proj.y,0,..._]))
            live = 0;
        }

        if(mapTest(proj.x+2, proj.y+2, proj.x+6, proj.y+6)) live=proj.type==3?1:0;
        if(outOfView(proj.x,proj.y)) live = 0;
        return live;
    });

    for(i of spawnAfter) spawnEnemyProjectile(...i);

    // Enemy spawners
    for(let spawner of enemy_spawners) {
        spawner[2] = !outOfView(spawner[0], spawner[1]) && (_=>{
            spawner[3] && !spawner[2] && spawner[3](spawner[0], spawner[1],spawner[4], spawner[5], spawner[6]);
            return true;
        })();
    }

    // Enemy behaviors
    active_enemies = active_enemies.filter((enemy) => {
        if(outOfView(enemy.x, enemy.y)) return false;
        DrawSprite(enemy.sprite, enemy.x-sx*8, enemy.y-sy*8, enemy.dir);

        // If we're enemy type 0, shoot a type 0 projectile every 60 ticks, etc...
        !(enemyCounter % 60)&&enemy.type==0&&spawnEnemyProjectile(enemy.x, enemy.y, enemy.type, enemy.dx, enemy.dy);
        !(enemyCounter % 80)&&enemy.type==1&&spawnEnemyProjectile(enemy.x, enemy.y, enemy.type, enemy.dx, enemy.dy);
        !(enemyCounter % 70)&&enemy.type==2&&spawnEnemyProjectile(enemy.x, enemy.y, 3, 0, 0, sprEnmProj3);
        if(enemy.type==3) { // "Rover" type enemy - moves left and right
            if(mapTest(enemy.x+1+enemy.dx*0.4,enemy.y+1,enemy.x+7+enemy.dx*0.4, enemy.y+7)) {
                enemy.dx=-enemy.dx;
                enemy.x = snap(enemy.x+4, 8);
                enemy.dir = enemy.dx>0?270:90;                
            } else {
                enemy.x+=enemy.dx*0.4;        
            }
        }
        if(enemy.type==4) { // Other variation of the "Rover", moves, up and down
            if(mapTest(enemy.x+1,enemy.y+1+enemy.dy*0.4,enemy.x+7, enemy.y+7+enemy.dy*0.4)) {
                enemy.dy=-enemy.dy;
                enemy.y = snap(enemy.y+4,8);
                enemy.dir = enemy.dy>0?180:0;
            } else {
                enemy.y+=enemy.dy*0.4;                
            }
        }
        if(enemy.type==3||enemy.type==4) { // Spawns bubbles or fire for rover enemies
            if(globalclock%3==0){
                if(enemy.y>640) fxBubbles(enemy.x-sx*8,enemy.y-sy*8);
                else fxJetpack(enemy.x-sx*8,enemy.y-sy*8);
            }  
        }

        if(aabbTest(enemy.x+2,enemy.y+2,4,4,px,py,8,8)) { // Contact damage test
            hurtPlayer(2,50);
        }

        // Here's an example of somewhere I should be using the playerProjectileTest function,
        // but I'm leaving things exactly as they are in the main distribution (For now)
        for(let pbullet of player_projectiles) {
            if(aabbTest(enemy.x, enemy.y, 8, 8, pbullet.x+2,pbullet.y+2,4,4)) {
                enemy.hp -= pbullet.damage;
                beep([[100,20],[220,50],[110,75]]);
                screenShake = 1;
                pbullet.x = -100;
                if(enemy.hp<=0) {
                    fxExplode(enemy.x-sx*8, enemy.y-sy*8);
                    if(playerHealth < playerMaxHealth && random()*100 > 50) { 
                        health_pickups.push([enemy.x, enemy.y]);
                    }
                    if(enemy.type==5) {
                        eightDirections.forEach(_=>spawnEnemyProjectile(enemy.x,enemy.y,0,..._));
                    }
                    return false;
                }
            }
        }
        return true;
    });

    // A simple last-minute feature. At first I wasn't going to have health pickups, but after
    // adding some extra enemies, and contact damage, I felt it was a bit unfair otherwise.
    health_pickups = health_pickups.filter(_=>{
        if(outOfView(..._)) return false;
        DrawSprite(sprHealthPickup, _[0]-sx*8, _[1]-sy*8);
        if(aabbTest(_[0]+2,_[1]+2,4,4,px,py,8,8)) {
            beep(sndPlink);
            if(playerHealth < playerMaxHealth) playerHealth++;
            return false;
        }
        return true;
    });  

    // Boss spawners will check if a boss can spawn, and then removes the spawner from view.
    for(let bossSpawner of bossSpawners) {
        bossDefeated[area] = ~~retrieve(`boss${area}`);
        if(!outOfView(bossSpawner.x, bossSpawner.y) && px-sx*8 > 8 && px-sx*8 < 121) {
            bossSpawner.x = -100;
            if(!bossDefeated[area]) {
                bossPhase = 0
                bossCounter = 0
                active_boss = Boss(area)
                boss_warning = 0
            }
        }
    }

    // Boss Update Code - where most of the time went.
    if(active_boss) {
        // These are the doors that block the boss arena
        DrawBatchSprites([
            [sprBossDoor, 0, 56],
            [sprBossDoor, 0, 64],
            [sprBossDoor, 120, 56],
            [sprBossDoor, 120, 64]
        ]);

        // And before we show the boss, display the warning
        if(boss_warning < 180) {
            DrawSprite(sprWarning, 44, 30);            
            if(boss_warning == 0) { beep(sndAlarm); }            
            boss_warning++;     
        } else {

            active_boss.flicker && active_boss.flicker--;

            // The "Magma Worm" boss - I wrote this one first
            if(area === 4) {
                // This function checks for contact damage, segments included.
                const playerHitCheck = cb => {
                    if(aabbTest(px,py,8,8,24+bossX+sx*8,sy1+sy*8,24*active_boss.segs,24)) {
                        hurtPlayer(2,50);
                        fxBuster(px-sx*8, py-sy*8);
                        screenShake = 2;
                        px -= 24;
                        cb();
                    }
                }
                
                let [x, y] = [112,56],
                    sb = floor(Math.sin(sintimer/2) * 3),
                    sy1 = y-2+sb,
                    sy2 = y-2-sb;

                const bossHitCheck = cb => {
                    if(active_boss.flicker) return;
                    for(let p of player_projectiles) {
                        if(aabbTest(p.x+2,p.y+2,4,4,x-(active_boss.segs*16)+sx*8,sy1+sy*8,24,24)) {
                            p.x = -100;
                            active_boss.hp -= p.damage;
                            beep(sndHurt);
                            active_boss.flicker = 60;
                            screenShake = 1;
                            cb();
                            if(active_boss.hp <= 0) {
                                if(active_boss.segs > 1) {
                                    let bx = x-(active_boss.segs*16);
                                    fxLargeExplode(bx, y);
                                    active_boss.segs--;
                                    beep(sndExplode);
                                    screenShake = 4;
                                    active_boss.hp = 20;
                                } else {
                                    fxBigExplode(x+8, sy1+8);
                                    screenShake = 8;
                                    beep(sndExplode);
                                    active_boss = null;
                                    break;
                                }
                            }
                        }
                    }
                }
                
                // The 'brains' of the boss. A very rudimentary state machine.
                // I'll let it speak for itself, mostly.
                switch(bossPhase) {
                    case 0: // Initialization phase
                        bossX = 128
                        bossY = 56
                        bossPhase++
                        break;
                    case 1: // "Appearing" stage (Where it slides in from the right)
                        bossX > x-(active_boss.segs+1)*16 ? bossX-- : bossPhase++; break;
                    case 2: // "Hittable stage" (When it's staying still and attacking)
                        bossHitCheck(_ => active_boss.hp<=0&&(bossPhase=3))
                        bossCounter<60&&(bossCounter++)
                        if(bossCounter>=60) {
                            bossCounter = 0;
                            if(rnd(100)>50) bossPhase = 6; // Random chance to do the fire-breathe atack, else do the projectile burst
                            else ([[-1,0],[-0.7,-0.7],[-0.7,0.7]].forEach(_=>{spawnEnemyProjectile(bossX+16+sx*8,sy1+8+sy*8,0,..._)}));
                        }
                        break;
                    case 3:
                        // When damaged enough, leave the screen quickly
                        bossX < 128 ? bossX+=2 : bossPhase = 4;
                        break;
                    case 4:
                        // Initialize the wave of fire
                        for(i of range(0, 64)) {
                            bossdata[i] = [i*8,0,24+Date.now() % 64,0,128]
                        }
                        bossPhase = 5;
                        break;
                    case 5:
                        // Fire Wave attack - I spent way too much time on this.
                        globalclock%2==0&&beep([[55,4],[110,8]]);
                        for(i in bossdata) {
                            if(bossdata[i][0] > -512) bossdata[i][0]-=0.25*(5-active_boss.segs); else { bossPhase = 1, bossdata = []; break; }
                            if(bossdata[i][0] < -8) continue;
                            if(bossdata[i][0] > -128 && bossdata[i][3] < bossdata[i][2]) bossdata[i][3]+=0.2*(5-active_boss.segs);
                            if(bossdata[i][0] > -128 && bossdata[i][4] > bossdata[i][2]+24) bossdata[i][4]-=0.2*(5-active_boss.segs);
                            let a = bossdata[i][3]+floor(Math.sin(sintimer/16+bossdata[i][0]/16+i/8)*12);
                            let b = bossdata[i][4]+floor(Math.sin(sintimer/16+bossdata[i][0]/16+i/8)*12);
                            DrawSprite(sprFireHead, bossdata[i][0], a,180,true);
                            DrawSprite(sprFireHead, bossdata[i][0], b);
                            for(j = 0; j < 12; j++) {
                                DrawSprite(sprFireBody, bossdata[i][0], a-8-8*j,180,true)
                                DrawSprite(sprFireBody, bossdata[i][0], b+8+8*j)
                            }
                            if(aabbTest(bossdata[i][0]+sx*8,sy*8,8,a-5,px,py,8,8) ||
                                aabbTest(bossdata[i][0]+sx*8,b+9+sy*8,8,b,px, py, 8, 8)) {
                                    hurtPlayer(2,50);
                                }
                        }
                        break;
                    case 6:
                        // Fire Breathe attack
                        bossCounter<104&&bossCounter++
                        bossHitCheck(_ => active_boss.hp<=0&&(bossPhase=3))
                        if(bossCounter >= 104) {
                            for(i in range(0, 6)) {
                                bossdata[i] = [8,56-8*i,40,-i*8,0];
                                bossdata[i+6] = [8,64+8*i,40,-i*8,0];
                                bossPhase = 7;
                            }
                        }
                        DrawSprite(sprFireHead, bossX+16-bossCounter,sy1+8,270,true);
                        for(i = 0; i < 6; i++) DrawSprite(sprFireBody,bossX+16-bossCounter+8+8*i,sy1+8,270,true);
                        if(aabbTest(px,py,8,8,bossX+24-bossCounter+sx*8,sy1+8+sy*8,56,8)) {
                            hurtPlayer(2,50);
                        }
                        break;
                    case 7:
                        // Part two of the fire-breathe atack (The fire wave on the left wall)
                        let n = 0;
                        bossHitCheck(_ => active_boss.hp<=0&&(bossPhase=3))
                        for(i in bossdata) {
                            DrawSprite(sprFireHead, bossdata[i][0]+bossdata[i][3],bossdata[i][1],90,true);
                            for(j=0;j<6;j++) DrawSprite(sprFireBody,bossdata[i][0]+bossdata[i][3]-8-8*j,bossdata[i][1],90,1);
                            if(!bossdata[i][4]) {
                                if(bossdata[i][3]<bossdata[i][2]) bossdata[i][3]++,n++
                                else bossdata[i][4]=1
                            }
                            if(bossdata[i][4]==1) {
                                if(bossdata[i][3]>0)bossdata[i][3]-=2,n++
                                else {
                                    fxExplode(bossdata[i][0],bossdata[i][1]);
                                    let r = floor(bossdata[i][1]/8) % 8;

                                    r%2==0&&spawnEnemyProjectile(bossdata[i][0]+sx*8,bossdata[i][1]+sy*8,0,1,0);
                                    bossdata[i][4]=2
                                    bossdata[i][0]=-8;
                                }
                            }
                            if(aabbTest(8+sx*8,bossdata[i][1]+sy*8,bossdata[i][3],8,px,py,8,8)) {
                                hurtPlayer(2,50);
                            }
                        }
                        if(!n) {
                            bossPhase = 1;
                            bossdata = [];
                        }
                        break;
                    }

                if(active_boss) {
                    playerHitCheck(_=>null);
                    DrawBatchSprites([
                        [sprBoss1, bossX+16, sy1, 0, false, active_boss.flicker],
                        [sprBoss1, bossX+16, sy1+12, 180, true, active_boss.flicker],
                    ]);
                    for(let i = 0; i < active_boss.segs; i++) {
                        DrawBatchSprites([
                            [sprBoss1_seg, bossX+26+i*16, i % 2 ? sy2 : sy1, 0, false],
                            [sprBoss1_seg, bossX+26+i*16, i % 2 ? sy2+12 : sy1+12, 180, true]
                        ]);
                    }
                }
            }
            if(area === 2) { // The Underwater Plant boss
                let [bx,by,bw,bh] = [56,96,16,16];
                if(aabbTest(px,py,8,8,bx+sx*8,by+sy*8,bw,bh)) hurtPlayer(2,50);

                if(active_boss.open) {
                    DrawBatchSprites([
                        [sprBoss2_open, 52,96,0,0,active_boss.flicker&&active_boss.flicker%2==0],
                        [sprBoss2_open, 64,96,0,1,active_boss.flicker&&active_boss.flicker%2==0]
                    ])
                } else {
                    DrawBatchSprites([
                        [sprBoss2_closed,64,96,0,0,active_boss.flicker&&active_boss.flicker%2==0],
                        [sprBoss2_closed,56,96,0,1,active_boss.flicker&&active_boss.flicker%2==0]
                    ]);
                }

                playerProjectileTest(bx+sx*8,by+sy*8,bw,bh,_=>{
                    if(!active_boss.flicker) {
                        _.x=-100;
                        if(active_boss.open) { // Can only hurt the main boss when it's open
                            beep([[0,10],...sndHurt]);
                            active_boss.hp-=i.damage;
                            active_boss.flicker = 10;
                            screenShake = 2;
                        } else {
                            beep(sndPlink);
                        }
                    }
                })

                // Wibble's a wonderful word.
                let xwibble = Math.sin(sintimer*2)*2;

                switch(bossPhase) {
                    case 0: // The "do nothing and spawn burst projectile pods" phase
                        DrawSprite(sprBoss2_pod,36+xwibble,112);
                        DrawSprite(sprBoss2_pod,84-xwibble,112);
                        if(bossCounter < 120) bossCounter+=1+(2-active_boss.phases)*0.5;
                        else {
                            bossCounter = 0;
                            if(active_boss.counter2 < 4+(2-active_boss.phases)*2) {
                                active_boss.counter2++;
                                spawnEnemyProjectile((48*active_boss.counter)+36+xwibble+sx*8,112+sy*8,2,0,0,sprEnmProj2)
                                active_boss.counter=!active_boss.counter;
                            } else {
                                active_boss.counter = 112;
                                active_boss.counter2 = 5;
                                bossPhase = 1;
                            }
                        }
                        break;
                    case 1: // The "extend vines to the ceiling" phase
                        if(active_boss.counter4 == 0) {
                            if(active_boss.counter > 8) active_boss.counter -= 2;
                        } else {
                            if(active_boss.counter < 120) active_boss.counter += 2;
                            else bossPhase = 2;
                        }

                        DrawSprite(sprBoss2_pod,36+xwibble,active_boss.counter);
                        DrawSprite(sprBoss2_pod,84-xwibble,active_boss.counter);
                        for(i=0;i<floor((128-active_boss.counter)/8)-1;i++) {
                            DrawSprite(sprBoss2_vine, 36+xwibble,active_boss.counter+i*8,0,i%2==0,active_boss.counter3%2==1);
                            DrawSprite(sprBoss2_vine, 84-xwibble,active_boss.counter+i*8,0,i%2==0,active_boss.counter3%2==1);
                        }
                        if(active_boss.counter4==0) {
                            [36+xwibble+sx*8,84-xwibble+sx*8].forEach(_=>{
                                aabbTest(px,py,8,8,_,active_boss.counter+sy*8,8,120-active_boss.counter)&&hurtPlayer(1,50);
                                playerProjectileTest(_,active_boss.counter+sy*8,8,120-active_boss.counter,_=>{
                                    _.x=-100;
                                    if(!active_boss.counter3) {
                                        beep([[0,15],...sndExplode]);
                                        active_boss.counter3 = 30;
                                        active_boss.counter2 -= _.damage;
                                        screenShake = 1;
                                    }
                                });
                                if(active_boss.counter2 <= 0) {
                                    active_boss.counter4 = 1;
                                    for(i = 0; i < 16; i++) {
                                        fxExplode(_-sx*8, i*8);
                                    }
                                }
                            });
                        }
                        active_boss.counter3&&active_boss.counter3--;
                        break;
                    case 2: // The "can be damaged" phase.
                        active_boss.open = 1;
                        if(active_boss.hp <= 0) {
                            fxLargeExplode(bx-4,by-4);
                            beep(sndExplode);
                            if(active_boss.phases > 0) {
                                active_boss.phases--;
                                active_boss.hp = 20;
                                active_boss.open = 0;
                                active_boss.counter4 = 0;
                                bossPhase = 0;
                            }
                        }
                        break;
                }


                if(active_boss.hp <= 0) {
                    fxBigExplode(bx+4,by+4)
                    beep(sndExplode)
                    active_boss = null;
                    bossPhase = 0;
                    bossCounter = 0;
                }
            }
            if(area === 1) { // The "I can't believe it's not Mother Brain" boss.
                DrawSprite(sprBoss3_brain, 16, 56,0,0,active_boss.flicker>0&&active_boss.flicker%2==0);
                let [bx,by] = [16+sx*8,56+sy*8];
                active_boss.flicker>0&&active_boss.flicker--;
                playerProjectileTest(bx,by,16,16,_=>{
                    _.x=-1000;
                    if(!active_boss.flicker) {
                        active_boss.flicker = 15;
                        active_boss.hp-=_.damage;
                        beep(sndHurt);
                        screenShake = 2;
                    }
                })

                if(aabbTest(bx,by,16,16,px,py,8,8)) {
                    px = bx+24;
                    hurtPlayer(2,30);
                    screenShake = 2;
                }
                switch(bossPhase) {
                    case 0:
                        [[40,48],[56,48],[64,48],[80,48],[96,48]].forEach(_=>active_boss.barriers.push([..._,3]))
                        bossPhase = 1;
                    case 1:
                        active_boss.barriers = active_boss.barriers.filter(i => {
                            for(j=0;j<4;j++) {
                                DrawSprite(sprBoss3_barrier[i[2]-1],i[0],i[1]+j*8);
                            }
                            if(px-sx*8<i[0]+8) px=i[0]+8+sx*8;
                            playerProjectileTest(i[0]+sx*8,i[1]+sy*8,8,32,_=>{
                                _.x=-1000;
                                beep(sndPlink);
                                screenShake = 1;
                                i[2]-=1;
                            })
                            return i[2]>0;
                        })
                        for(i of active_boss.turrets) {
                            DrawSprite(enmSprTurret2,i[0],i[1],i[1]<56?180:0);
                        }
                        if(bossCounter < 90) bossCounter++;
                        else {
                            for(i of active_boss.turrets) {
                                bossCounter=0,spawnEnemyProjectile(i[0]+sx*8,i[1]+sy*8,3,0,i[1]<64?1:-1,sprEnmProj3)
                                beep(sndPlink);
                            }
                        }
                }

                if(active_boss.hp <= 0) {
                    if(active_boss.phases > 0) {
                        active_boss.phases--;
                        active_boss.hp = 20;
                        px = 108+sx*8;
                        py = 60+sy*8;
                        bossPhase = 0;
                        active_boss.turrets=[[8,80],[32,80],[8,24],[32,24]]
                    } else {
                        active_boss = null;
                        bossPhase = 0;
                        bossCounter = 0;
                    }
                    fxBigExplode(bx+4-sx*8,by+4-sy*8)
                    screenShake = 4;
                    beep(sndExplode)
                }
            }
            if(area === 3) { // The "Laser Tank" boss.
                active_boss.x == 0 && (active_boss.x=48,active_boss.y=16)
                DrawBatchSprites([
                    [sprBoss4_body,active_boss.x,active_boss.y,0,0,active_boss.flicker&&active_boss.flicker%2==0],
                    [sprBoss4_body,active_boss.x+16,active_boss.y,0,1,active_boss.flicker&&active_boss.flicker%2==0],
                    [screwHead,active_boss.x+12,active_boss.y-8]
                ])

                for(i=active_boss.y-16;i>0;i-=8){
                    DrawSprite(screwBody,active_boss.x+12,i);
                }

                playerProjectileTest(active_boss.x+sx*8,active_boss.y+sy*8,32,16,_=>{
                    _.x=-100;
                    beep(sndPlink);
                    if(!active_boss.flicker){
                        active_boss.flicker = 90;
                        screenShake = 1;
                        active_boss.hp -= _.damage;
                    }
                })

                active_boss.flicker > 0 && active_boss.flicker--;
                if(aabbTest(active_boss.x+sx*8,active_boss.y+sy*8,32,16,px,py,8,8)) {
                    px-sx*8 < 64 ? px -= 16 : px += 16;
                    hurtPlayer(1,50);
                }

                switch(bossPhase) {
                    case 0: // Initialization
                        active_boss.positions=[8,48,88,48];
                        active_boss.posidex=0;
                        bossPhase=1;
                        active_boss.counter2 = 30;
                    case 1: // Move to next target location
                        active_boss.posidex > 3 &&(active_boss.posidex=0);
                        if(bossCounter < active_boss.counter2) bossCounter++;
                        else {
                            bossCounter = 0;
                            if(active_boss.counter<6) bossPhase = 2; else bossPhase = 6;
                        }
                        break;
                    case 2: 
                        if(bossCounter <= active_boss.counter2) {
                            bossCounter+=0.5;
                            active_boss.x = lerp(active_boss.x, active_boss.positions[active_boss.posidex],easeIn(bossCounter/(active_boss.counter2*1.5)));
                        }
                        else { bossCounter=0,bossPhase = 3,screenShake=1,beep(sndHurt) }
                        break;
                    case 3: // Fire laser
                        j = 8;
                        DrawSprite(sprBoss4_laserstartup, active_boss.positions[active_boss.posidex]+2,28);
                        DrawSprite(sprBoss4_laserstartup, active_boss.positions[active_boss.posidex]+22,28);
                        for(i=0;i<=j;i++) {
                            DrawSprite(sprBoss4_laserstartup, active_boss.positions[active_boss.posidex]+2,32+i*8);
                            DrawSprite(sprBoss4_laserstartup, active_boss.positions[active_boss.posidex]+22,32+i*8);
                        }
                        if(bossCounter<10){bossCounter++;} else {bossCounter=0;bossPhase=4;screenShake=1;}
                        break;
                    case 4:
                        j = 8;
                        DrawSprite(sprBoss4_laserhead, active_boss.positions[active_boss.posidex]+2,28);
                        DrawSprite(sprBoss4_laserhead, active_boss.positions[active_boss.posidex]+22,28);
                        for(i=0;i<=j;i++) {
                            DrawSprite(sprBoss4_laserbody, active_boss.positions[active_boss.posidex]+2,32+i*8);
                            DrawSprite(sprBoss4_laserbody, active_boss.positions[active_boss.posidex]+22,32+i*8);
                        }
                        if(bossCounter<20){bossCounter++;} else {
                            eightDirections.forEach(_=> {
                                spawnEnemyProjectile(active_boss.positions[active_boss.posidex]+2+sx*8,(32+8*j)+sy*8,0,..._,sprEnmProj3)
                                spawnEnemyProjectile(active_boss.positions[active_boss.posidex]+22+sx*8,(32+8*j)+sy*8,0,..._,sprEnmProj3)
                            });
                            bossPhase=5;
                        }
                        [2,22].forEach(_=>{
                            if(aabbTest(active_boss.x+_+sx*8,active_boss.y+32+sy*8,8,64,px,py,8,8)) {
                                hurtPlayer(4,50);
                            }
                        })
                        break;
                    case 5: // Spawn a single tracking projectile
                        spawnEnemyProjectile(active_boss.positions[active_boss.posidex]+12+sx*8,20+sy*8,3,0,0,sprEnmProj3);
                        bossPhase=1;bossCounter=0;active_boss.posidex++;screenShake=1;active_boss.counter++;
                        break;
                    case 6: // Crash to floor
                        if(bossCounter<active_boss.counter2) bossCounter++; else {
                            bossCounter = 0;
                            bossPhase=7;
                            screenShake = 3;
                            beep(sndExplode);
                            fxLargeExplode(active_boss.x+4,active_boss.y-8);
                        }                    
                        active_boss.y = lerp(active_boss.y, 88, easeIn(bossCounter/(active_boss.counter2*1.5))); 
                        break;
                    case 7: // Fire off wave of tracking projectiles
                        if(bossCounter < active_boss.counter2) bossCounter++; else {
                            bossCounter=0
                            spawnEnemyProjectile(active_boss.x+12+sx*8,active_boss.y+8+sy*8,3,0,0,sprEnmProj3)
                        }
                        if(active_boss.counter3 < 400) active_boss.counter3++; else {
                            bossPhase = 8;
                            active_boss.counter3 = 0;
                            bossCounter=0;
                        }
                        break;
                    case 8: // Return to ceiling
                        if(bossCounter<active_boss.counter2) bossCounter++; else {
                            bossCounter = 0;
                            bossPhase = 1;
                            screenShake = 3;
                            beep(sndHurt);
                            active_boss.counter = 0;
                        }
                        active_boss.y = lerp(active_boss.y, 16, easeIn(bossCounter/(active_boss.counter2*1.5)));
                        break;              
                }

                if(active_boss.hp <= 0) {
                    fxLargeExplode(active_boss.x,active_boss.y);
                    if(active_boss.phases > 0) {
                        active_boss.hp = 20;
                        active_boss.counter2 -= 5;
                        active_boss.phases--;
                        bossCounter = 0;
                        bossPhase=bossPhase==7?8:1;
                        active_boss.posidex = 0;
                        active_boss.counter3 = 0;
                    } else {
                        active_boss = null;
                        bossPhase = bossCounter = 0;
                        beep(sndExplode);
                    }
                }
            }

            if(!active_boss) {
                bossDefeated[area] = 1;
                store(`boss${area}`, 1);            
            }
    }
    }

    // Player Update Code
    if(!gameOver) {
        // Player damage detection
        for(let eproj of enemy_projectiles) {
            if(playerFlicker) break;
            if(aabbTest(px, py, 8, 8, eproj.x+3,eproj.y+3,2,2)) {
                eproj.x = -100;
                hurtPlayer(1, 30);
            }
        }

        if(playerHealth <= 0) {
            gameOver = true;
            globalclock = 0;
            beep(sndExplode)
            fxBigExplode(px-sx*8, py-sy*8);
        }

        // Player movement code
        let movx = keys[39] - keys[37], movy = keys[40] - keys[38];

        // Gamepad movement implementation        
        if(gp) {
            gp = navigator.getGamepads()[gp.index];
            movx = (gp.axes[0]>0.5?1:0) - (gp.axes[0]<-0.5?1:0);
            movy = (gp.axes[1]>0.5?1:0) - (gp.axes[1]<-0.5?1:0);
            keys[32] = gp.buttons[0].value?1:0;
        }     
        
        moving = movx | movy;
        pf = movx ? movx < 0 : pf;

        // Stop player from leaving active boss rooms
        if(active_boss) {
            px = px-sx*8 < 8 ? 8+sx*8 : px;
            px = px-sx*8 > 112 ? 112+sx*8 : px;
        }

        // Map collision test
        let deltx = (px+4)+(movx*5), delty = (py+4)+(movy*5);
        px = !mapTest(deltx, py+1, deltx, py+7) ? px+movx : snap(px+1, 8);
        py = !mapTest(px+1, delty, px+7, delty) ? py+movy : snap(py+1, 8);

        // Fire-button press
        keys[32] && !kpSpace && player_projectiles.length < 5 && spawnProjectile[playerWeapon](px, py, pf ? -2 : 2) && beep(playerWeaponSounds[playerWeapon])
        kpSpace = keys[32];

        // Jetpack particle spawning
        moving && [fxJetpack,fxBubbles][area==2||area==4||distortion&&distrow<py-sy*8?1:0](px-sx*8,py-sy*8);

        DrawSprite(player[suitLevel], px-sx*8, py-sy*8, 0, !pf, playerFlicker);
        playerFlicker && playerFlicker--;
    } else {
        // If the player is dead, we wait a bit and respawn by 
        // reloading the window.
        if(globalclock % 50 === 49) {
            window.location = window.location;
        }
    }

    // ibuffer is unused - this was used in the original water distortion effect
    // code, which is still visible (Commented out) below.
    let ibuffer = context.getImageData(...canvasDimensions);

    // The water distortion code
    cbuffercontext.clearRect(...canvasDimensions);
    let msin = Math.sin(sintimer*2)*2,
        mcos = Math.cos(sintimer*2)*2,
        // Screenshake calculations
        xoff = screenShake?screenShake*globalclock%2==0?msin*screenShake*-1:msin*screenShake*1:0,
        yoff = screenShake?screenShake*globalclock%2==0?mcos*screenShake*-1:mcos*screenShake*1:0
    cbuffercontext.drawImage(canvas,0,0);
    //context.putImageData(ibuffer,screenShake*globalclock%2==0?msin*screenShake*-1:msin*screenShake*1,screenShake*globalclock%2==0?mcos*screenShake*-1:mcos*screenShake*1);
    for(let row = distrow; row < 128; row++) {
        // Water Distortion Effect
        let p = distortion ? round(Math.sin(sintimer*2+row*1280)) : 0, ap = abs(p) * 4;
        cbuffercontext.clearRect(0,row,128,1);
        cbuffercontext.drawImage(canvas,0,row,128,1,p>0?-1:p<0?0:-1,row,128,1);
        //context.clearRect(0,row,128,1);
        //context.drawImage(cbuffer,0,row,128,1,0,row,128,1);
        //for(i = 0; i<128-ap; i++) {
        //    let idex = (row*512)+(i*4);
        //    for(j = 0; j<3; j++) ibuffer.data[idex+j] = ibuffer.data[idex+ap+j];
        //    ibuffer.data[idex+3] = 0xFF;
        //}
    }
    context.clearRect(...canvasDimensions);
    context.drawImage(cbuffer,xoff-1,yoff);
    screenShake && screenShake--;

    sintimer += 0.05;

    // Draw player health bar

    DrawSprite(sprHPBarHP, 0, 120);

    for(let i = 0; i < floor(playerHealth); i++) {
        DrawSprite(sprHPBarPip[0], 14+(i*2), 120);
    }

    // Draw boss health bar
    if(active_boss) {
        for(i=active_boss.hp;i--;) DrawSprite(sprHPBarPip[3],103-(2*(i-1)),120,0,1)
        DrawSprite(sprHPBarEnm, 112, 120)
        //DrawSprite(sprHPBarCap, 112, 120, 0, true)
    }

    if(touchedSave) {
        touchedSave--;
        DrawSprite(sprSaveNotice, 52, 60);
    }

    enemyCounter++;

    requestAnimationFrame(main);

    fastclock++;
    while(fastclock>5) {globalclock++;fastclock-=5;}
};

