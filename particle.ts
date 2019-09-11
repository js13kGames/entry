import {Sprite} from 'kontra';
import { IGameObject } from './gameObject';
export class Particle implements IGameObject{
    sprite: Sprite;
    canvasHeight: number;
    canvasWidth: number;
    direction: number;
    constructor(x: number, y: number, color: string, canvasHeight: number, canvasWidth: number) {
        this.canvasHeight = canvasHeight;
        const dx = 4 - Math.random() * 8;
        const dy = 1 - Math.random() * 2;
        const ddx = 0;
        const ddy = 1 - Math.random() * 2;
        this.direction = Math.sign(dx);
        this.sprite = Sprite({
            x: x,
            y: y,
            color: color,
            radius: 5,
            dx: dx,
            dy: dy,
            ddy: ddy,
            ddx: ddx,
            render: function () {
                this.context.fillStyle = this.color;
                this.context.beginPath();
                this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                this.context.fill();
            }
        });
        this.sprite.type = 'Particle';
    }
    render(){
        this.sprite.render();
    }
    update(dt?: number) {
        this.sprite.update();
        if (this.sprite.ddy === 0) {
            
        } else if (this.sprite.ddy < 1) {
            this.sprite.ddy += 0.1;
        }
        if ((this.sprite.y + this.sprite.radius * 2) >= this.canvasHeight && this.direction > 0) {
            this.sprite.ddx -= 0.001;
            if (this.sprite.dx <= 0){
                this.sprite.dx = 0;
                this.sprite.ddx = 0;
            }
        } else if ((this.sprite.y + this.sprite.radius*2) >= this.canvasHeight && this.direction < 0) {
            this.sprite.ddx += 0.001;
            if (this.sprite.dx >= 0) {
                this.sprite.dx = 0;
                this.sprite.ddx = 0;
            }
        }

        if (this.sprite.y >= this.canvasHeight) {
            this.sprite.ddy = 0;
            this.sprite.dy = 0;
            this.sprite.y = this.canvasHeight - this.sprite.radius;
        }
        if (this.sprite.x <= 0 || this.sprite.x >= this.canvasWidth) {
            this.direction = -1 * this.direction;
        }
    }
    trackObject(){

    }
    untrackObject(){

    }
}