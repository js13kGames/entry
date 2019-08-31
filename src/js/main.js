(function() {
  function normalizeDegs(degs) {
      let normalized = degs % 360;

      if (normalized < 0) {
          normalized += 360;
      }

      return normalized;
  }

  function circleCollision(a, b) {
      return (b.x - a.x) * (b.x - a.x) + (a.y-b.y) * (a.y-b.y) <= (a.r + b.r) * (a.r + b.r);
  }

  AFRAME.registerComponent('dont-look-back', {
      schema: {default: ''},
      
      map: {
          data: [],
          startHeight: 5,
          width: 3,
          height: 10,
          tileSize: 3,
          getHeight: function(level) {
              return this.startHeight + (level * 5);
          },
          getTile: function(col, row) {
              return this.data[row * this.width + col]
          }
      },

      level: 1,
      gotKeys: false,
      dead: true,
      winLevel: false,
      transitionScreenDur: 2000,
      transitionScreenTimer: 0,
      gameOverRoomPosition: {
          x: -500,
          y: -500,
          z: -500
      },
      entityRadius: {
          player: 0.5,
          enemy: 1.4,
          key: 0.3
      },
      inGameOverRoom: true,

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

      gameOver: function(method) {
          this.dead = true;
          this.textLevelEndEl.setAttribute('visible', true);
          this.textLevelEndEl.setAttribute('text', 'value', 'GAME OVER');

          let textSub = 'You fell to hell.';

          if (method !== 'fall') {
              textSub = 'A demon caught you.';

              if (method === 'look') {
                  textSub = 'The demons looked you at your eyes.';
                  const playerCurrentRotationY = normalizeDegs(THREE.Math.radToDeg(this.player.object3D.rotation._y));
                  const rotateY = playerCurrentRotationY > 0 && playerCurrentRotationY < 180 ? 180 : -180;
                  this.player.setAttribute('animation', `property: rotation; to: 0 ${rotateY} 0; startEvents: rotate;`)
                  this.player.emit('rotate');
              }
          }

          this.textLevelEndSubEl.setAttribute('visible', true);
          this.textLevelEndSubEl.setAttribute('text', 'value', textSub);

          this.player.setAttribute('wasd-controls', 'enabled: false'); 
      },

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

      generateMap: function() {
          const cols = 3;
          const rows = this.map.getHeight(this.level);
          // initialize the map array
          const m = new Array(cols * rows);
          const colCount = [3, 3, 3];
          const maxAccumulator = 2;
          let accumulator = 0;

          for (var i =  0; i < rows; i++) {
              if (i === 0 || i === rows - 1) continue;

              accumulator++;

              if (accumulator > maxAccumulator) {
                  accumulator = 0;
                  continue;
              } else {
                  const emptyCol = colCount.indexOf(0);
                  let trapColPos;

                  if (emptyCol > -1) {
                      trapColPos = emptyCol;
                      colCount[emptyCol] = 3;
                  } else {
                      trapColPos = Math.floor(Math.random() * 3);
                  }

                  for (let j = colCount.length - 1; j >= 0; j--) {
                      if (j !== trapColPos) {
                          colCount[j]--
                      }
                  }

                  m[i * cols + trapColPos] = 2;
              }
          }

          m[1] = 5;
          m[m.length - 2] = 4;

          this.map.data = m;
      },

      renderMap: function() {
          let dead;
          let wall;
          let trap;

          this.ground.setAttribute('geometry', 'width', this.map.tileSize * this.map.width);
          this.ground.setAttribute('geometry', 'height', this.map.tileSize * this.map.getHeight(this.level));

          while (this.trapsEl.hasChildNodes()) {
              this.trapsEl.removeChild(this.trapsEl.lastChild);
          }

          while (this.deadsEl.hasChildNodes()) {
              this.deadsEl.removeChild(this.deadsEl.lastChild);
          }

          for (var x = 0; x < this.map.width; x++)  {
              for (var y = 0; y < this.map.getHeight(this.level); y++) {
                  var tile =  this.map.getTile(x, y);
                  var posX = ((x-this.map.width/2)*this.map.tileSize) + (this.map.tileSize/2);
                  var posY = 1.6;
                  var posZ = ((y-this.map.getHeight(this.level)/2)*this.map.tileSize) + (this.map.tileSize/2);

                  if (tile === 2) {
                      // redead
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
                      dead.object3D.position.set(posX, -1, posZ)
                  }

                  if (tile === 4)  {
                      // Set player position
                      this.playerMapPosition = {
                          x: posX,
                          y: posY,
                          z: posZ
                      }
                      this.exitDoor.setAttribute('geometry', 'width', this.map.tileSize);
                      this.exitDoor.setAttribute('geometry', 'height', this.map.tileSize);
                      this.exitDoor.object3D.position.set(posX, 0.01, posZ)
                  }

                  if (tile === 5) {
                      // place key
                      this.keyEl.object3D.position.set(posX, 1.2, posZ);
                      this.keyEl.setAttribute('visible', true);

                      this.textKeyEl.object3D.position.set(posX, 1.5, posZ - 2.5);
                  }
              }
          }
      },

      init: function() {
          const _self = this;

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

          this.wallsEl = document.getElementById('walls');
          this.trapsEl = document.getElementById('traps');
          this.keyEl = document.getElementById('key');
          this.deadsEl = document.getElementById('deads');
          this.exitDoor = document.getElementById('exitdoor');
          
          this.textLevel = document.getElementById('text-level');
          this.textKeyEl = document.getElementById('text-key');
          this.textLevelEndEl = document.getElementById('text-levelend');
          this.textLevelEndSubEl = document.getElementById('text-levelend-sub');

          this.loaded = true;

          this.renderGameOverRoom();
      },

      tick: function(time, dt) {
          if (!this.loaded) return;

          if (this.dead || this.winLevel) {
              this.transitionScreenTimer += dt;

              if (this.transitionScreenTimer >= this.transitionScreenDur) {
                  this.transitionScreenTimer = 0;

                  if (!this.inGameOverRoom) this.renderGameOverRoom();
              }

              return;
          }

          this.transitionScreenTimer = 0;

          const playerPos = this.player.getAttribute('position');
          const playerTileX = Math.floor((playerPos.x/this.map.tileSize) + (this.map.width/2));
          const playerTileZ = Math.floor((playerPos.z/this.map.tileSize) + (this.map.getHeight(this.level)/2));

          if (playerTileX < 0 || playerTileX > this.map.width -1 ||
              playerTileZ < 0 || playerTileZ > this.map.getHeight(this.level) -1
          ) {
              this.player.object3D.position.set(playerPos.x, playerPos.y - (0.005 * dt), playerPos.z);

              if (playerPos.y < -5) {
                  this.gameOver('fall');
              }
          }

          const keyPos = this.keyEl.getAttribute('position');

          if (this.gotKeys) {
              const rotationY = normalizeDegs(THREE.Math.radToDeg(this.player.object3D.rotation._y));
              const playerTileX = Math.floor((playerPos.x/this.map.tileSize) + (this.map.width/2));
              const playerTileZ = Math.floor((playerPos.z/this.map.tileSize) + (this.map.getHeight(this.level)/2));

              if (rotationY > 120 && rotationY < 240) {
                  this.gameOver('look');
              }

              for (var i = this.deadsEl.childNodes.length - 1; i >= 0; i--) {
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
                      this.gameOver('touch');
                      return;
                  }
              }

              if (this.map.getTile(playerTileX, playerTileZ) === 4) {
                  this.winLevel = true;
                  this.textLevelEndEl.setAttribute('visible', true);
                  this.textLevelEndEl.setAttribute('text', 'value', 'NEXT LEVEL');
                  this.nextLevel()
              }
          } else {
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
                  this.gotKeys = true;

                  //remove key from scene
                  this.keyEl.setAttribute('visible', false);
                  this.textKeyEl.setAttribute('visible', true);

                  for (var i = this.deadsEl.childNodes.length - 1; i >= 0; i--) {
                      const deadEl = this.deadsEl.childNodes[i];

                      deadEl.object3D.position.y = 1;
                  }

                  for (var i = this.trapsEl.childNodes.length - 1; i >= 0; i--) {
                      const trapEl = this.trapsEl.childNodes[i];

                      trapEl.setAttribute('text', 'value', '');
                  }
              }
          }
      }
  });

  document.addEventListener('DOMContentLoaded', function() {
      document.querySelector('a-scene').setAttribute('dont-look-back', '');
  })
})();
