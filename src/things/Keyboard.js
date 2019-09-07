import getControls from '../controls';
import WhiteKey from './WhiteKey';
import BlackKey from './BlackKey';
import Synth, { PIANO, OUT_OF_TUNE_PIANO } from '../../lib/synth';
import colors from '../colors';
import TextUtil from '../text-util';
import { lpad, rpad } from '../utils';
import Slime, { HAPPY, SAD, ANGRY } from './Slime'

const WHITE_KEYS = 0;
const ALL_KEYS = 1;

const SHOW_ALL_NOTES = 0;
const SHOW_FIRST_NOTE = 1;

const KEY_MODE = 0;
const HIGHLIGHT_MODE = 1;

const notes = [
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'
];
const controls = ['A', 'W', 'S', 'E', 'D', 'F', 'T', 'G', 'Y', 'H', 'U', 'J', 'K'];
const controlMap = {};
notes.forEach((note, index) => controlMap[note] = controls[index]);

class Keyboard
{
  constructor(g, hud) {
    this.g = g;
    this.textUtil = new TextUtil(g);
    this.initControls();
    this.createKeys();
    this.initMidi();
    this.waitForNote = false;
    this.lockedInput = false;
    this.onWinScreen = false;
    this.gameOver = false;
    this.menuStep = KEY_MODE;
    this.started = false;
    this.repeated = false;
    this.hud = hud;
    this.totalNotes = 0;
    this.correctNotes = 0;
    this.prevCorrectNotes = 0;
    this.level = 1;
    this.subLevel = 1;
    this.showMenu();
    this.resetScore();
  }

  resetScore() {
    this.score = {
      [HAPPY]: 0,
      [SAD]: 0,
      [ANGRY]: 0,
    };
    this.totalNotes = 0;
    this.correctNotes = 0;
  }

