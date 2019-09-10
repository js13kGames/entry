import {getRand} from './../utils.js';
import directions from './../directions';
let templates = [
    "Your path is $good.",
    "$good is good.",
    "Danger $bad, $bad, and $bad.",
    "$good",
    "Go $good",
    "Hark! $good lies in safety.",
    "Fight or be conquered at $bad, $bad, and $bad",
];

let treasureTemplates = [
    "$treasure holds fortune, but $good is the way forward.",
    "$good to proceed. If treasure you seek then go $treasure.",
    "Noises come from $treasure, $bad and $bad hold a sense of dread.",
    "$treasure shines, $bad and $bad are dark.",
];

let dirs = {
    up: ['north', 'up', 'ahead'],
    down: ['south', 'down', 'behind'],
    left: ['west', 'left'],
    right: ['east', 'right'],
};

function parseSentence(sentence, goodDir, treasure = false, treasureDir) {
    let badDirs = directions.ALL;
    if (treasure) {
        sentence = sentence.replace(/\$treasure/g, dirs[treasureDir][getRand(dirs[treasureDir].length)]);
        badDirs = badDirs.filter(e => e != treasureDir);
    }
    badDirs = badDirs.filter(e => e != goodDir);
    let goodDirection = dirs[goodDir][getRand(dirs[goodDir].length)];
    sentence = sentence.replace('$good', goodDirection);
    badDirs.forEach(e => sentence = sentence.replace('$bad', dirs[e][getRand(dirs[e].length)]));
    return sentence;
}
    
function normalSentence (goodDir) {
    let sen = templates[getRand(templates.length)];
    sen = parseSentence(sen, goodDir);
    
    return sen;
};

function treasureSentence (goodDir, treasureDir = UP) {
    let sen = treasureTemplates[getRand(treasureTemplates.length)];
    sen = parseSentence(sen, goodDir, true, treasureDir);
    
    return sen;
};

let getSentence = function(goodDir, hasTreasure, treasureDir) {
    if (hasTreasure) {
        return treasureSentence(goodDir, treasureDir);
    } else {
        return normalSentence(goodDir);
    }
};

export default getSentence;