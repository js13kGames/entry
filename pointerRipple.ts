import { Sprite } from 'kontra';
import { IGameObject } from './gameObject';
export class PointerRipple implements IGameObject {
    sprite: Sprite;
    sprite2: Sprite;
    radius = 10;
    constructor(x, y) {
        
        this.sprite = Sprite({
            x: x,
            y: y,
            color: 'rgba(123,0,123,0.1)',
            radius: this.radius,
            render: function () {
                this.context.fillStyle = this.color;
                this.context.beginPath();
                this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                this.context.fill();
            },
            update: function () {
                if(this.radius < 30) {
                    this.radius += 1;
                } else {
                    this.radius = 0;
                }
            }
        });
        this.sprite2 = Sprite({
            x: x,
            y: y,
            color: 'rgba(255,255,255,1)',
            radius: this.radius - 5,
            render: function () {
                this.context.fillStyle = this.color;
                this.context.beginPath();
                this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                this.context.fill();
            },
            update: function () {
                if (this.radius < 20) {
                    this.radius += 1;
                } else {
                    this.radius = 0;
                }
            }
        });
    }
    update() {
        this.sprite.update();
        this.sprite2.update();
    }
    render() {
        this.sprite.render();
        this.sprite2.render();
    }
    trackObject() {
    }
    untrackObject() {
    }
}
