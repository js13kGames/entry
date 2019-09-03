function playMusic () {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.5;

  function playNote(freq = 200, sweepLength = 1, wave = 'sine') {
    var oscillator = audioCtx.createOscillator();
    oscillator.type = wave;

    let sweepEnv = audioCtx.createGain();
    sweepEnv.gain.cancelScheduledValues(audioCtx.currentTime);
    sweepEnv.gain.setValueAtTime(0, audioCtx.currentTime);
    // set our attack
    sweepEnv.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01);
    // set our release
    sweepEnv.gain.linearRampToValueAtTime(0, audioCtx.currentTime + sweepLength - 0.5);

    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz
    oscillator.connect(sweepEnv).connect(masterGain).connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + sweepLength);
  }

  (function playNotes() {
    const intervals = [250, 500, 750, 1000, 1250, 1500];
    const frequencies = [200, 236, 284, 300];
    let time = Math.floor(Math.random() * intervals.length);
    const freq = Math.floor(Math.random() * frequencies.length);
    const sweepLength = Math.random() * 10;
    playNote(frequencies[freq], sweepLength, 'triangle');
    setTimeout(playNotes, intervals[time]);
  })();

  (function playDrum() {
    setInterval(playNote, 500);
  })();
  return true;
}
