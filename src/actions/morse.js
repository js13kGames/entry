let note = 'C3';
let dot = 1;
let dash = 3;
let spaceNote = '-'
let spaceLen = 7;
let endLetterLen = 3;

let Morse = {
    a: [{note, len: dot}, {note, len: dash}],
    b: [{note, len: dash}, {note, len: dot}, {note, len: dot}, {note, len: dot}],
    c: [{note, len: dash}, {note, len: dot}, {note, len: dash}, {note, len: dot}],
    d: [{note, len: dash}, {note, len: dot}, {note, len: dot}],
    e: [{note, len: dot}],
    f: [{note, len: dot}, {note, len: dot}, {note, len: dash}, {note, len: dot}],
    g: [{note, len: dash}, {note, len: dash}, {note, len: dot}],
    h: [{note, len: dot}, {note, len: dot}, {note, len: dot}, {note, len: dot}],
    i: [{note, len: dot}, {note, len: dot}],
    j: [{note, len: dot}, {note, len: dash}, {note, len: dash}, {note, len: dash}],
    k: [{note, len: dash}, {note, len: dot}, {note, len: dash}],
    l: [{note, len: dot}, {note, len: dash}, {note, len: dot}, {note, len: dot}],
    m: [{note, len: dash}, {note, len: dash}],
    n: [{note, len: dash}, {note, len: dot}],
    o: [{note, len: dash}, {note, len: dash}, {note, len: dash}],
    p: [{note, len: dot}, {note, len: dash}, {note, len: dash}, {note, len: dot}],
    q: [{note, len: dash}, {note, len: dash}, {note, len: dot}, {note, len: dash}],
    r: [{note, len: dot}, {note, len: dash}, {note, len: dot}],
    s: [{note, len: dot}, {note, len: dot}, {note, len: dot}],
    t: [{note, len: dash}],
    u: [{note, len: dot}, {note, len: dot}, {note, len: dash}],
    v: [{note, len: dot}, {note, len: dot}, {note, len: dot}, {note, len: dash}],
    w: [{note, len: dot}, {note, len: dash}, {note, len: dash}],
    x: [{note, len: dash}, {note, len: dot}, {note, len: dot}, {note, len: dash}],
    y: [{note, len: dash}, {note, len: dot}, {note, len: dash}, {note, len: dash}],
    z: [{note, len: dash}, {note, len: dash}, {note, len: dot}, {note, len: dot}],
    one: [{note, len: dot}, {note, len: dash}, {note, len: dash}, {note, len: dash}, {note, len: dash}],
    two: [{note, len: dot}, {note, len: dot}, {note, len: dash}, {note, len: dash}, {note, len: dash}],
    three: [{note, len: dot}, {note, len: dot}, {note, len: dot}, {note, len: dash}, {note, len: dash}],
    four: [{note, len: dot}, {note, len: dot}, {note, len: dot}, {note, len: dot}, {note, len: dash}],
    five: [{note, len: dot}, {note, len: dot}, {note, len: dot}, {note, len: dot}, {note, len: dot}],
    six: [{note, len: dash}, {note, len: dot}, {note, len: dot}, {note, len: dot}, {note, len: dot}],
    seven: [{note, len: dash}, {note, len: dash}, {note, len: dot}, {note, len: dot}, {note, len: dot}],
    eight: [{note, len: dash}, {note, len: dash}, {note, len: dash}, {note, len: dot}, {note, len: dot}],
    nine: [{note, len: dash}, {note, len: dash}, {note, len: dash}, {note, len: dash}, {note, len: dot}],
    zero: [{note, len: dash}, {note, len: dash}, {note, len: dash}, {note, len: dash}, {note, len: dash}],
    period: [{note, len: dot}, {note, len: dash}, {note, len: dot}, {note, len: dash}, {note, len: dot}, {note, len: dash}],
    comma: [{note, len: dash}, {note, len: dash}, {note, len: dot}, {note, len: dot}, {note, len: dash}, {note, len: dash}],
    question: [{note, len: dot}, {note, len: dot}, {note, len: dash}, {note, len: dash}, {note, len: dot}, {note, len: dot}],
    exclamation: [{note, len: dash}, {note, len: dot}, {note, len: dash}, {note, len: dot}, {note, len: dash}, {note, len: dash}],
    space: [{note: spaceNote, len: spaceLen}],
    endLetter: [{note: spaceNote, len: endLetterLen}]
};

function characterToMorse(character) {
    switch(character) {
        case ' ':
            return Morse.space;
        case '0':
            return Morse.zero;
        case '1':
            return Morse.one;
        case '2':
            return Morse.two;
        case '3':
            return Morse.three;
        case '4':
            return Morse.four;
        case '5':
            return Morse.five;
        case '6':
            return Morse.six;
        case '7':
            return Morse.seven;
        case '8':
            return Morse.eight;
        case '9':
            return Morse.nine;
        case '.':
            return Morse.period;
        case ',':
            return Morse.comma;
        case '?':
            return Morse.question;
        case '!':
            return Morse.exclamation;
        default:
            return Morse[character];
    }
};

let MorseActions = {
    sentenceToMorse: function(sentence) {
        let MorseForm = [];
        sentence.split(' ').forEach(word => {
            for(let i = 0; i < word.length; i++) {
                MorseForm.push({character: word[i], code: characterToMorse(word[i])});
                MorseForm.push({character: '|', code: Morse.endLetter});
            };
            MorseForm.pop();
            MorseForm.push({character: ' ', code: characterToMorse(' ')});
        });
        return MorseForm;
    },

    codeLengths: {
        dot,
        dash,
        space: spaceLen,
        endLetter: endLetterLen,
    },
};

export default MorseActions;