let n = 'C3';
let d = 1;
let b = 3;
let spaceNote = '-'
let spaceLen = 7;
let el = 3;

let Morse = {
    a: [{n, l: d}, {n, l: b}],
    b: [{n, l: b}, {n, l: d}, {n, l: d}, {n, l: d}],
    c: [{n, l: b}, {n, l: d}, {n, l: b}, {n, l: d}],
    d: [{n, l: b}, {n, l: d}, {n, l: d}],
    e: [{n, l: d}],
    f: [{n, l: d}, {n, l: d}, {n, l: b}, {n, l: d}],
    g: [{n, l: b}, {n, l: b}, {n, l: d}],
    h: [{n, l: d}, {n, l: d}, {n, l: d}, {n, l: d}],
    i: [{n, l: d}, {n, l: d}],
    j: [{n, l: d}, {n, l: b}, {n, l: b}, {n, l: b}],
    k: [{n, l: b}, {n, l: d}, {n, l: b}],
    l: [{n, l: d}, {n, l: b}, {n, l: d}, {n, l: d}],
    m: [{n, l: b}, {n, l: b}],
    n: [{n, l: b}, {n, l: d}],
    o: [{n, l: b}, {n, l: b}, {n, l: b}],
    p: [{n, l: d}, {n, l: b}, {n, l: b}, {n, l: d}],
    q: [{n, l: b}, {n, l: b}, {n, l: d}, {n, l: b}],
    r: [{n, l: d}, {n, l: b}, {n, l: d}],
    s: [{n, l: d}, {n, l: d}, {n, l: d}],
    t: [{n, l: b}],
    u: [{n, l: d}, {n, l: d}, {n, l: b}],
    v: [{n, l: d}, {n, l: d}, {n, l: d}, {n, l: b}],
    w: [{n, l: d}, {n, l: b}, {n, l: b}],
    x: [{n, l: b}, {n, l: d}, {n, l: d}, {n, l: b}],
    y: [{n, l: b}, {n, l: d}, {n, l: b}, {n, l: b}],
    z: [{n, l: b}, {n, l: b}, {n, l: d}, {n, l: d}],
    period: [{n, l: d}, {n, l: b}, {n, l: d}, {n, l: b}, {n, l: d}, {n, l: b}],
    comma: [{n, l: b}, {n, l: b}, {n, l: d}, {n, l: d}, {n, l: b}, {n, l: b}],
    question: [{n, l: d}, {n, l: d}, {n, l: b}, {n, l: b}, {n, l: d}, {n, l: d}],
    exclamation: [{n, l: b}, {n, l: d}, {n, l: b}, {n, l: d}, {n, l: b}, {n, l: b}],
    space: [{n: spaceNote, l: spaceLen}],
    endL: [{n: spaceNote, l: el}]
};

function charToMorse(ch) {
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
                mf.push({ch: word[i], code: charToMorse(word[i])});
                mf.push({ch: '|', code: Morse.endL});
            };
            mf.pop();
            mf.push({ch: ' ', code: charToMorse(' ')});
        });
        return mf;
    },
};

export default MorseActions;