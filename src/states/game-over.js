import TextUtil from './../text-util';
let GameOver = function(g, texts) {
    let textUtil = new TextUtil(g);
    let msg = textUtil.centeredTexts(texts, 40, 'black', g.stage.halfHeight - ((texts.length - 1) * 40), 40);
    return () => {};
};

export default GameOver;