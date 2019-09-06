function updateScore() {
    var score = document.getElementById('score');
    score.innerHTML = game.gameScore + game.roundScore;

    var heart = document.getElementById('heart');
    heart.innerHTML = game.heartScore;
}
