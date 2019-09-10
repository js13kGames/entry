import {getRand} from '../utils.js';
import directions from '../directions';
let templates = [
    "Your path is $g.",
    "$g is good.",
    "Danger $b, $b, and $b.",
    "$g",
    "Go $g",
    "Hark! $g lies in safety.",
    "Fight or be conquered at $b, $b, and $b",
];

let treasureTemplates = [
    "$t holds fortune, but $g is the way forward.",
    "$g to proceed. If treasure you seek then go $t.",
    "$t shines, $b and $b are dark.",
];

let dirs = {
    up: ['north', 'up', 'ahead'],
    down: ['south', 'down', 'behind'],
    left: ['west', 'left'],
    right: ['east', 'right'],
};

function parse(sentence, goodDir, treasure = false, treasureDir) {
    let badDirs = directions.ALL;
    if (treasure) {
        sentence = sentence.replace(/\$t/g, dirs[treasureDir][getRand(dirs[treasureDir].length)]);
        badDirs = badDirs.filter(e => e != treasureDir);
    }
    badDirs = badDirs.filter(e => e != goodDir);
    let goodDirection = dirs[goodDir][getRand(dirs[goodDir].length)];
    sentence = sentence.replace('$g', goodDirection);
    badDirs.forEach(e => sentence = sentence.replace('$b', dirs[e][getRand(dirs[e].length)]));
    return sentence;
}
    
function normSen (goodDir) {
    let sen = templates[getRand(templates.length)];
    sen = parse(sen, goodDir);
    
    return sen;
};

function treasureSen (goodDir, treasureDir = UP) {
    let sen = treasureTemplates[getRand(treasureTemplates.length)];
    sen = parse(sen, goodDir, true, treasureDir);
    
    return sen;
};

let getSentence = function(goodDir, hasTreasure, treasureDir) {
    if (hasTreasure) {
        return treasureSen(goodDir, treasureDir);
    } else {
        return normSen(goodDir);
    }
};

export default getSentence;