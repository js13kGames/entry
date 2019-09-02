(function() {
  /* Limit degrees between 0 and 360. */
  function normalizeDegs(degs) {
    let normalized = degs % 360;

    if (normalized < 0) {
      normalized += 360;
    }

    return normalized;
  }

  /* Circle vs circle collision detection */
  function circleCollision(a, b) {
    return (b.x - a.x) * (b.x - a.x) + (a.y-b.y) * (a.y-b.y) <= (a.r + b.r) * (a.r + b.r);
  }

  /**
  ** The game component.
  **
  ** Handles all the game logic.
  **/
  AFRAME.registerComponent('dont-look-back', {
    schema: {default: ''},
    
    // Game map generated on each level
    map: {
      data: [],
      startHeight: 3, // start map height in tiles.
      width: 3, // map width in tiles.
      tileSize: 3, // tile size in meters

      // Get the map height in tiles for each level
      getHeight: function(level) {
        return this.startHeight + (level * 3);
      },

      // Get a tile given a col and a row
      getTile: function(col, row) {
        return this.data[row * this.width + col]
      }
    },

    level: 1,
    gotKeys: false, // wether player al ready picked up keys for this level
    dead: true, // wether player still alive
    winLevel: false, //wether player won or loose this level

    // Transition between level and game over room.
    transitionScreenDur: 2000, // Transition duration in ms.
    transitionScreenTimer: 0, // Elapsed time since transition started.

    // Position of the game over room. 
    gameOverRoomPosition: {
        x: -500,
        y: -500,
        z: -500
    },

    // radius of each entity for collision detection.
    entityRadius: {
        player: 0.5,
        enemy: 1.4,
        key: 0.3
    },

    inGameOverRoom: true, // wether player is in game over room or not.

    tips: [
      'Never look them at their eyes.',
      'Don\'t touch them.',
      'The key is cursed.',
      'Here rest an evil spirit.',
      'Stay away when the curse is actived.',
      'Nobody can leave this place'
    ],

    nextLevel: function() {
      this.level++;
    },

    // Make the game over room visible and move the player there.
    renderGameOverRoom: function() {
      this.inGameOverRoom = true;
      this.textLevelEndEl.setAttribute('visible', false);
      this.textLevelEndSubEl.setAttribute('visible', false);
      this.cursor.setAttribute('visible', true);
      this.startButton.classList.add('button');
      this.gameOverRoom.setAttribute('visible', true);
      this.player.object3D.position.set(
        this.gameOverRoomPosition.x,
        this.gameOverRoomPosition.y,
        this.gameOverRoomPosition.z
      );
      this.textLevel.setAttribute('text', 'value', 'Level ' + this.level);
    },

    /**
     * Die
     *
     * @param {string} method - the method of death.
    **/
    gameOver: function(method) {
      this.dead = true;
      this.level = 1;

      // Display game over text
      this.textLevelEndEl.setAttribute('visible', true);
      this.textLevelEndEl.setAttribute('text', 'value', 'GAME OVER');

      // Method of death text.
      let textSub;

      switch (method) {
        case 'fall':
          textSub = 'You fell to hell.';
          break;
        case 'touch':
          textSub = 'A demon caught you.';
          break;
        case 'look':
          textSub = 'The demons looked you at your eyes.'
          break;
      }

      /**
       * When player dies by look rotate de player to point back.
       * If the player current Y rotation is more than 0 and less
       * than 180 rotate to 180. Otherwise rotate -180.
      **/
      if (method === 'look') {
        // player current Y rotation value
        const playerCurrentRotationY = normalizeDegs(THREE.Math.radToDeg(this.player.object3D.rotation._y));

        // Quantity of degrees to rotate in Y.
        const rotateY = playerCurrentRotationY > 0 && playerCurrentRotationY < 180 ? 180 : -180;

        // Setup player's rotation animation.
        this.player.setAttribute('animation', `property: rotation; to: 0 ${rotateY} 0; startEvents: rotate;`);
        this.player.emit('rotate');

        /**
         * @todo disable look-controls without canceling rotate animation.
        **/
      }

      // Display method of death message.
      this.textLevelEndSubEl.setAttribute('visible', true);
      this.textLevelEndSubEl.setAttribute('text', 'value', textSub);

      // Disable movement controls.
      this.player.setAttribute('wasd-controls', 'enabled: false'); 
    },

    /**
     * Start new level
     *
     * Move the player to the game map and initialize a new level.
    **/
    start: function() {
      this.inGameOverRoom = false;
      this.dead = false;
      this.winLevel = false;

      this.gotKeys = false;
      this.keyEl.setAttribute('visible', true);
      this.textKeyEl.setAttribute('visible', false);

      this.generateMap();
      this.renderMap();
      this.player.object3D.position.set(
        this.playerMapPosition.x,
        this.playerMapPosition.y,
        this.playerMapPosition.z
      );

      this.gameOverRoom.setAttribute('visible', false);
      this.startButton.classList.remove('button');

      this.cursor.setAttribute('visible', false);

      this.player.setAttribute('wasd-controls', 'enabled: true'); 
      this.player.setAttribute('look-controls', 'enabled: true'); 
    },

    /**
     * Generate new random map.
     *
     * Basically, picks a random column for each row and place an obstacle
     * in there leaving an empty row every 3 rows to ensure the player
     * doesn't get stuck.
    **/
    generateMap: function() {
      const cols = 3;

      // number of rows for current level.
      const rows = this.map.getHeight(this.level);

      // initialize the map array
      const m = new Array(cols * rows);

      /**
       * Keep track of used columns.
       * Decrease the counter each iteration a column wasn't used.
       * When counter gets to 0 for a column is time to be used.
      **/
      const colCount = [3, 3, 3];

      // max number consecutive rows with obstacles.
      const maxAccumulator = 2;

      // consecutive rows used.
      let accumulator = 0;

      for (var i =  0; i < rows; i++) {
        // Skip the first and last rows.
        if (i === 0 || i === rows - 1) continue;

        accumulator++;

        // Skip if hit the accumulator limit.
        if (accumulator > maxAccumulator) {
          accumulator = 0;
          continue;
        } else {
          const emptyCol = colCount.indexOf(0);
          let trapColPos;

          // Check if is time to force a column
          if (emptyCol > -1) {
            trapColPos = emptyCol;
            colCount[emptyCol] = 3;
          } else {
            // Place obstacle in random column
            trapColPos = Math.floor(Math.random() * 3);
          }

          /* decrease the counter for each column except for the one
          used in this iteration */
          for (let j = colCount.length - 1; j >= 0; j--) {
            if (j !== trapColPos) {
                colCount[j]--
            }
          }

          m[i * cols + trapColPos] = 2;
        }
      }

      // place the key
      m[1] = 5;

      // place the player
      m[m.length - 2] = 4;

      this.map.data = m;
    },

    /**
     * Render Map.
    **/
    renderMap: function() {
      let dead;
      let trap;

      // Set map width and height according to current level.
      this.ground.setAttribute('geometry', 'width', this.map.tileSize * this.map.width);
      this.ground.setAttribute('geometry', 'height', this.map.tileSize * this.map.getHeight(this.level));

      // Remove all traps an deads from last level.
      while (this.trapsEl.hasChildNodes()) {
        this.trapsEl.removeChild(this.trapsEl.lastChild);
      }

      while (this.deadsEl.hasChildNodes()) {
        this.deadsEl.removeChild(this.deadsEl.lastChild);
      }

      // Loop through all columns
      for (let x = 0; x < this.map.width; x++)  {
        // x = current column.

        // Loop through all rows
        for (let y = 0; y < this.map.getHeight(this.level); y++) {
          // y = current row.

          /**
           * Current tile value.
           *
           * 2 = trap and dead.
           * 4 = player and exit door.
           * 5 = key.
          **/
          let tile =  this.map.getTile(x, y);

          // current tile position in meters.
          let posX = ((x-this.map.width/2)*this.map.tileSize) + (this.map.tileSize/2);
          let posY = 1.6; // m.
          let posZ = ((y-this.map.getHeight(this.level)/2)*this.map.tileSize) + (this.map.tileSize/2);

          if (tile === 2) {
            // set tarps and deads.
            trap = document.createElement('a-plane');
            this.trapsEl.appendChild(trap);
            trap.setAttribute('color', '#040F16');
            trap.setAttribute('width', this.map.tileSize);
            trap.setAttribute('height', this.map.tileSize);
            trap.setAttribute('rotation', '-90 0 0');
            trap.object3D.position.set(posX, 0.01, posZ);
            trap.setAttribute('text', 'align: center; anchor: center; color: #FBFBFF; value: ' + this.tips[Math.floor(Math.random() * this.tips.length)]);

            dead = document.createElement('a-plane');
            this.deadsEl.appendChild(dead);
            dead.setAttribute('material', 'src: #sprite-redead; transparent: true; side: double');
            dead.setAttribute('width', 0.57);
            dead.setAttribute('height', 1.5);

            // the deads starts under ground.
            dead.object3D.position.set(posX, -1, posZ);
          }

          if (tile === 4)  {
            // Set player position
            this.playerMapPosition = {
              x: posX,
              y: posY,
              z: posZ
            }

            // exit door
            this.exitDoor.setAttribute('geometry', 'width', this.map.tileSize);
            this.exitDoor.setAttribute('geometry', 'height', this.map.tileSize);
            this.exitDoor.object3D.position.set(posX, 0.01, posZ);
          }

          if (tile === 5) {
            // place key
            this.keyEl.object3D.position.set(posX, 1.2, posZ);
            this.keyEl.setAttribute('visible', true);

            // Key text
            this.textKeyEl.object3D.position.set(posX, 1.5, posZ - 2.5);
          }
        }
      }
    },

    /**
     * Initialize game.
    **/
    init: function() {
      const _self = this;

      // Set the game properties.
      this.ground = document.getElementById('ground');

      this.player = document.getElementById('player');
      this.player.setAttribute('rotation-reader', '');
      this.player.setAttribute('universal-controls', '');

      this.cursor = document.getElementById('cursor');

      this.gameOverRoom = document.getElementById('gameoverbox');
      this.gameOverRoom.object3D.position.set(
        this.gameOverRoomPosition.x,
        this.gameOverRoomPosition.y,
        this.gameOverRoomPosition.z
      );
      this.startButton = document.getElementById('start-button');
      this.startButton.classList.add('button');
      this.startButton.addEventListener('click', function(e) {
        _self.start();
      })

      this.camera = document.getElementById('camera');

      this.trapsEl = document.getElementById('traps');
      this.keyEl = document.getElementById('key');
      this.deadsEl = document.getElementById('deads');
      this.exitDoor = document.getElementById('exitdoor');
      
      this.textLevel = document.getElementById('text-level');
      this.textKeyEl = document.getElementById('text-key');
      this.textLevelEndEl = document.getElementById('text-levelend');
      this.textLevelEndSubEl = document.getElementById('text-levelend-sub');

      this.loaded = true;

      // Start the game in the game over room.
      this.renderGameOverRoom();
    },

    /**
     * Component Tick function.
     *
     * Called on every frame. Handles the game dynamics.
     *
     * @param {Number} time - time elapsed since component initialized.
     * @param {Number} dt - Delta time (time elapsed since last frame).
    **/
    tick: function(time, dt) {
      // Exit if game is not loaded.
      if (!this.loaded) return;

      // if player is dead or just won the level set the transition screen
      if (this.dead || this.winLevel) {
        this.transitionScreenTimer += dt;

        // Check if is time to exit the transition screen.
        if (this.transitionScreenTimer >= this.transitionScreenDur) {
          this.transitionScreenTimer = 0;

          // move to game over room.
          if (!this.inGameOverRoom) this.renderGameOverRoom();
        }

        return;
      }

      this.transitionScreenTimer = 0;

      // get player position and tile coords
      const playerPos = this.player.getAttribute('position');
      const playerTileX = Math.floor((playerPos.x/this.map.tileSize) + (this.map.width/2));
      const playerTileZ = Math.floor((playerPos.z/this.map.tileSize) + (this.map.getHeight(this.level)/2));

      // Fall if player is out of map limits 
      if (playerTileX < 0 || playerTileX > this.map.width -1 ||
        playerTileZ < 0 || playerTileZ > this.map.getHeight(this.level) -1
      ) {
        this.player.object3D.position.set(playerPos.x, playerPos.y - (0.005 * dt), playerPos.z);

        if (playerPos.y < -5) {
            this.gameOver('fall');
        }
      }

      const keyPos = this.keyEl.getAttribute('position');

      // If player got the keys.
      if (this.gotKeys) {
        const rotationY = normalizeDegs(THREE.Math.radToDeg(this.player.object3D.rotation._y));
        const playerTileX = Math.floor((playerPos.x/this.map.tileSize) + (this.map.width/2));
        const playerTileZ = Math.floor((playerPos.z/this.map.tileSize) + (this.map.getHeight(this.level)/2));

        // Die if looking back.
        if (rotationY > 120 && rotationY < 240) {
          this.gameOver('look');
        }

        // Check for collision with deads.
        for (let i = this.deadsEl.childNodes.length - 1; i >= 0; i--) {
          const deadPos = this.deadsEl.childNodes[i].getAttribute('position');

          if (circleCollision(
              {
                x: playerPos.x,
                y: playerPos.z,
                r: this.entityRadius.player
              },
              {
                x: deadPos.x,
                y: deadPos.z,
                r: this.entityRadius.enemy
              }
          )) {
            // Death by touching a dead.
            this.gameOver('touch');
            return;
          }
        }

        // exit level if player is in exit door
        if (this.map.getTile(playerTileX, playerTileZ) === 4) {
          this.winLevel = true;
          this.textLevelEndEl.setAttribute('visible', true);
          this.textLevelEndEl.setAttribute('text', 'value', 'NEXT LEVEL');
          this.nextLevel();
        }
      } else {
        // If player doen't have the keys
        // check for collision with keys
        if (circleCollision(
          {
            x: playerPos.x,
            y: playerPos.z,
            r: this.entityRadius.player
          },
          {
            x: keyPos.x,
            y: keyPos.z,
            r: this.entityRadius.key
          }
        )) {
          // pick up keys.
          this.gotKeys = true;

          //remove key from scene
          this.keyEl.setAttribute('visible', false);
          this.textKeyEl.setAttribute('visible', true);

          // Rise the deaths.
          for (let i = this.deadsEl.childNodes.length - 1; i >= 0; i--) {
            const deadEl = this.deadsEl.childNodes[i];

            deadEl.object3D.position.y = 1;
          }

          // Hide tarp's texts.
          for (let i = this.trapsEl.childNodes.length - 1; i >= 0; i--) {
            const trapEl = this.trapsEl.childNodes[i];

            trapEl.setAttribute('text', 'value', '');
          }
        }
      }
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Init the game component.
    document.querySelector('a-scene').setAttribute('dont-look-back', '');
  })
})();
