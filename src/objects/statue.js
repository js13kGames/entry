import modes from './../modes.js';
import Interactable from './interactable.js';
import MorseActions from './../actions/morse.js';
import MusicActions from './../actions/music.js';
import sentenceToBraille from './../actions/braille.js';

let noteList = [];

let Statue = function(g, mode) {
    Interactable.call(this, g);
    this.sprite = g.rectangle(48, 64, 'brown');
    this.scene = g.group();
    this.sprites = [];
    this.modal = {};
    this.mode = mode;
};

Statue.prototype = Object.create(Interactable.prototype);

Statue.prototype.initialize = function(sentence, shownChar) {
    if (this.mode === modes[0]) {
        this.action = () => this.showBraille(sentenceToBraille(sentence.toLowerCase()), this.scene, shownChar);
        this.stop = this.closeModal;
    } else if (this.mode === modes[1]) {
        this.action = () => this.showMorse(MorseActions.sentenceToMorse(sentence.toLowerCase()), this.scene, shownChar);
        this.stop = this.closeModal;
    } else {
        this.action = () => this.playMorse(MorseActions.sentenceToMorse(sentence.toLowerCase()));
        this.stop = this.stopMorse;
    }
};

Statue.prototype.stopMorse = function() {
    MusicActions.stopMusic();
    this.closeModal();
};

Statue.prototype.closeModal = function() {
    this.g.remove(this.modal);
    this.g.remove(this.sprites);
};

Statue.prototype.playMorse = function(morse) {
    this.modal = this.g.rectangle(this.g.canvas.width / 2, this.g.canvas.height / 10, 'teal', 'black', 1, this.g.canvas.width / 4, this.g.canvas.height / 10);
    this.sprites = [this.g.text("Playing morse code", "30px Times", "black", 0, 0)];
    this.scene.addChild(this.modal);
    this.modal.putLeft(this.sprites[0], this.g.canvas.width / 5, -10);
    let nl = [];
    if (noteList.length === 0) {
        morse.map((character, i) => {
            character.code.map(code => {
                nl.push({note: code.note, len: code.len});
            })
        })
        noteList = nl;
    } else {
        nl = noteList;
    }
    MusicActions.playMusic(nl, this.g.globals.GAME_TEMPO);
};

Statue.prototype.showMorse = function(morse, scene, showingChar = false) {
    let circleSize = 10;
    let rectSize = circleSize * 3;
    let padding = circleSize / 2;
    let xPos = rectSize;
    let startY = this.g.canvas.height / 10;
    let yPos = startY;
    let sprites = [];
    let rows = 2;
    let width = this.g.canvas.width - rectSize;
    console.log(morse);
    let shownChar = '';
    if (showingChar) {
        shownChar = morse[0].character;
    }
    morse.map(char => {
        if (char.code.length * rectSize + xPos >= width) {
            xPos = rectSize;
            yPos += circleSize * 2;
            rows++;
        }
        if (char.character === shownChar) {
            let txt = this.g.text(shownChar, '20px Times', 'yellow', xPos, yPos - padding);
            sprites.push(txt);
            xPos += circleSize + padding;
        } else {
            char.code.map((code, i) => {
                if (code.len === 1) {
                    sprites.push(this.g.circle(circleSize, 'black', 'black', 1, xPos, yPos));
                    xPos += circleSize + padding;
                } else if (code.len === 3 && char.character !== '|') {
                    sprites.push(this.g.rectangle(rectSize, circleSize, 'black', 'black', 1, xPos, yPos));
                    xPos += rectSize + padding;
                } else if (char.character === '|') {
                    sprites.push(this.g.rectangle(1, circleSize, 'red', 'red', 1, xPos, yPos));
                    xPos += 1 + padding;
                } else if (code.len === 7) {
                    sprites.push(this.g.rectangle(rectSize, 0.5, 'red', 'red', 1, xPos, yPos + padding));
                    xPos += rectSize + padding;
                }
            })
        }
    })
    this.modal = this.g.rectangle(width, rows * circleSize * 2, 'teal', 'black', 1, rectSize / 2, startY - circleSize);
    this.sprites = sprites;
    scene.addChild(this.modal);
    scene.add(sprites);
};

Statue.prototype.showBraille = function(braille, scene, showingChar = false) {
    let circleSize = 10;
    let padding = circleSize * 1.5;
    let xPos = padding;
    let startY = this.g.canvas.height / 10;
    let yPos = startY;
    let sprites = [];
    let rows = 2;
    let width = this.g.canvas.width - padding;
    let shownChar = '';
    // showingChar = true;
    console.log('showingChar');
    console.log(showingChar);
    if (showingChar) {
        shownChar = braille[0].character;
    }
    braille.map(char => {
        if (circleSize * 3 + xPos >= width) {
            xPos = padding;
            yPos += (circleSize + padding) * 2;
            rows++;
        }
        if (char.character === shownChar) {
            let txt = this.g.text(shownChar, '40px Times', 'yellow', xPos + padding / 3, yPos);
            sprites.push(txt);
        } else {
            char.dots.map((code, i) => {
                let x = xPos + ((i % 2) * padding);
                let y = yPos + (Math.floor(i / 2) * padding);
                sprites.push(this.g.circle(circleSize, code === 1 ? 'black' : 'teal', 'black', 1, x, y));
            })
        }
        xPos += circleSize * 2 + padding;
    })
    this.sprites = sprites;
    this.modal = this.g.rectangle(width, rows * padding * 3, 'teal', 'black', 1, padding / 2, startY - padding);
    scene.addChild(this.modal);
    scene.add(sprites);
};

export default Statue;