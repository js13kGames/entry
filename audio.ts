import {Note, Sequence} from 'tinymusic';
export class Audio {
    private _killSequence: Sequence;
    private _gameOverSequence: Sequence;
    private _hiscoreSequence: Sequence;
    private _isSupported = true;
    constructor(){
        try {
            const ac = new AudioContext();
            const tempo = 120;
            const note1 = new Note('G3 q');
            const note2 = new Note('A1 e');
            const note3 = new Note('C6 0.325');
            this._killSequence = new Sequence(ac, tempo);
            this._killSequence.loop = false;
            this._killSequence.waveType = 'square';
            this._killSequence.gain.gain.value = 0.10;
            this._killSequence.push(note1);

            this._gameOverSequence = new Sequence(ac, tempo);
            this._gameOverSequence.loop = false;
            this._gameOverSequence.createCustomWave([-1, 0, 1, 0, -1, 0, 1]);
            this._gameOverSequence.gain.gain.value = 0.25;
            this._gameOverSequence.push(note2);

            this._hiscoreSequence = new Sequence(ac, tempo);
            this._hiscoreSequence.loop = false;
            this._hiscoreSequence.staccato = 0.8;
            this._hiscoreSequence.waveType = 'saw';
            this._hiscoreSequence.gain.gain.value = 0.15;
            this._hiscoreSequence.push(note3, note3, note3);
        } catch (error) {
            console.warn('audio is not supported on this device');
            this._isSupported = false;
        }
    }
    get killSequence(){
        return this._killSequence;
    }
    get gameOverSequence(){
        return this._gameOverSequence;
    }
    get hiscoreSequence(){
        return this._hiscoreSequence;
    }
    playNextPitch(sequence: Sequence, pitch: number = 0) {
        if (this._isSupported) {
            sequence.notes[0].frequency += pitch;
            sequence.play();
        }
    }
    resetSequence(sequence: Sequence) {
        if (this._isSupported) {
            if (sequence === this._killSequence) {
                this._killSequence.notes = [new Note('G3 q')];
            }
        }
    }
}
