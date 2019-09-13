// sfx.js
// simple re-uses of functions in mus.js

// monkey baby cry SFX using high-pitched organ sounds
function monkeyCrySFX(){
  sfxSeq(5, 2.2+ Math.random()*0.2 ,-0.02, 0.08 ,-0.01, 50,0, organWaveAt,false,0.5)
}

// baddie/player collision sound
function collideSFX(){
  sfxSeq(3, 100,-30, 0.05, 0.09, 5, 10, roundedSineWaveAt,6,0.1);
}

// moving object falling to the ground sound
function thumpSFX(){
  sfxSeq(2, 200,-100, 0.05, 0.09, 5, 10, roundedSineWaveAt,6,0.1);
}

// jumping sound (pitched up or down depending on who is jumping)
function jumpSFX(t1,t2,l){ //input tone 1 and tone 2
  loadSlidingSound(organWaveAt,7,l,1,t1,t2);
}

// bird chirping SFX
function birdChirpSFX(bird){
if(bird.onScreen){
  loadSlidingSound(sineWaveAt,100,0.10,0.1,1400+Math.random()*400,2650);
  if(!chirping) setTimeout(
    function(){
      loadSlidingSound(sineWaveAt,100,0.25,0.06,1400+Math.random()*400,2700+Math.random()*800);
    }, 150
  )
  chirping = true;
}
}


/*

sfxSeq() plays a quick sequence of notes.

arguments:
num = number of notes
baseF = base frequency
fDif = difference in frequency between notes
baseT = base note length
tDif = change in note length
timebetween = time between notes
tbDif = change in time between notes
wave = waveform function
comb = comb filter value
vol = volume

*/
function sfxSeq(num,baseF,fDif,baseT,tDif,timeBetween,tbDif,wave,comb,vol){
  for(let i=0; i<num; i++){
    let freq = baseF+fDif*i;
    let leng = baseT+tDif*i;
    setTimeout( function(){
      loadAndPlay(
        wave,
        comb,
        leng,
        vol,
        freq, false
      );
    }, i*(timeBetween+i*tbDif))
  }
}
