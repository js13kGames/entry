import { init, GameLoop, initPointer, on, Sprite, setStoreItem, getStoreItem, emit, track} from 'kontra';
import {Circle} from './circle';
import { IGameObject } from './gameObject';
import { GameEvent, GameEventData } from './gameEvent';
import {Audio} from './audio';
import { PointerRipple} from './pointerRipple';
import { DeathScreen } from './deathScreen';
import { Particle } from './particle';
export class Game {
    gameObjects: IGameObject[] = [];
    pointerRipples: PointerRipple[] = [];
    deathObjects: DeathScreen[] = [];
    particles: Particle[] = [];
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
        if (getStoreItem('johnonym-hiscore')) {
            this.currentHeighScore = getStoreItem('johnonym-hiscore');
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
        this.particles.forEach(p => {
            if(p) p.render();
        });
    }
    initCanvasDimensions(){
        let width = window.outerWidth;
        let height = window.outerHeight - this.topGutter - 120; // added extra margin bot
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ){
            // use outer-width/height for mobile
        } else{
            width = window.innerWidth;
            height = window.innerHeight - this.topGutter;
        }
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
        this.particles.forEach(p => {
            if (p) {
                p.update();
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
                    this.createMessage('GAME OVER. NEW GAME STARTED');
                    this.audio.resetSequence(this.audio.killSequence);
                    this.audio.playNextPitch(this.audio.gameOverSequence);
                    this.deathObjects.push(new DeathScreen(this.gameCanvas.width, this.gameCanvas.height));
                } else {
                    // correct circle killed
                    this.pointerRipples.push(new PointerRipple(event.gameObject.sprite.x, event.gameObject.sprite.y));
                    for (let i = 0; i < 10; i++) {
                        this.particles.push(new Particle(event.gameObject.sprite.x, event.gameObject.sprite.y, event.gameObject.sprite.color, this.gameCanvas.height, this.gameCanvas.width));
                    }
                    let killed: IGameObject = this.gameObjects.splice(index,1)[0];
                    emit(GameEvent.KILL_ANIMATION, { gameObject: event.gameObject});
                    killed = null; // remove from memory
                    this.audio.playNextPitch(this.audio.killSequence, 20);
                    
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
            this.createMessage('dogeQuote')
            setStoreItem('johnonym-hiscore', this.currentHeighScore);
        }
    }
    createLevel(level: number){
        this.createGameObject(level);
        if (this.gameObjects.length < level) {
            this.creatingGameInterval = setInterval( () => {
                this.createGameObject(level);
            },1000);
        }
        this.displayOrHideInstructions(level);
    }
    displayOrHideInstructions(level: number){
        if (level <= 1) {
            const instructionEl = document.getElementById('instructions');
            if (instructionEl && instructionEl.classList.contains('hidden')) {
                instructionEl.classList.remove('hidden')
            }
        } else {
            const instructionEl = document.getElementById('instructions');
            if (instructionEl && !instructionEl.classList.contains('hidden')) {
                instructionEl.classList.add('hidden')
            }
        }
    }
    createGameObject (level: number) {
        let maxX = Math.random() * this.gameCanvas.width;
        let maxY = Math.random() * this.gameCanvas.height;
        // prevent the circle from being cut in border
        if (maxY > this.gameCanvas.height/2) maxY -= 50; 
        else maxY += 50;
        if (maxX > this.gameCanvas.width/2) maxX -= 50;
        else maxX += 50;
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
        if (color === '#FFFFFF' || color === '#BEBEBE') {
            // create new if white or gray;
            return this.createRandomHexColor();
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
        if (msg === 'dogeQuote') {
            msg = this.getRandomDogeQuote();
        }
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
                this.createMessage('Hello Subscriber! You can restart levels, and get a golden border');
                this.isSubscriber = true;
                const restartBtnEl = document.getElementById('restartBtn');
                restartBtnEl.removeAttribute('disabled');
                restartBtnEl.addEventListener('click', (event) => this.restartLevel(event));

                document.getElementById('game').classList.add('subscriber');
            }
        });
    }
    getRandomDogeQuote(): string{
        const quotes = [
            'Many memory 🐕',
            'Amaze new Record 🐕',
            'Wow very hiscore 🐕',
            'Much hiscore wow 🐕',
            'Very points 🐕',
            'Such memory 🐕',
            'Amaze new hiscore 🐕',
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
}