import {getRand} from './../utils.js';
import directions from './../directions';
let templates = [
    "Your path is $good.",
    "$good is good.",
    "Danger $bad, $bad, and $bad.",
    "$good",
    "Neither $bad, $bad nor $bad are your friend",
    "$good is your friend",
    "Go $good",
    "Brave one, $good will lead you home.",
    "I will aid you on your journey. $good is save",
    "A breeze can be felt from $good.",
    "$bad, $bad, and $bad are your enemy.",
    "Hark! $good lies in safety.",
    "$bad lies, $bad takes, $bad destroys, while $good lives",
    "Fight or be conquered at $bad, $bad, and $bad",
];

let treasureTemplates = [
    "$treasure holds fortune, but $good is the way forward.",
    "$good to proceed. If treasure you seek then go $treasure.",
    "$bad and $bad lie death. $treasure and $good are fine but $treasure may also be death.",
    "$treasure, a powerful foe awaits. $good is the cowards path.",
    "Noises come from $treasure, $bad and $bad hold a sense of dread.",
    "$treasure shines, $bad and $bad are dark.",
];

let dirs = {
    up: ['north', 'up', 'ahead', '12 o clock'],
    down: ['south', 'down', 'behind', '6 o clock'],
    left: ['west', 'left', '9 o clock'],
    right: ['east', 'right', '3 o clock'],
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