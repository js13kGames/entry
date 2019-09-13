/*
mus.js, where the music stuff happens
*/

// harmonics for the organ sound (freq,amplitude,phase)
let organ= [
  {f:499.98 ,a:0.05024,p:-79.26},
  {f:989.78, a:0.01608,p:10.89},
  {f:1489.66,a:0.02179,p:-13.22},
  {f:1989.55,a:0.03411,p:-30.97},
  {f:2489.44,a:0.01904,p:156.26},
  {f:2989.32,a:0.03099,p:-54.57},
  {f:3469.21,a:0.00796,p:-49.46},
  {f:3979.10,a:0.01728,p:-129.91},
];

// length of an 8th note in frames
let lengthOf8 = 8;
// time counter
let time =0;

// startsound()
// start audio context on click
function startSound(){
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
}

// Bourée I (molto allegro) from JS Bach's English Suite II. thank you Max Scebba for the suggestion!
// note on these strings:
// here, each character represents 1 number (1 or 2 digits), not two 1-digit numbers like in the image unpacking process.
// also, characters are converted to note values as they are played - in function playVoice() - not during preload.
// since it's maximum 2 notes being played at a time, i saw no need to add separate text to unpack these.

var voices = [
  {
    notes: "UPNPQPNPIIUPNPQPNPNLNLNPNLNLKLKLNLNPNLPNLKLNLKLILKNLKIPLKIPLKINLKINKIGNKIGNKIGLKIGLIGFLIGFLIGFKIGFKGFGIGFGFDFGIKFGIFGIGFIGDGKGKPKPSPSUSRPRPOWRPOWSRPWSRPWOMKWNLKNPRKOP",
    durations:"**))*))*****))*))*))*))*))*))*))*))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))*))*))))))))))))))))))))))))))))))))))))))))))))))))))))))****.",
    nextTrigger:0,
    noteCounter:0,
  },
  {
    notes: "=?@=@=B=B=@=B=@=?=@=@=B=B=@=@=?=?=<?:?<?8?=8=8?8?8@8=8?8<8=848148;:=6:/36:8;48.1487:378383737383,383837373838;8;?DC?C?D?8;=;=:;=?3DEDB@?",
    durations:"))))))))))))))))))))))))))))))))))))))))))))))))))))))))))****************************))))))))****))))))))************************))))))",
    nextTrigger:0,
    noteCounter:0
  }
]

// runbgm()
// play the music
function  runBGM(){

  // play lower voice
  playVoice(1,organWaveAt,0.25,10,0.19,0.5)
  // play top voice. has a modulating comb filter
  playVoice(0,organWaveAt,0.25,40+frame%3000,0.45,0.3);
  // play random drums
  playDrum();
  // increment time
  time++;
}

// playdrum()
// this triggers random drums:
// play random drum hits on 16th, 8th or quarter notes using a weighted chance system

function playDrum(){

  let stim = Math.random();
  let drum;

  // if time = quarter note
  if(checkTime(2)) drum=chanceToPlay( stim ,1, 7,2,1 );
  // if time = eight note
  else if(checkTime(1)) drum=chanceToPlay( stim ,0.5, 3,2,1 );
  // if time = 16th note
  else if(checkTime(0.5)) drum=chanceToPlay( stim ,0.9,0,2,8 );

  // if a drum note is returned, play it
  if(drum!=undefined){
    let tone =  drum.base+Math.random()*drum.vari;
    loadAndPlay(noiseAt,5,0.45,drum.vol,tone,true);
  }
}

// checktime()
// check if time value lands on a given multiple of an eight note
function checkTime(fact){
  return time%(lengthOf8*fact)==0
}

// chanceToplay()
// trigger a low, mid or high drum note.
// odds are given by values t1, t2 and t3.
// var chance determines whether to play a note or not at all.
// var stim is a random value i like to call stimulus.
// returns the characteristics of the drum sound for buffering.

function chanceToPlay(stim,chance,t1,t2,t3){
  if(stim<chance){
    let total = t1+t2+t3;
    if(stim<t1/total) return {base:20,vari:5,vol:0.04};
    else if(stim<(t1+t2)/total) return {base:4000,vari:1000,vol:0.04};
    else return {base:10000,vari:1000,vol:0.01};
  }
}

// playvoice()
// play notes using a given array of notes and durations.

function playVoice(input,waveGen,fact,comb,length,vol){

  let voice = voices[input];
  if(time===voice.nextTrigger) {

    let index=voice.noteCounter;
    let noteLength = voice.durations.charCodeAt( index )-40;
    let seconds = noteLength*length,
    tone = Math.pow(2, ( voice.notes.charCodeAt( index )-64)/12)*fact
    // play the note
    if(input===0&&player.babiesCarried>0) {
      waveGen = sineWaveAt;
      vol =0.05;
      tone = tone*499.98*Math.pow(2,player.babiesCarried);
      comb =player.babiesCarried*50;
    }

    if(input===0) clouds.push(new cloud(clouds.length))
    loadAndPlay(waveGen,comb,seconds,vol,tone,false);

    // set next time at which to trigger next note
    voices[input].nextTrigger = time+noteLength*lengthOf8;

    // continue and reset loop
    voices[input].noteCounter++;
    if(voice.noteCounter>=voice.notes.length) voices[input].noteCounter=0;
  }
}

