function updateScore() {
    var score = document.getElementById('score');
    score.innerHTML = game.gameScore + game.roundScore;

    var heart = document.getElementById('heart');
    heart.innerHTML = game.heartScore;
}

function countDown() {
    var el = document.getElementById('count-down');
    el.innerHTML = '3';

    setTimeout(function () {
        el.innerHTML = '2';
    }, 1000);

    setTimeout(function () {
        el.innerHTML = '1';
    }, 2000);

    setTimeout(function () {
        el.innerHTML = '';
    }, 3000);
}
