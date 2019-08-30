import { IGameObject } from "./gameObject";

export const GameEvent = {
    KILL: 1,
    KILL_ANIMATION: 2
}
export interface GameEventData {
    gameObject: IGameObject;
}
Object.freeze(GameEvent); // mutate object