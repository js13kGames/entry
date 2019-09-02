export class Audio {
    private _killSequence: any;
    private _gameOverSequence: any;
    private _hiscoreSequence: any;
    private _isSupported = true;
    private myOscillator;
    private audioContext: AudioContext;
    REAL_TIME_FREQUENCY = 440;
    currentFrequency = 440;
    constructor(){
        try {
            var AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext; 
            this.audioContext = new AudioContext();
        } catch (error) {
            alert('audio is not supported on this device');
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
    playNextPitch(sequence: any, pitch: number = 0) {
        if (this._isSupported) {
            this.myOscillator = this.audioContext.createOscillator();
            this.currentFrequency += pitch;
            this.myOscillator.frequency.value = this.currentFrequency;
            
            let gain = this.audioContext.createGain();
            gain.gain.value = 0.2;
            this.myOscillator.connect(gain);
            gain.connect(this.audioContext.destination);
            this.myOscillator.start();
            this.myOscillator.stop(this.audioContext.currentTime + 0.5);
        }
    }
    resetSequence(sequence: any) {
        if (this._isSupported) {
            if (sequence === this._killSequence) {
                this.currentFrequency = this.REAL_TIME_FREQUENCY;
            }
        }

    }
}
