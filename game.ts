import { init, GameLoop, initPointer, on, Sprite, emit, track, pointerPressed} from 'kontra';
import {Circle} from './circle';
import { IGameObject } from './gameObject';
import { GameEvent, GameEventData } from './gameEvent';
import { Note, Sequence } from 'tinymusic';
import {Audio} from './audio';
import { PointerRipple} from './pointerRipple';
import { DeathScreen } from './deathScreen';
export class Game {
    gameObjects: IGameObject[] = [];
    pointerRipples: PointerRipple[] = [];
    deathObjects: DeathScreen[] = [];
    gameCanvas;
    currentLevel = 1;
    currentHeighScore = 1;
    creatingGameInterval = null;
    canvasSprite;
    hiScoreEl: HTMLElement;
    modalEl: HTMLElement;
    loop;
    isSubscriber = false;
    audio: Audio;
    topGutter = 50; 
    creatingLevel = false;
    constructor() {
        this.audio = new Audio();
        const { canvas, context } = init('game');
        this.checkForSubscriber();
        this.hiScoreEl = document.getElementById('hiscore');
        this.modalEl = document.getElementById('modal');
        this.gameCanvas = canvas;
        this.initCanvasDimensions();
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
        if(localStorage.getItem('johnonym-hiscore')) {
            this.currentHeighScore = parseInt(localStorage.getItem('johnonym-hiscore'),10);
            const currentHeighScoreText = document.createTextNode('' + this.currentHeighScore);
            this.hiScoreEl.replaceChild(currentHeighScoreText, this.hiScoreEl.childNodes[0]);       
        }
    }
    render = () => {
        this.canvasSprite.render();
        this.gameObjects.forEach(go => {
            if(go) {
                go.render();
            }
        });
        this.pointerRipples.forEach(ripple => {
            if(ripple) {
                ripple.render();
            }
        });
        this.deathObjects.forEach(deathObject => {
            if (deathObject) {
                deathObject.render();
            }
        });
    }
    initCanvasDimensions(){
        let width = window.outerWidth;
        let height = window.outerHeight - this.topGutter;
        this.gameCanvas.width = width - 4; //minus border width
        this.gameCanvas.height = height - 4;
    }
    update = (dt: number) => {
        if(!this.creatingGameInterval) {
            this.canvasSprite.color = "rgba(255,255,255,1)"
        } else {
            this.canvasSprite.color = "rgba(125,125,125,0.5)"
        }
        this.canvasSprite.update();
        this.gameObjects.forEach(go => {
            go.update();
        });
        this.pointerRipples.forEach(ripple => {
            if (ripple) {
                ripple.update();
                if(ripple.sprite.radius === 0) {
                    const index = this.pointerRipples.findIndex( r => r === ripple);
                    if (index >= 0) this.pointerRipples.splice(index, 1);
                }
            }
        });
        this.deathObjects.forEach(deathObject => {
            if (deathObject) {
                deathObject.update(dt);
                if (deathObject.sprite.width === 0) {
                    const index = this.deathObjects.findIndex(r => deathObject === r);
                    if (index >= 0) this.deathObjects.splice(index, 1);
                }
            }
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
                    this.createMessage('GAME OVER. NEW GAME STARTING');
                    this.audio.resetSequence(this.audio.killSequence);
                    this.audio.playNextPitch(this.audio.gameOverSequence);
                    this.deathObjects.push(new DeathScreen(this.gameCanvas.width, this.gameCanvas.height));
                } else {
                    // correct circle killed
                    this.pointerRipples.push(new PointerRipple(event.gameObject.sprite.x, event.gameObject.sprite.y));
                    let killed: IGameObject = this.gameObjects.splice(index,1)[0];
                    emit(GameEvent.KILL_ANIMATION, { gameObject: event.gameObject});
                    killed = null; // remove from memory
                    this.audio.playNextPitch(this.audio.killSequence, 10);
                }
                if(this.gameObjects.length === 0) {
                    // CREATE NEXT LEVEL
                    this.createLevel(++this.currentLevel);
                    this.checkHiscore();
                    this.audio.resetSequence(this.audio.killSequence);
                }
            }
        });
    }
    checkHiscore(){
        if (this.currentLevel > this.currentHeighScore) {
            this.currentHeighScore = this.currentLevel;
            const currentHeighScoreText = document.createTextNode('' + this.currentHeighScore);
            this.hiScoreEl.replaceChild(currentHeighScoreText, this.hiScoreEl.childNodes[0]);
            this.audio.playNextPitch(this.audio.hiscoreSequence);
            this.createMessage('NEW HIGHSCORE!!')
            localStorage.setItem('johnonym-hiscore', ''+this.currentHeighScore);
        }
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
        this.gameObjects.push(new Circle(randomHex, 30, maxX, maxY));
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
        if(pointer && pointer instanceof TouchEvent) {
            pointer = <TouchEvent> pointer;
            this.pointerRipples.push(new PointerRipple(pointer.touches[0].clientX, pointer.touches[0].clientY - this.topGutter));
        } else {
            this.pointerRipples.push(new PointerRipple(pointer.x, pointer.y - this.topGutter));
        }
    }

    createMessage(msg: string){
        const modalChild = this.modalEl.childNodes[0];
        this.modalEl.classList.add('open');
        this.modalEl.classList.remove('close');
        this.modalEl.replaceChild(document.createTextNode(msg), modalChild);
        setTimeout(() => {
            const modalChild = this.modalEl.childNodes[0];
            this.modalEl.classList.remove('open');
            this.modalEl.classList.add('close');
        }, 3000);
    }
    restartLevel(event: any) {
        if (this.creatingGameInterval) {
            this.createMessage('Cannot reaply a level that is being created. Please wait until screen goes white');
        } else {
            this.gameObjects.forEach( go => go.untrackObject());
            const tmpGameObjects = [...this.gameObjects];
            this.gameObjects = [];
            let counter = 0;
            this.creatingGameInterval = setInterval(() => {
                this.gameObjects.push(tmpGameObjects[counter++]);
                if (this.gameObjects.length === this.currentLevel) {
                    clearInterval(this.creatingGameInterval);
                    this.creatingGameInterval = null;
                    this.gameObjects.forEach( go => go.trackObject());
                }
            }, 1000);
        }
    }
    checkForSubscriber(){
        const monetization: any = document.monetization;
        setTimeout(()=> {
            if (monetization && monetization.state === 'started') { 
                this.createMessage('Hello Subscriber! You are now able to restart the level');
                this.isSubscriber = true;
                const restartBtnEl = document.getElementById('restartBtn');
                restartBtnEl.classList.remove('hidden');
                restartBtnEl.addEventListener('click', (event) => this.restartLevel(event));
            }
        });
    }
}