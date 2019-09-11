import { Sprite } from 'kontra';
import { IGameObject } from './gameObject';
export class DeathScreen implements IGameObject {
    sprite: Sprite;
    timePassed = 0;
    constructor(width: number, height: number) {
        this.sprite = Sprite({
            x: 0,
            y: 0,
            color: 'red',
            width: width,
            height: height
        });
    }
    update(dt) {
        this.timePassed += dt;
        if( this.timePassed > 0.2 ) {
            this.sprite.width = 0;
            this.sprite.height = 0;
        }
        this.sprite.update();
    }
    render() {
        this.sprite.render();
    }
    trackObject() {
    }
    untrackObject() {
    }
}
