
// continueLevel()
// during game loop, check if all babies are returned and check for game over.

function continueLevel(){

  if(babiesReturned>=babies.length) nextPhase();
  if(timeLeft<=0&&timedRun) gameIsOver();
}


// gameIsOver()
// triggers game over screen.

function gameIsOver(){
  gameOver = true;
  currentScreen = "gameover";
}

// nextPhase()
// advances the game upon returning all babies:
// mama takes a nap. if it's the third nap, load the next level.
// else, load this level's next phase (same layout, more baddies).

function nextPhase(){

  napping = true;
  babiesReturned = true;
  player.sleeping = true;
  trace =0;

  naps++; // increment naps taken

  if(naps===3){
    // IF ALL NAPS COMPLETE, LEVEL IS OVER

    // display continue level text
    currentText = [
      "the day is over. level complete!",
      "click to continue"
    ];
    setTimeout(function(){currentScreen = "wakeplayer";},1000)
    shootTextSequence();
    introSeq =0;

    // increment level
    level++

    // load next level:
    switch(level){
      case 1:   currentLevel  = level2; break;
      case 2:
      // if level2 is complete, game over, no more levels
      thankYouText = "congrats! you have reached the end. thank you for playing.";
      gameIsOver();
      break;
    }
    // reset naps
    naps =0;
    // load map
    setupLevel(currentLevel);
  }
  else {
    // IF NAPS NOT COMPLETE, LOAD NEXT PHASE

    // display continue text
    currentText = [
      "good job mama ape!",
      "time for a nap."
    ];
    currentScreen = "wakeplayer";
    shootTextSequence();
    introSeq =0;
    traceSpeed = 10;

    // increment phase
    currentPhase++;

    // enable level in 5 seconds
    setTimeout( function(){
      player.sleeping = false;
      traceSpeed = 0.1;
    }, 5000 );

    // copy currentLevel object
    phase  = JSON.parse(JSON.stringify(currentLevel));

    // add baddies according to level and phase
    switch(level){

      // level 1:
      case 0:
      if(currentPhase>=1){ // phase 2
        phase.baddies.push({p:20, x:30, r:300, kit:fB });
        phase.baddies.push({p:6, x:10, r:40, kit:jB });
        phase.baddies.push({p:-1, x:550, r:345, kit:jB });
        if(currentPhase===2){ // phase 3
          phase.baddies.push({p:1, x:0, r:245, kit:fB });
          phase.baddies.push({p:10, x:250, r:245, kit:fB });
          phase.baddies.push({p:10, x:250, r:245, kit:jB });
        };
      }
      break;

      // level 2:
      case 1:
      if(currentPhase>=1){ // phase 2
        phase.baddies.push({p:-1, x:1500, r:200, kit:jB });
        phase.baddies.push( {p:3, x:30, r:100, kit:fB });
        phase.baddies.push({p:11, x:30, r:100, kit:fB })
        phase.baddies.push({p:16,x:0,r:250,kit:fB});
        phase.baddies.push({p:6, x:30, r:100, kit:fB })

        if(currentPhase===2){  // phase 3
          phase.baddies.push({ p: -1, x:1050, r:500, kit:fB});
          phase.baddies.push({ p: -1, x: 1650, r:500, kit: fB});
          phase.baddies.push({ p: 12, x: 0, r:100, kit: fB});
          phase.baddies.push({ p: 10, x: 0, r:300, kit: fB});
        }
      }
      break;
    }

    // load map
    setupLevel(phase);
  }
}
