
/**
 * 1 - estrutura
 * 2 - inimigo
 * 
 */

function criaEstrutura(x, y, h, w, hp = 20) {
    return Sprite({tipo: 1, hp, x: x * w, y: y * h, image: imageAssets['assets/predio']});
}

function criaInimigo(x, y, h, w,  hp = 100, atk = 0, i) {
    return Sprite({tipo: 2, hp, x: x * w, y: y * h, w, h, atk, image: imageAssets['assets/enemy'],
        moving: false,
        index: i,
        dead: false,
        update() {
          if (playerTurn || actualEnTurn != this.index)
            return;

          if (this.dead && this.index == actualEnTurn)
            this.avancaEnemiTurn();

          if (this.moving) {
            this.smothMove();
            return;
          }

          let bkpX = this.x;
          let bkpY = this.y;
          this.dy = this.dx = 0;
          
          if (Math.abs(player.x - this.x) < Number.EPSILON) {
            if (player.y > this.y) {
              this.y +=  this.h;
              this.dy = 1
            } else {
              this.y -= this.h;
              this.dy = -1
            }
          } else {
            if (player.x > this.x) {
              this.x += this.w;
              this.dx = 1;
            } else {
              this.x -= this.w;
              this.dx = -1;
            }
          }
          
          if (!this.canMove()) {
            this.x = bkpX;
            this.y = bkpY;
            this.avancaEnemiTurn();
            return;
          }
          
          this.fx = this.x;
          this.fy = this.y;

          this.x = bkpX;
          this.y = bkpY;

          this.moving = true;
        },
        smothMove() {
          this.x += this.dx * 2;
          this.y += this.dy * 2;
          
          if (this.x == this.fx && this.y == this.fy) {
            this.moving = false;
            this.dx = this.dy = 0;
            this.avancaEnemiTurn();
          }
        },
        avancaEnemiTurn() {
          actualEnTurn++;

          if (actualEnTurn >= enemies) {
            playerTurn = true;
            actualEnTurn = 0;
          }
        },
        canMove() {
          for(let i = 0; i < scene.sprites.length; i++) {
            let obj = scene.sprites;
            if (this != obj[i] && this.collidesWith(obj[i]))
              return false;
          }

          if (this.collidesWith(player)) {
            //TODO: atk animation
            player.hp -= Math.max(0, this.atk - player.getDef());
            if (player.hp <= 0) {
              alert('end');
              //TODO: gameover
            }
            return false;
          }

          return true;
        }
    });
}

function desenhaHUD(player, canvas) {
    return Sprite({
      render() {
            let ctx = this.context;
            
            ctx.beginPath();
            ctx.strokeStyle = "black"; // Green path
            ctx.moveTo(1, canvas.height - 15);
            ctx.lineTo(150, canvas.height - 15);
            ctx.lineTo(130, canvas.height - 5);
            ctx.lineTo(1, canvas.height - 5);
            ctx.lineTo(1, canvas.height - 15);
            ctx.stroke();
            ctx.closePath();

            let p = player.hp * 150 / player.maxHp;
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.moveTo(1, canvas.height - 15);
            ctx.lineTo(p, canvas.height - 15);
            ctx.lineTo(Math.max(p - 20, 1), canvas.height - 5);
            ctx.lineTo(1, canvas.height - 5);
            ctx.lineTo(1, canvas.height - 15);
            ctx.fill();
            ctx.closePath();

            ctx.font = "15px Arial";
            ctx.fillStyle = 'white';
            ctx.fillText("HP", 3, canvas.height - 20);
            ctx.fillText('Level ' + nivel, canvas.width - 70, canvas.height - 20);
        }
    });
}