// loadAndPlay()
// create an array representation of a sound to play then trigger playing it.

function loadAndPlay(waveGen,comb,seconds,volume,tone,isDrum){

  let combDist;
  let arr = [];
  if(comb!=false) combDist = comb;
  let vol = 0;
  let length = context.sampleRate * seconds;

  // for each point in the array (22k*seconds)
  for (var i = 0; i < length; i++) {
    let pos = i/length;

    // attack and release
    if(pos>0.7) vol = constrain(vol-0.0003,0,volume);
    else if(pos<0.1) vol = constrain(vol+0.005,0,volume);

    // calculate camplitude of this point on waveform using some kind of
    // wave generating function like sinWaveAt() or noiseAt()
    arr[i] = waveGen(i, tone) * vol

    // apply comb filter
    if(i>=combDist &&i +10<length&&comb!=false&&isDrum) {
    for(let j=0; j<4; j++){
      arr[i-combDist + j*2] -= arr[ Math.round(i-combDist + j*2+1)];
    }
    }
    else if(i>=combDist &&i +10<length&&comb!=false)arr[i-combDist] += arr[i];
  }

  // play this array
  playSound(arr)
}

// loadSlidingSound()
// same as loadAndPlay()
// but slides from one frequency to another
function loadSlidingSound(waveGen,comb,seconds,volume,tone,tone2){
  let combDist;
  let arr = [];
  let length = context.sampleRate * seconds;
  let vol = 0;
  let returnVel = 0.01*seconds;
  if(comb!=false) combDist = comb;

  for (var i = 0; i < length; i++) {
    let pos = i/length;
    let freq = tone+ pos*(tone2-tone);
    if(pos>0.7) vol = constrain(vol-returnVel,0,1);
    else if(pos<0.1) vol = constrain(vol+returnVel,0,volume);
    arr[i] = waveGen(i, freq) * vol
    if(i>=combDist&&comb!=false) arr[i-combDist] += arr[i];
  }

  playSound(arr)
}

// playsound()
// taken from https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBufferSource ,
// as well as the stackoverflow question below.
// buffers a sound array and plays it.

function playSound(arr) {
  var buf = new Float32Array(arr.length)
  for (var i = 0; i < arr.length; i++) buf[i] = arr[i]
  var buffer = context.createBuffer(1, buf.length, context.sampleRate)
  buffer.copyToChannel(buf, 0)
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}

// sinewaveat()
// grabbed from exebook's answer in stackoverflow:
// https://stackoverflow.com/questions/34708980/generate-sine-wave-and-play-it-in-the-browser
// used this as a model for to create the wave generating functions below.
// this generates a sine wave.

function sineWaveAt(sampleNumber, tone) {
  let sampleFreq = context.sampleRate / tone
  return Math.sin(sampleNumber / (sampleFreq / (Math.PI*2)));
}

// noiseat()
// this combines a random value with a sawtooth-like wave to create pitched drums.

function noiseAt(sampleNumber, tone) {
  let sampleFreq = context.sampleRate / tone;
  let amp = constrain(Math.pow(sampleNumber,2)/15000000,0.1,0.9);
  let noiseAmp = 4;
  let wavAmp = constrain(6-tone/4000,0,20000);
  if(sampleNumber%2===0) return 0;
  else return (-noiseAmp/2 + Math.random()*noiseAmp + wavAmp*roundedSineWaveAt(sampleNumber,tone))*(1-amp);
}

// roundedsinwaveat()
// simple variation on a sine wave that returns a sawtooth-like thing

function roundedSineWaveAt(sampleNumber, tone) {
  let sampleFreq = context.sampleRate / tone
  return Math.round(Math.sin(sampleNumber / (sampleFreq / (Math.PI*2))));
}

// organwaveat()
// combines harmonics at a given frequency to generate an "organ sound".
// it's actually a tiny sample of a violin waveform. the table of harmonics I grabbed from here:
// https://www.chegg.com/homework-help/questions-and-answers/waveform-extracted-sound-file-violinwav-shown-fig-1-lot-features-make-problem-simpler-with-q32940112
// a violin sound isn't periodic, but an organ is, and the harmonics of its registers
// are traditionally designed to match orchestral timbres.
// thus why this "violin" sounds like an organ.

function organWaveAt(sampleNumber,transpose){

  let t = sampleNumber/context.sampleRate;
  let result=0;
  for(let i=0; i<organ.length; i++){
    result += organ[i].a * Math.cos( 2*Math.PI*transpose*organ[i].f*t+organ[i].p );
  }
  return result;
}
