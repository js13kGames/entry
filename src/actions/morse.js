let n = 'C3';
let dot = 1;
let dash = 3;
let spaceNote = '-'
let spaceLen = 7;
let el = 3;

let Morse = {
    a: [{n, len: dot}, {n, len: dash}],
    b: [{n, len: dash}, {n, len: dot}, {n, len: dot}, {n, len: dot}],
    c: [{n, len: dash}, {n, len: dot}, {n, len: dash}, {n, len: dot}],
    d: [{n, len: dash}, {n, len: dot}, {n, len: dot}],
    e: [{n, len: dot}],
    f: [{n, len: dot}, {n, len: dot}, {n, len: dash}, {n, len: dot}],
    g: [{n, len: dash}, {n, len: dash}, {n, len: dot}],
    h: [{n, len: dot}, {n, len: dot}, {n, len: dot}, {n, len: dot}],
    i: [{n, len: dot}, {n, len: dot}],
    j: [{n, len: dot}, {n, len: dash}, {n, len: dash}, {n, len: dash}],
    k: [{n, len: dash}, {n, len: dot}, {n, len: dash}],
    l: [{n, len: dot}, {n, len: dash}, {n, len: dot}, {n, len: dot}],
    m: [{n, len: dash}, {n, len: dash}],
    n: [{n, len: dash}, {n, len: dot}],
    o: [{n, len: dash}, {n, len: dash}, {n, len: dash}],
    p: [{n, len: dot}, {n, len: dash}, {n, len: dash}, {n, len: dot}],
    q: [{n, len: dash}, {n, len: dash}, {n, len: dot}, {n, len: dash}],
    r: [{n, len: dot}, {n, len: dash}, {n, len: dot}],
    s: [{n, len: dot}, {n, len: dot}, {n, len: dot}],
    t: [{n, len: dash}],
    u: [{n, len: dot}, {n, len: dot}, {n, len: dash}],
    v: [{n, len: dot}, {n, len: dot}, {n, len: dot}, {n, len: dash}],
    w: [{n, len: dot}, {n, len: dash}, {n, len: dash}],
    x: [{n, len: dash}, {n, len: dot}, {n, len: dot}, {n, len: dash}],
    y: [{n, len: dash}, {n, len: dot}, {n, len: dash}, {n, len: dash}],
    z: [{n, len: dash}, {n, len: dash}, {n, len: dot}, {n, len: dot}],
    period: [{n, len: dot}, {n, len: dash}, {n, len: dot}, {n, len: dash}, {n, len: dot}, {n, len: dash}],
    comma: [{n, len: dash}, {n, len: dash}, {n, len: dot}, {n, len: dot}, {n, len: dash}, {n, len: dash}],
    question: [{n, len: dot}, {n, len: dot}, {n, len: dash}, {n, len: dash}, {n, len: dot}, {n, len: dot}],
    exclamation: [{n, len: dash}, {n, len: dot}, {n, len: dash}, {n, len: dot}, {n, len: dash}, {n, len: dash}],
    space: [{n: spaceNote, len: spaceLen}],
    endL: [{n: spaceNote, len: el}]
};

function characterToMorse(ch) {
    switch(ch) {
        case ' ':
            return Morse.space;
        case '.':
            return Morse.period;
        case ',':
            return Morse.comma;
        case '?':
            return Morse.question;
        case '!':
            return Morse.exclamation;
        default:
            return Morse[ch];
    }
};

let MorseActions = {
    toMorse: function(s) {
        let mf = [];
        s.split(' ').forEach(word => {
            for(let i = 0; i < word.length; i++) {
                mf.push({ch: word[i], code: characterToMorse(word[i])});
                mf.push({ch: '|', code: Morse.endL});
            };
            mf.pop();
            mf.push({ch: ' ', code: characterToMorse(' ')});
        });
        return mf;
    },
};

export default MorseActions;