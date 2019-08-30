import { Sprite, initPointer, track, Pool, GameLoop} from 'kontra';
import {IGameObject} from './gameObject';
import { on, off, emit } from 'kontra';
import { GameEvent, GameEventData } from './gameEvent';
import { Particle } from './particle';
export class Circle implements IGameObject {
    sprite: Sprite;
    constructor(color: string, radius: number, x: number, y:number){
        this.sprite = Sprite({
            x: x,
            y: y,
            color: color,
            radius: radius,
            render: function () {
                this.context.fillStyle = this.color;
                this.context.beginPath();
                this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                this.context.fill();
            },
            collidesWithPointer: function (pointer) {
                // perform a circle v circle collision test
                let dx = pointer.x - this.x;
                let dy = pointer.y - this.y;
                return Math.sqrt(dx * dx + dy * dy) < this.radius;
            },
            onDown: this.onDown,
        });
    }
    onDown = () => {
        emit(GameEvent.KILL, { gameObject: this });
    }
    update() {
        this.sprite.update();
    }
    render(){
        this.sprite.render();
    }
    trackObject(){
        track(this.sprite);
    }
}
