import {Sprite} from 'kontra';
export interface IGameObject {
    sprite: Sprite;
    render: () => void;
    update: () => void;
    trackObject: () => void;
}