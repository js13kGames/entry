function Scoreboard(options) {
  var opts = extend({
    w: 200,
    h: 200
  }, options || {});
  CachedContainer.call(this, opts);

  this.entries = null;
  
  try {
    var scoresJson = PersistStorage.get(Scoreboard.cookieName, '{"scores":[]}');
    var scoresObj = JSON.parse(scoresJson);
    this.entries = scoresObj.scores.map(function (entry) {
      return {
        score: entry.score,
        date: new Date(entry.date)
      };
    });
  } catch (e) {
    console.log('Error trying to get scores:', e);
  }
  if (!this.entries) this.entries = [];

  this.headerText = new DisplayText({
    x: opts.w / 2,
    y: 0,
    font: '16px Arial',
    color: 'white',
    textAlign: 'center',
    textBaseline: 'top',
    text: 'High Scores'
  });
  this.addChild(this.headerText);

  this.scoreTexts = [];
  var i, scoreText;
  for (i = 0; i < Scoreboard.maxEntries; i += 1) {
    scoreText = {
      score: new DisplayText({
        x: 0,
        y: 18 + i * 16,
        text: '---',
        font: '14px Arial',
        textAlign: 'left',
        textBaseline: 'top',
        color: 'black'
      }),
      date: new DisplayText({
        x: opts.w,
        y: 18 + i * 16,
        date: '---',
        font: '14px Arial',
        textAlign: 'right',
        textBasline: 'top',
        color: 'black'
      })
    };
    this.addChild(scoreText.score);
    this.addChild(scoreText.date);
    this.scoreTexts.push(scoreText);
  }
}

Scoreboard.maxEntries = 5;
Scoreboard.cookieName = 'game_turtleback_hiscore';
Scoreboard.months = [
  'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dev'
];

Scoreboard.prototype = extendPrototype(CachedContainer.prototype, {
  saveScores: function () {
    PersistStorage.set(Scoreboard.cookieName, JSON.stringify({
      scores: this.entries.map(function (entry) {
        return {
          score: entry.score,
          date: entry.date.toUTCString()
        };
      })
    }));
  },
  addScore: function (score, date) {
    this.entries.push({ score: score, date: date, newest: true });
    this.entries.sort(function (a, b) {
      if (a.score < b.score) return -1;
      if (a.score > b.score) return 1;
      return 0;
    });
    while (this.entries.length > Scoreboard.maxEntries) {
      this.entries.pop();
    }
    this.saveScores();
    this.updateEntries();
    this.redraw();
  },
  updateEntries: function () {
    var i, entry, scoreText;
    for (i = 0; i < this.scoreTexts.length; i += 1) {
      scoreText = this.scoreTexts[i];
      entry = this.entries[i];
      if (i < this.entries.length) {
        scoreText.score.text = entry.score.toFixed(3);
        scoreText.date.text = Scoreboard.months[entry.date.getMonth()] + ' ' + entry.date.getDate() + ', ' + entry.date.getFullYear();
        if (entry.newest) {
          scoreText.score.color = 'yellow';
          scoreText.date.color = 'yellow';
        } else {
          scoreText.score.color = 'white';
          scoreText.date.color = 'white';
        }
      } else {
        scoreText.score.text = '---';
        scoreText.score.color = 'black';
        scoreText.date.text = '---';
        scoreText.date.color = 'black';
      }
    }
  }
});
