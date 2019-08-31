window.onload = function () {
    window.audio = new Audio();

    var chordSustain = 2;
    var chords = ['c', 'f', 'g', 'c', 'c', 'g', 'f', 'c'];
    for (var i = 0, len = chords.length; i < len; ++i) {
        window.audio.playChord(chords[i], chordSustain * i, chordSustain);
    }
};

function Audio() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    this.notePlayHandlers = [];
}

Audio.prototype.playNote = function (noteName, noteOnTime, sustain) {
    var oscillator = this.audioCtx.createOscillator();

    oscillator.type = 'square';
    var frequency = getHerzFromNoteName(noteName);
    oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    oscillator.connect(this.audioCtx.destination);

    var handler = setTimeout(function () {
        oscillator.start();

        setTimeout(function () {
            oscillator.stop();
        }, sustain * 1000);
    }, noteOnTime * 1000);
    this.notePlayHandlers.push(handler);
};

/**
 * broken chord
 */
Audio.prototype.playChord = function (chordName, noteOnTime, sustain) {
    var noteSustain = sustain / 4;
    var notes = getNotesFromChord(chordName);
    this.playNote(notes[0], noteOnTime, noteSustain);
    this.playNote(notes[2], noteOnTime + noteSustain, noteSustain);
    this.playNote(notes[1], noteOnTime + noteSustain * 2, noteSustain);
    this.playNote(notes[2], noteOnTime + noteSustain * 3, noteSustain);
};

function getHerzFromNoteName(noteName) {
    // http://pages.mtu.edu/~suits/notefreqs.html
    return {
        b4: 493.88,
        c4: 261.63,
        d4: 293.66,
        e4: 329.63,
        f4: 349.23,
        g4: 392.00,
        a4: 440.00
    }[noteName];
}

function getNotesFromChord(chordName) {
    return {
        c: ['c4', 'e4', 'g4'],
        f: ['c4', 'f4', 'a4'],
        g: ['b4', 'd4', 'g4']
    }[chordName];
}
