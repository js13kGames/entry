import w from './w';

/*
*
* Keymap Bitwise Logic from Evil Glitch 
*
*/
w.keyMap = 0;
w.keys = {
  '87':1,         // w
  '65':2,         // a
  '83':4,         // s
  '68':8,         // d
  '32':16        // space
}

document.onkeydown = function(e){
  var key = e.keyCode || e.key;
  if(keys[key]){
    keyMap|=keys[key];
    e.preventDefault();
  }
}

document.onkeyup = function(e){
  var key = e.keyCode || e.key;
  if(keyMap&keys[key]){
    keyMap^=keys[key];
    e.preventDefault();
  }
}