  initMidi() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(midiAccess => {
        for (var input of midiAccess.inputs.values()) {
          input.onmidimessage = (message) => {
            const NOTE_ON = 159;
            const startingNote = 60;
            if (
              message.data[0] === NOTE_ON &&
              message.data[1] >= startingNote
              && message.data[1] < (startingNote + 13)
            ) {
              const noteIndex = message.data[1] - startingNote;
              const noteParts = notes[noteIndex].match(/^(\D+)(\d)$/);
              this.playNoteAsPlayer(noteParts[1], noteParts[2]);
            }
          }
        }
      });
    }
  }

  showMenu() {
    this.hud.setText('Select Mode');
    this.menuTexts = this.textUtil.centeredTexts(
      [
        'White Keys (Easier)',
        'All Keys   (Harder)',
      ],
      18,
      colors.black,
      40,
      32,
    );
    this.cursor = new Slime(this.g);
    this.cursor.setMood(HAPPY);
    this.cursor.sprite.y = this.menuTexts[0].y;
    this.cursor.sprite.x = this.menuTexts[0].x - 24;
    this.keyMode = WHITE_KEYS;
    this.highlightMode = SHOW_ALL_NOTES;
  }

  showMenuStep2() {
    this.menuStep = HIGHLIGHT_MODE;
    this.g.remove(this.menuTexts);
    this.menuTexts = this.textUtil.centeredTexts(
      [
        'Show All Notes  (Easier)',
        'Show First Note (Harder)',
      ],
      18,
      colors.black,
      40,
      32,
    );
    this.cursor.sprite.y = this.menuTexts[0].y;
    this.cursor.sprite.x = this.menuTexts[0].x - 24;
  }

  start() {
    this.started = true;
    this.g.remove(this.menuTexts);
    this.g.remove(this.cursor.sprite);
    this.startTime = new Date();
    this.melodyLength = 2;
    this.startRound();
    this.hud.setFooterText('Level 1-1');
  }

  reset() {
    if (this.texts) {
      this.g.remove(this.texts);
    }
    if (this.winScreenSlimes) {
      this.g.remove(this.winScreenSlimes.map(slime => slime.sprite));
    }
    this.texts = [];
    this.winScreenSlimes = [];
    this.started = false;
    this.menuStep = KEY_MODE;
    this.highlightMode = SHOW_ALL_NOTES;
    this.onWinScreen = false;
    this.gameOver = false;
    this.level = 1;
    this.subLevel = 1;
    this.hud.setFooterText(' ');
    this.resetScore();
    this.resetSlimes();
    this.showSlimes();
    this.showKeyboard();
    this.showMenu();
  }

  startRound() {
    this.hud.setText('Listen');
    this.resetSlimes();
    this.prevCorrectNotes = this.correctNotes;
    this.generateMelody();
  }

  showResults() {
    let roundScore = 0;
    this.lockedInput = true;
    Object.keys(this.keys).forEach(key => {
      roundScore += this.keys[key].slime.mood;
      this.score[this.keys[key].slime.mood]++;
    });
    if (this.correctNotes - this.prevCorrectNotes === this.melodyLength) {
      this.hud.setText('Perfect!');
    } else if (roundScore === 0) {
      this.hud.setText('Acceptable');
    } else if (roundScore > 0) {
      this.hud.setText('Nice!')
    } else {
      const messages = [
        `The slimes don't want to play anymore`,
        `The slimes have lost the music in their hearts`,
        `The slimes just remembered they have a thing`,
        `The slimes are kicking you out of the band`,
      ]
      this.hud.setText('Game Over', this.g.randomPick(messages));
      this.gameOver = true;
    }

    if (roundScore >= 0) {
      if (
        this.subLevel === 8 &&
        this.level === (
          this.keyMode === WHITE_KEYS ? 2 : 3
        )
      ) {
        this.showWinScreen();
      } else {
        if (this.subLevel < 8) {
          this.subLevel++;
        } else {
          this.level++;
          this.subLevel = 1;
        }

        setTimeout(() => {
          this.startRound();
          this.hud.setFooterText(`Level ${this.level}-${this.subLevel}`);
        }, 2000);
      }
    }
  }

  showWinScreen() {
    if (this.keyMode === WHITE_KEYS) {
      this.hud.setText('Well Done!', 'Try all keys mode to proceed to level 3')
    } else {
      this.hud.setText('You Win!');
    }
    this.hud.setFooterText(' ');
    this.endTime = new Date();
    this.hideSlimes();
    this.hideKeyboard();
    const rate = (this.correctNotes / this.totalNotes) * 100;
    const time = (this.endTime.getTime() - this.startTime.getTime())/1000;
    const minutes = Math.floor(time / 60).toString();
    const seconds = (time % 60).toFixed(3);
    const modeText = (
      (this.keyMode === WHITE_KEYS ? 'White Keys | ' : 'All Keys | ') +
      (this.highlightMode === SHOW_ALL_NOTES ? 'Show All' : 'Show First')
    );
    this.texts = this.textUtil.centeredTexts(
      [
        ' ',
        rpad('Mode', 16) + modeText,
        rpad('Correct Notes', 16) + `${rate.toFixed(2)}%`,
        rpad('Time', 16) + `${lpad(minutes, 2, '0')}:${lpad(seconds, 6, '0')}`,
        lpad(' '.toString(), 16) + lpad(this.score[HAPPY].toString(), 3),
        lpad(' '.toString(), 16) + lpad(this.score[SAD].toString(), 3),
        lpad(' '.toString(), 16) + lpad(this.score[ANGRY].toString(), 3),
      ],
      18,
      colors.black,
      50,
      50
    );
    this.winScreenSlimes = [
      new Slime(this.g),
      new Slime(this.g),
      new Slime(this.g)
    ];
    this.winScreenSlimes[0].setMood(HAPPY);
    this.winScreenSlimes[1].setMood(SAD);
    this.winScreenSlimes[2].setMood(ANGRY);
    for (let i = 0; i < 3; i++) {
      this.winScreenSlimes[i].sprite.y = this.texts[i+4].y;
      this.winScreenSlimes[i].sprite.x = this.texts[i+4].x + 12;
    }
    this.onWinScreen = true;
  }

  toggleMode() {
    if (this.started) {
      return;
    }

    let mode;
    if (this.menuStep === KEY_MODE) {
      if (this.keyMode === ALL_KEYS) {
        this.keyMode = WHITE_KEYS;
      } else {
        this.keyMode = ALL_KEYS;
      }
      mode = this.keyMode;
    } else {
      if (this.highlightMode === SHOW_ALL_NOTES) {
        this.highlightMode = SHOW_FIRST_NOTE;
      } else {
        this.highlightMode = SHOW_ALL_NOTES;
      }
      mode = this.highlightMode;
    }

    this.cursor.sprite.x = this.menuTexts[mode].x - 24;
    this.cursor.sprite.y = this.menuTexts[mode].y;
  }

  initControls() {
    this.controls = getControls(this.g);
    notes.forEach(note => {
      this.controls[note].press = () => this.playNoteAsPlayer(note.replace('4', ''), note.charAt(note.length - 1));
    });
    this.controls.C5.press = () => this.playNoteAsPlayer('C', 5);
    this.controls.confirm.press = () => {
      if (this.onWinScreen || this.gameOver) {
        this.reset();
      } else if (!this.started) {
        if (this.menuStep === 0) {
          this.showMenuStep2();
        } else {
          this.start();
        }
      } else if (!this.repeated) {
        this.playMelody(this.melody.slice());
        this.repeated = true;
      }
    }
    this.controls.up.press = this.toggleMode.bind(this);
    this.controls.down.press = this.toggleMode.bind(this);
  }

  endRoundIfMelodyOver() {
    if (!this.lockedInput && this.melody.length === 0) {
      this.lockedInput = true;
      this.repeated = false;
      this.showResults();
      if (this.subLevel === 1) {
        this.melodyLength = 2;
      } else {
        this.melodyLength++;
      }
      return true;
    }
    return false;
  }

  playNoteAsPlayer(note, octave) {
    if (this.lockedInput) {
      return;
    }

    if (this.waitForNote) {
      if (this.waitForNote !== `${note}${octave}`) {
        return;
      }
      this.playNote(note, octave, colors.blue);
      this.waitForNote = false;
      this.melody.shift();
      this.endRoundIfMelodyOver() || this.hud.setText('Continue');
    } else if (this.melody && this.melody.length) {
      const key = this.keys[`${note}${octave}`];
      if (this.melody[0] === `${note}${octave}`) {
        this.playNote(note, octave, colors.blue);
        this.melody.shift();
        key.onCorrectNote(this.endRoundIfMelodyOver.bind(this));
        this.correctNotes++;
        this.hud.setText('Play');
      } else {
        if (key.slime.mood !== ANGRY) {
          this.waitForNote = this.melody[0];
          this.playNote(note, octave, colors.red, OUT_OF_TUNE_PIANO);

          // Show what correct note was
          const correctKey = this.keys[this.melody[0]];
          correctKey.highlight(colors.lightBlue);

          key.onWrongNote();
          this.hud.setText('Play correct note to continue');
        } else {
          // Once slime is angry, note cannot be played again (unless it's the right note)
          key.highlight(colors.red, 0.25);
          this.hud.setText('Slime is angry', 'Play another key');
        }
      }
    } else if (!this.waitForNote) {
      this.playNote(note, octave, colors.blue);
    }
  }

  playNote(note, octave, highlightColor=null, instrument=PIANO) {
    Synth.play(instrument, note, octave - 1);
    if (highlightColor) {
      this.keys[`${note}${octave}`].highlight(highlightColor, 0.25);
    }
  }

  updateSlimes(callback) {
    Object.keys(this.keys).forEach(key => {
      callback(this.keys[key].slime);
    });
  }

  resetSlimes() {
    this.updateSlimes(slime => slime.resetMood());
  }

  hideSlimes() {
    this.updateSlimes(slime => slime.sprite.visible = false);
  }

  showSlimes() {
    this.updateSlimes(slime => slime.sprite.visible = true);
  }

  hideKeyboard() {
    Object.keys(this.keys).forEach(key => {
      this.keys[key].sprite.visible = false;
      this.keys[key].text.visible = false;
    });
  }

  showKeyboard() {
    Object.keys(this.keys).forEach(key => {
      this.keys[key].sprite.visible = true;
      this.keys[key].text.visible = true;
    });
  }

  generateMelody() {
    const scalesByLevel = {
      1: {
        Pentatonic: [2, 2, 3, 2],
        ['Whole Tone']: [2, 2, 2, 2, 2],
        ['Blues']: [3, 2, 1, 1, 3, 2],
      },
      2: {
        Major: [2, 2, 1, 2, 2, 2, 1],
        ['Jazz Minor']: [2, 1, 2, 2, 2, 2, 1],
        ['Harmonic Minor']: [2, 1, 2, 2, 1, 3, 1],
      },
      3: {
        Diminished: [1, 2, 1, 2, 1, 2, 1, 2],
        Chromatic: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      }
    }
    const whiteKeyModeOptions = {
      1: {
        scale: 'Pentatonic',
        keys: ['C', 'F', 'G'],
      },
      2: {
        scale: 'Major',
        keys: 'C',
      }
    };
    const scales = scalesByLevel[this.level];
    const scaleName = this.keyMode === WHITE_KEYS
      ? whiteKeyModeOptions[this.level].scale
      : this.g.randomPick(Object.keys(scales));
    const scale = scales[scaleName];

    const getNoteIndices = (startingIndex) => {
      const indices = [startingIndex];
      scale.forEach((step, i) => {
        if (startingIndex > 0 && i === scale.length - 1) {
          // Only C4 has an octave. Skip the last interval for the others.
          return;
        }
        let noteIndex = (indices[indices.length - 1] + step)
        if  (startingIndex > 0) {
          noteIndex %= 12;
        }
        indices.push(noteIndex);
      })
      return indices;
    }
    const keyCenters = {};
    notes.forEach((note, i) => {
      if (note === 'C5') return;
      keyCenters[note.replace('4', '')] = getNoteIndices(i);
    })
    const randomKey = this.keyMode === WHITE_KEYS
      ? this.g.randomPick(whiteKeyModeOptions[this.level].keys)
      : this.g.randomPick(Object.keys(keyCenters));
    const diatonicIndices = keyCenters[randomKey];
    const diatonicNotes = notes.filter((n, i) => diatonicIndices.indexOf(i) > -1);

    const melody = [this.g.randomPick(diatonicNotes)];
    for (let i = 1; i < this.melodyLength; i += 1) {
      if (melody.length > 1) {
        const previousNote = melody[melody.length - 1];
        const nextPreviousNote = melody[melody.length - 2];
        const previousInterval = (
          Math.max(
            notes.indexOf(previousNote),
            notes.indexOf(nextPreviousNote)
          ) -
          Math.min(
            notes.indexOf(previousNote),
            notes.indexOf(nextPreviousNote)
          )
        );
        const availableAscending = diatonicNotes.filter((n, i) => i > diatonicNotes.indexOf(previousNote));
        const availableDescending = diatonicNotes.filter((n, i) => i < diatonicNotes.indexOf(previousNote));

        const directionChoices = {};
        if (availableAscending.length) {
          directionChoices.asc = availableAscending;
        }
        if (availableDescending.length) {
          directionChoices.desc = availableDescending;
        }
        const direction = this.g.randomPick(Object.keys(directionChoices));
        const choices = directionChoices[direction];

        if (previousInterval < 5) {
          // If previous interval was small, allow a bigger one
          melody.push(this.g.randomPick(choices));
        } else {
          // Move step wise if previous interval was a big leap
          if (direction === 'asc') {
            melody.push(choices[0]);
          } else {
            melody.push(choices[choices.length - 1]);
          }
        }
      } else {
        // Second note can be any diatonic note except for the unison
        melody.push(
          this.g.randomPick(
            diatonicNotes.filter(n => n !== melody[0])
          )
        );
      }
    }

    this.melody = melody.slice();
    // First key slime starts off happy
    this.keys[melody[0]].slime.setMood(HAPPY);
    this.playMelody(melody);
    this.totalNotes += this.melodyLength;
  }

  playMelody(melody) {
    this.lockedInput = true;
    if (melody.length) {
      const isFirstNote = melody.length === this.melodyLength;
      const noteAndOctave = melody.shift();
      if (this.highlightMode === SHOW_ALL_NOTES || isFirstNote) {
        this.keys[noteAndOctave].slime.jump();
      }
      const octave = noteAndOctave.charAt(noteAndOctave.length - 1);
      const note = noteAndOctave.replace(/\d/, '');
      this.playNote(
        note,
        octave,
        this.highlightMode === SHOW_FIRST_NOTE && !isFirstNote
          ? null
          : colors.lightBlue
      );

      // Go faster as there are more notes.
      const delay = 1000 - Math.min((this.melodyLength * 80), 800);
      window.setTimeout(() => {
        this.playMelody(melody);
      }, delay)
    } else {
      this.lockedInput = false;
      if (!this.repeated) {
        this.hud.setText('Enter to repeat or start playing');
      } else {
        this.hud.setText('Play');
      }
    }
  }

  createKeys() {
    this.keys = {};

    notes.filter(note => note.length == 2).forEach((note, i) => {
      this.keys[note] = new WhiteKey(this.g, i, controlMap[note]);
    })
    notes.filter(note => note.length === 3).forEach((note, i) => {
      this.keys[note] = new BlackKey(this.g, i, controlMap[note]);
    })
  }

  update() {
    Object.keys(this.keys).forEach(k => {
      this.keys[k].update();
    })
  }
}

export default Keyboard;
