import { init, GameLoop, initPointer, on, Sprite, emit, track, pointerPressed} from 'kontra';
import {Circle} from './circle';
import { IGameObject } from './gameObject';
import { GameEvent, GameEventData } from './gameEvent';

export class Game {
    gameObjects: IGameObject[] = [];
    gameCanvas;
    currentLevel = 1;
    currentHeighScore = 1;
    creatingGameInterval = null;
    canvasSprite;
    hiScoreEl: HTMLElement;
    modalEl: HTMLElement;
    loop;
    constructor() {
        const { canvas, context } = init('game');
        this.hiScoreEl = document.getElementById('highscore');
        this.modalEl = document.getElementById('modal');
        this.gameCanvas = canvas;
        this.gameObjects = [];
        initPointer();
        this.createLevel(this.currentLevel);
        this.loop = GameLoop({ 
            update: this.update,
            render: this.render,
        });
        this.createCanvasSprite();
        this.loop.start();
        this.onGameObjectKill();
    }
    render = () => {
        this.canvasSprite.render();
        this.gameObjects.forEach(go => {
            go.render();
        });
    }
    update = (dt: number) => {
        if(!this.creatingGameInterval) {
            this.canvasSprite.color = "rgba(0,0,0,0)"
        } else {
            this.canvasSprite.color = "rgba(125,125,125,0.5)"
        }
        this.canvasSprite.update();
        this.gameObjects.forEach(go => {
            go.update();
        });
    }
    onGameObjectKill() {
        on(GameEvent.KILL, (event: GameEventData) => {
            const index = this.gameObjects.findIndex((go) => go === event.gameObject);
            if (index >= 0) {
                if(index < this.gameObjects.length - 1) {
                    // GAME OVER
                    this.currentLevel = 0;
                    this.gameObjects = [];
                    this.createMessage('GAME OVER. NEW GAME STARTED');
                } else {
                    // correct circle killed
                    let killed: IGameObject = this.gameObjects.splice(index,1)[0];
                    emit(GameEvent.KILL_ANIMATION, { gameObject: event.gameObject});
                    killed = null; // remove from memory
                }
                if(this.gameObjects.length === 0) {
                    // CREATE NEXT LEVEL
                    this.createLevel(++this.currentLevel);
                    if (this.currentLevel > this.currentHeighScore) {
                        this.currentHeighScore = this.currentLevel;
                        const currentHeighScoreText = document.createTextNode('' + this.currentHeighScore);
                        this.hiScoreEl.replaceChild(currentHeighScoreText, this.hiScoreEl.childNodes[0]);

                    }
                }
            }
        });
    }
    createLevel(level: number){
        this.createGameObject(level);
        if (this.gameObjects.length < level) {
            this.creatingGameInterval = setInterval( () => {
                this.createGameObject(level);
            },1000);
        }
        
    }
    createGameObject (level: number) {
        const maxX = Math.random() * this.gameCanvas.width;
        const maxY = Math.random() * this.gameCanvas.height;
        const randomHex = this.createRandomHexColor();
        this.gameObjects.push(new Circle(randomHex, 20, maxX, maxY));
        if (this.gameObjects.length === level) {
            clearInterval(this.creatingGameInterval);
            this.creatingGameInterval = null;
            this.gameObjects.forEach(go => go.trackObject())
        }
    }
    createRandomHexColor (){
        let color="#";
        const hexValues = '0123456789ABCDEF';
        for (let i = 0; i < 6; i++) {
            color += hexValues[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    createCanvasSprite(){
        this.canvasSprite = Sprite({
            x: 0,
            y: 0,
            width: this.gameCanvas.width,
            height: this.gameCanvas.height,
            color: "rgba(125,125,125,0.2)",
            onDown: this.onCanvasDown,
        });
        track(this.canvasSprite);
    }
    onCanvasDown = (pointer) => {
        if(this.creatingGameInterval) {
            this.createMessage('Initializing game. Wait until gray background vanish');
        }
    }

    createMessage(msg: string){
        const modalChild = this.modalEl.childNodes[0];
        this.modalEl.classList.add('open');
        this.modalEl.classList.remove('close');
        this.modalEl.replaceChild(document.createTextNode(msg), modalChild);
        setTimeout(() => {
            const modalChild = this.modalEl.childNodes[0];
            this.modalEl.replaceChild(document.createTextNode(''), modalChild);
            this.modalEl.classList.remove('open');
            this.modalEl.classList.add('close');
        }, 2000);
    }
}