import {Sprite} from 'kontra';
export interface IGameObject {
    sprite: Sprite;
    render: () => void;
    update: (dt?: number) => void;
    trackObject: () => void;
    untrackObject: () => void;
}