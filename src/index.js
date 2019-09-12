import Game from './game'
import Sound from './sound'

// set canvas size
const canvas = document.getElementById('game')
canvas.width = canvas.parentElement.clientWidth
canvas.height = canvas.parentElement.clientHeight

const fontSize = canvas.width / 50
const spans = document.getElementsByTagName('span')
for (let i = 0; i < spans.length; i++) {
  spans[i].style.fontSize = fontSize + 'px'
}

// show splash
const newGameSplash = document.getElementById('new-game')
const gameOverSplash = document.getElementById('game-over')
const gameBeatenSplash = document.getElementById('game-beaten')
newGameSplash.style.opacity = 1

// press Z to start
document.addEventListener('keypress', checkStartKey)

let game = null

function checkStartKey(ev) {
  if (ev.key === 'z') {
    game = new Game(canvas)
    game.onGameOver = () => {
      splashFade(gameOverSplash, true, Sound.gameOver, () => {
        game = null
        document.addEventListener('keypress', checkStartKey)
      })
    }
    game.onGameBeaten = () => {
      splashFade(gameBeatenSplash, true, Sound.gameStartAndBeaten, () => {
        showRankList(game.timeInMill)
        game = null
        document.addEventListener('keypress', checkStartKey)
        
      })
    }

    const splash = newGameSplash.style.opacity === '1' ? newGameSplash : 
      (gameOverSplash.style.opacity === '1' ? gameOverSplash : gameBeatenSplash)
    splashFade(splash, false, Sound.gameStartAndBeaten, () => {
      game.start()
      document.removeEventListener('keypress', checkStartKey)
    })
  }
}

function splashFade(splash, fadeIn, onBefore, onAfter) {
  onBefore()
  const splashInterval = setInterval(() => {
    splash.style.opacity -= (fadeIn ? -1 : 1) * 100 / 2000
    if (fadeIn && parseFloat(splash.style.opacity) >= 1 || !fadeIn && parseFloat(splash.style.opacity) <= 0) {
      clearInterval(splashInterval)
      onAfter()
    }
  }, 100)
}

function showRankList(time) {
  const rankList = JSON.parse(localStorage.getItem('dawn-breaker-rank')) || []
  rankList.push({
    name: '',
    time: time
  })
  rankList.sort((a, b) => {
    return a.time < b.time ? -1 : 1
  })
  if (rankList.length > 5) {
    rankList.pop()
  }
  let inRank = false
  rankList.map(rank => {
    if (rank.name === '') {
      inRank = true
    }
  })
  if (inRank) {
    let name = ''
    while (name === '') {
      name = prompt('High Score!\nEnter your name to show in rank list:')
    }
    rankList.map(rank => { rank.name = rank.name === '' ? name : rank.name })
    localStorage.setItem('dawn-breaker-rank', JSON.stringify(rankList))
    let listStr = rankList.map((rank, index) => `${index + 1}\t\t${rank.name}\t\t${rank.time / 1000}`).join('\n')
    listStr = 'Rank List\nrank\t\tname\t\ttime(s)\n' + listStr
    alert(listStr)
  }
}
