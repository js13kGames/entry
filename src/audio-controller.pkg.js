function initMusic () {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.5;

  let lastScheduledNote = {
    drum: 1,
    synth: 1
  }

  function makeSound(startTime, wave, sweepLength, freq, endFreq) {
    var oscillator = audioCtx.createOscillator();
    oscillator.type = wave;

    let sweepEnv = audioCtx.createGain();
    sweepEnv.gain.cancelScheduledValues(startTime);
    sweepEnv.gain.setValueAtTime(0, startTime);
    // set our attack
    sweepEnv.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
    // set our release
    sweepEnv.gain.linearRampToValueAtTime(0, startTime + sweepLength);

    oscillator.frequency.setValueAtTime(freq, startTime); // value in hertz
    if (endFreq) oscillator.frequency.exponentialRampToValueAtTime(endFreq, startTime + sweepLength);
    oscillator.connect(sweepEnv).connect(masterGain).connect(audioCtx.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + sweepLength);
  }

  function makeDrumNote(startTime) {
    makeSound(startTime, 'sine', 1, 200);
  }

  function makeSynthNote(startTime) {
    const frequencies = [200, 236, 284, 300];
    makeSound(
      startTime,
      'triangle',
      random() * 10 + 1,
      frequencies[floor(random() * frequencies.length)]
    );
  }

  function getNextStartTime(interval, key) {
    return lastScheduledNote[key] + interval;
  }

  function scheduleNextNote(interval, makeSound, key) {
    const currentTime = audioCtx.currentTime;
    while ((currentTime + 2) > lastScheduledNote[key]) {
      const nextTime = getNextStartTime(interval, key);
      makeSound(nextTime);
      lastScheduledNote[key] = nextTime;
    }
  }

  function scheduleInstruments() {
    // drum
    scheduleNextNote(.5, makeDrumNote, 'drum');

    // generative
    const intervals = [.25, .5, .75, 1, 1.25, 1.5];
    scheduleNextNote(
      intervals[floor(random() * intervals.length)],
      makeSynthNote,
      'synth'
    );
  }

  function playMusic () {
    setInterval(scheduleInstruments, 100);
    return true;
  }

  function pizzaSound () {
    makeSound(audioCtx.currentTime, 'triangle', 0.25, 350, 440);
  }

  function punchSound () {
    console.log('punch');
    makeSound(audioCtx.currentTime, 'square', 0.15, 200, 100);
  }

  return {playMusic, pizzaSound, punchSound};
}
