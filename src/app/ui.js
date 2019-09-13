import w from './w';
import cursors from './cursors';

class UI {
  constructor(opts = {}) {
    w.queueOnLoad.push(_ => {
      let d = document;
      let t = this;

      t._texts         = [];
      t._numTexts      = 100;

      t._main          = d.getElementById('main-block');
      t._dialog        = d.getElementById('base-dialog');
      
      t._url           = d.getElementById('url');
      t._health        = d.getElementById('health');
      t._mainText      = d.getElementById('main-text');
      t._score         = d.getElementById('score');
      t._finalScoreBs  = d.getElementsByClassName('final-score');

      t._dDialog       = d.getElementById('death-dialog');
      t._uDialog       = d.getElementById('upgrade-dialog');
      t._wDialog       = d.getElementById('win-dialog');

      t._choice1       = d.getElementById('choice1');
      t._upgrade1      = d.getElementById('upgrade-1');
      t._choice2       = d.getElementById('choice2');
      t._upgrade2      = d.getElementById('upgrade-2');

      t._typeOuts = [];

      for(let i=0; i<t._numTexts; i++) {
        let d = document.createElement('div');
        d.classList.add('back-text', 'abs');
        d.style = `top: ${w.ranInt(100)}vh; left:${w.ranInt(100)}vw;`;
        d.textContent = '/';
        t._texts.push(d); 
        document.body.appendChild(d);
      };

      setInterval(_ => {
        let text = this._texts[w.ranInt(this._numTexts)- 1];
        if(text) {text.textContent = String.fromCharCode(w.ranInt(42) + 48).toLowerCase()};
      }, 10);
    });
  }

  setHealth(health) {
    this._health.textContent = '';
    for(let i = 0; i < health; i++) {
      this._health.textContent += '* '; 
    }
  }

  setState(state) {
    this._prevState = this._state; 
    this._state = state;
    this._stateLoop();
  } 

  typeOut(target, string) {
    if(target && target.id) {
      if(!this._typeOuts[target.id]) {this._typeOuts[target.id] = []}
      else {
        this._typeOuts[target.id].map(t => clearTimeout(t));
      }
      target.textContent = '';
      for(let i = 0; i < string.length; i++) {
        this._typeOuts[target.id].push(setTimeout(_ => target.textContent += string[i], 65 * i));
      }
    }
  }

  _stateLoop() {
    switch(this._state) {

      case 'WAIT_CHOOSE_BACK':
        if(this._prevState !== this._state) {
          this.typeOut(this._mainText, '^^^^ Level complete: travel back');
        }
        break;
        
      case 'START_LEVEL':
        this.clearDialogs(); 
        setTimeout(_ => {
          this.typeOut(this._url, '____cursed____/?level=' + (w._levels.length - w._level));
        }, 333);
        break;

      case 'START_WIN':
        this.clearDialogs(); 
        this._wDialog.classList.add('visible', 'flex-center');
        break;
        
      case 'PLAYING':
        if(this._prevState !== this._state) {
          this.typeOut(this._mainText, 'W, A, S, D, SPACE to shoot');
        }
        break;

      case 'DEAD':
        if(this._prevState !== this._state) {
          this.typeOut(this._mainText, '~~ sorry, you died :/ ~~');
          this._dDialog.classList.add('visible', 'flex-center');
        }
        break;
    }
  }

  setScore(score) {
    this._score.textContent = score; 
  }

  setFinalScore(score) {
    for(let i=0; i< this._finalScoreBs.length; i++) {
      this._finalScoreBs[i].textContent = score;
    }
  }

  showUpgrades(opts = {}) {
    if(opts.hasUpgrades) {
      let {level, click1, click2} = opts; 
      this._uDialog.classList.remove('no-upgrades');
      this._uDialog.classList.add('visible');
  
      this._choice1.src = cursors[level.up1];
      this._choice2.src = cursors[level.up2];
  
      this._upgrade1.onclick = click1; 
      this._upgrade2.onclick = click2; 
    } else {
      this._uDialog.classList.add('visible', 'no-upgrades');
    }
  }

  clearDialogs() {
    let dialogs = document.getElementsByClassName('dialog');
    for(let i=0; i<dialogs.length; i++) {
      let d = dialogs[i];
      if(d.classList.contains('visible')) {
        dialogs[i].classList.remove('visible');
      }
    }
  }

  createDialog(opts = {}) {
    let {
      num,
      main = 'Contratulations!', 
      sub = 'You have died', 
      button = false, 
      classes = [], 
      ran = false, 
      typeout = false,
      pos = [], 
    } = opts; 

    let d     = this._dialog.cloneNode(true);

    if(d) {
      d.id                        = d.id + '-' + num;
      if(d.childNodes[5]) {
        d.childNodes[5].id          = 'main-' + num;
        d.childNodes[5].textContent = main; 
      }
      if(d.childNodes[7]) {
        d.childNodes[7].textContent = sub; 
      }
      d.classList.add(...classes, 'active')
      setTimeout(_ => {
        d.classList.add('visible')
      },1)
      if(ran) {
        d.style = `top: ${20 + w.ranInt(60)}vh; left:${20 + w.ranInt(60)}vw; `;
      }
      if(pos) {
        d.style = `top: ${pos[1]}px; left:${pos[0]}px; `;
      }
      if(button) {
        // d.childNodes[9].textContent = 'button'; 
      }
      this._main.append(d);
  
      return num; 
    }
  }

  setUrl(text) {
    this.typeOut(this._url, text);
  }
}

export default new UI(); 